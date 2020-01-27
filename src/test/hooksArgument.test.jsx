import React, { useState } from "react";
import { shallow, mount } from "./enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "../../dist";
import {
  useLazyGetDocSnapshot,
  useGetDocSnapshot,
  useSubscribeDocSnapshot,
  useLazyGetDoc,
  useGetDoc,
  useSubscribeDoc,
} from "../../dist";
import {
  useLazyGetCollectionSnapshot,
  useGetCollectionSnapshot,
  useSubscribeCollectionSnapshot,
  useLazyGetCollection,
  useGetCollection,
  useSubscribeCollection,
} from "../../dist";
import db from "./firestore";

const fn = (hooks, options) => () =>
  mount(
    <Provider firestoreDB={db}>
      <Wrapper options={options} hooks={hooks} />
    </Provider>,
  );

const Wrapper = ({ options, hooks }) => {
  const [doc, loading, error, reloadFn] = hooks("/cities/Tokyo", options);
  return (
    <>
      <span className="obj">
        {JSON.stringify({
          doc,
          loading,
          error,
        })}
      </span>
      <button onClick={reloadFn}></button>
    </>
  );
};

const docHooksEntries = Object.entries({
  useLazyGetDocSnapshot,
  useGetDocSnapshot,
  useSubscribeDocSnapshot,
  useLazyGetDoc,
  useGetDoc,
  useSubscribeDoc,
});

docHooksEntries.forEach(([key, hooks]) => {
  describe(key, () => {
    it("callback", () => {
      expect(fn(hooks, { callback: 1 })).toThrow();
      expect(fn(hooks, { callback: { foo: 123 } })).toThrow();
      expect(fn(hooks, { callback: "foo" })).toThrow();
      expect(fn(hooks, { callback: [1, 2, 3] })).toThrow();
      expect(fn(hooks, { callback: null })).toThrow();
      expect(fn(hooks, { callback: true })).toThrow();
      expect(fn(hooks, { callback: () => console.log("foo") })).not.toThrow();
    });
    if (!key.includes("Subscribe")) {
      it("acceptOutdated", () => {
        expect(fn(hooks, { acceptOutdated: 1 })).toThrow();
        expect(fn(hooks, { acceptOutdated: { foo: 123 } })).toThrow();
        expect(fn(hooks, { acceptOutdated: "foo" })).toThrow();
        expect(fn(hooks, { acceptOutdated: [1, 2, 3] })).toThrow();
        expect(fn(hooks, { acceptOutdated: null })).toThrow();
        expect(fn(hooks, { acceptOutdated: true })).not.toThrow();
        expect(fn(hooks, { acceptOutdated: () => console.log("foo") })).toThrow();
      });
    }
  });
});

const collectionHooksEntries = Object.entries({
  useLazyGetCollectionSnapshot,
  useGetCollectionSnapshot,
  useSubscribeCollectionSnapshot,
  useLazyGetCollection,
  useGetCollection,
  useSubscribeCollection,
});

