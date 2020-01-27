import React, { useState } from "react";
import { shallow, mount } from "./enzyme";
import { act } from "react-dom/test-utils";
import { Provider, useGetDoc } from "../../dist";
import db from "./firestore";

const Wrapper = ({ options }) => {
  const [doc, loading, error, reloadFn] = useGetDoc("/cities/Tokyo", options);
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

describe("useGetDoc", () => {
  it("Before fetching doc", () => {
    const app = mount(
      <Provider firestoreDB={db}>
        <Wrapper />
      </Provider>,
    );

    const obj = JSON.parse(app.find(".obj").text());
    const { doc, loading, error, accessCount } = obj;
    expect(doc.data).toEqual(null);
    expect(doc.id).toEqual(null);
    expect(loading).toEqual(true);
    expect(error).toEqual(null);
  });
  it("After fetching doc", done => {
    let app;
    const callback = () => {
      const obj = JSON.parse(app.find(".obj").text());
      const { doc, loading, error } = obj;
      expect(doc.data.country).toEqual("Japan");
      expect(doc.data.name).toEqual("Tokyo");
      expect(doc.data.population).toEqual(35676000);
      expect(doc.id).toEqual("Tokyo");
      expect(loading).toEqual(false);
      expect(error).toEqual(null);
      app.find("button").simulate("click");
      done();
    };
    app = mount(
      <Provider firestoreDB={db}>
        <Wrapper options={{ callback }} />
      </Provider>,
    );
  });
});

describe("options type error check", () => {
  const fn = options => () =>
    mount(
      <Provider firestoreDB={db}>
        <Wrapper options={options} />
      </Provider>,
    );
  it("callback", () => {
    expect(fn({ callback: 1 })).toThrow();
    expect(fn({ callback: { foo: 123 } })).toThrow();
    expect(fn({ callback: "foo" })).toThrow();
    expect(fn({ callback: [1, 2, 3] })).toThrow();
    expect(fn({ callback: null })).toThrow();
    expect(fn({ callback: true })).toThrow();
    expect(fn({ callback: () => console.log("foo") })).not.toThrow();
  });
  it("acceptOutdated", () => {
    expect(fn({ acceptOutdated: 1 })).toThrow();
    expect(fn({ acceptOutdated: { foo: 123 } })).toThrow();
    expect(fn({ acceptOutdated: "foo" })).toThrow();
    expect(fn({ acceptOutdated: [1, 2, 3] })).toThrow();
    expect(fn({ acceptOutdated: null })).toThrow();
    expect(fn({ acceptOutdated: true })).not.toThrow();
    expect(fn({ acceptOutdated: () => console.log("foo") })).toThrow();
  });
});