collectionHooksEntries.forEach(([key, hooks]) => {
  describe(key, () => {
    it("callback", () => {
      expect(fn(hooks, { callback: 1 })).toThrow();
      expect(fn(hooks, { callback: { foo: 123 } })).toThrow();
      expect(fn(hooks, { callback: "foo" })).toThrow();
      expect(fn(hooks, { callback: [1, 2, 3] })).toThrow();
      expect(fn(hooks, { callback: null })).toThrow();
      expect(fn(hooks, { callback: true })).toThrow();
      expect(fn(hooks, { callback: () => console.log("foo") })).not.toThrow();
    });
    it("where", () => {
      expect(fn(hooks, { where: 1 })).toThrow();
      expect(fn(hooks, { where: "foo" })).toThrow();
      expect(fn(hooks, { where: [1, 2, 3] })).toThrow();
      expect(fn(hooks, { where: null })).toThrow();
      expect(fn(hooks, { where: true })).toThrow();
      expect(fn(hooks, { where: () => console.log("foo") })).toThrow();
      expect(fn(hooks, { where: { foo: 123 } })).toThrow();
      expect(
        fn(hooks, { where: { field: "population", operator: ">", value: 123 } }),
      ).not.toThrow();
      expect(
        fn(hooks, {
          where: [
            { field: "foo", operator: ">", value: 123 },
            { field: "bar", operator: ">", value: 123 },
          ],
        }),
      ).not.toThrow();
      expect(
        fn(hooks, {
          where: [
            { field: "foo", operator: ">", value: 123 },
            { asdf: "bar", operator: ">", value: 123 },
          ],
        }),
      ).toThrow();
      expect(fn(hooks, { where: { asdf: "population", operator: ">", value: 123 } })).toThrow();
      expect(fn(hooks, { where: { asdf: "population", value: 123 } })).toThrow();
      expect(fn(hooks, { where: { asdf: "population", operator: ">" } })).toThrow();
      expect(fn(hooks, { where: { field: 123, operator: "@", value: 123 } })).toThrow();
      expect(fn(hooks, { where: { field: "population", operator: 123, value: 123 } })).toThrow();
      expect(fn(hooks, { where: { field: { foo: 123 }, operator: "@", value: 123 } })).toThrow();
    });
    it("limit", () => {
      expect(fn(hooks, { limit: 1 })).not.toThrow();
      expect(fn(hooks, { limit: "foo" })).toThrow();
      expect(fn(hooks, { limit: [1, 2, 3] })).toThrow();
      expect(fn(hooks, { limit: null })).toThrow();
      expect(fn(hooks, { limit: true })).toThrow();
      expect(fn(hooks, { limit: () => console.log("foo") })).toThrow();
      expect(fn(hooks, { limit: { foo: 123 } })).toThrow();
    });
    it("order", () => {
      expect(fn(hooks, { order: 1 })).toThrow();
      expect(fn(hooks, { order: "foo" })).toThrow();
      expect(fn(hooks, { order: [1, 2, 3] })).toThrow();
      expect(fn(hooks, { order: null })).toThrow();
      expect(fn(hooks, { order: true })).toThrow();
      expect(fn(hooks, { order: () => console.log("foo") })).toThrow();
      expect(fn(hooks, { order: { foo: 123 } })).toThrow();
      expect(fn(hooks, { order: { by: "asdf" } })).not.toThrow();
      expect(fn(hooks, { order: { by: "asdf", direction: "asc" } })).not.toThrow();
      expect(fn(hooks, { order: { by: "asdf", direction: "desc" } })).not.toThrow();
      expect(
        fn(hooks, {
          order: [{ by: "asdf" }, { by: "sdfg", direction: "desc" }],
        }),
      ).not.toThrow();
      expect(
        fn(hooks, {
          order: [{ asdf: "asdf" }, { by: "sdfg", direction: "desc" }],
        }),
      ).toThrow();
      expect(fn(hooks, { order: { by: 123, direction: "asc" } })).toThrow();
      expect(fn(hooks, { order: { by: "asdf", direction: "foo" } })).toThrow();
      expect(fn(hooks, { order: { by: "asdf", direction: null } })).toThrow();
      expect(fn(hooks, { order: { by: null, direction: "asc" } })).toThrow();
      expect(fn(hooks, { order: { by: 123, direction: "asc" } })).toThrow();
      expect(fn(hooks, { order: { by: "asdf", direction: 123 } })).toThrow();
    });
    it("cursor", () => {
      expect(fn(hooks, { cursor: 1 })).toThrow();
      expect(fn(hooks, { cursor: "foo" })).toThrow();
      expect(fn(hooks, { cursor: [1, 2, 3] })).toThrow();
      expect(fn(hooks, { cursor: null })).toThrow();
      expect(fn(hooks, { cursor: true })).toThrow();
      expect(fn(hooks, { cursor: () => console.log("foo") })).toThrow();
      expect(fn(hooks, { cursor: { foo: 123 } })).toThrow();
      expect(
        fn(hooks, {
          cursor: {
            origin: "foo",
            direction: "startAt",
          },
        }),
      ).not.toThrow();
      expect(
        fn(hooks, {
          cursor: {
            origin: 123,
            direction: "endBefore",
            multipleFields: true,
          },
        }),
      ).not.toThrow();
      expect(
        fn(hooks, {
          cursor: [
            {
              origin: 123,
              direction: "startAt",
            },
            {
              origin: 234,
              direction: "startAt",
            },
          ],
        }),
      ).toThrow();
      expect(
        fn(hooks, {
          cursor: {
            aaa: "foo",
            direction: "startAt",
          },
        }),
      ).toThrow();
      expect(
        fn(hooks, {
          cursor: {
            origin: "foo",
            direction: "asdf",
          },
        }),
      ).toThrow();
      expect(
        fn(hooks, {
          cursor: {
            origin: "foo",
            direction: null,
          },
        }),
      ).toThrow();
    });
    if (!key.includes("Subscribe")) {
      it("acceptOutdated", () => {
        expect(fn(hooks, { acceptOutdated: 1 })).toThrow();
        expect(fn(hooks, { acceptOutdated: { foo: 123 } })).toThrow();
        expect(fn(hooks, { acceptOutdated: "foo" })).toThrow();
        expect(fn(hooks, { acceptOutdated: [1, 2, 3] })).toThrow();
        expect(fn(hooks, { acceptOutdated: null })).toThrow();
        expect(fn(hooks, { acceptOutdated: true })).not.toThrow();
        expect(fn(hooks, { acceptOutdated: () => console.log("foo") })).toThrow();
      });
    }
  });
});
