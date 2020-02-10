import { renderHook } from "@testing-library/react-hooks";
import { fromJS } from "immutable";
import * as pathlib from "path";
import { useState } from "react";
import { setContext } from "../../../dist";
import { getCollection } from "../../../dist/getFunctions";
import { setCollection } from "../../../dist/setFunctions";
import db from "../firestore";

const useTestFn = (fn, { path, fql, onSet, options = {} }) => {
  setContext(db);
  const [finished, setFinished] = useState(false);
  const onError = err => {
    throw new Error(err);
  };
  fn(
    path,
    fql,
    () => {
      setFinished(true);
      onSet();
    },
    err => {
      setFinished(true);
      onError(err);
    },
    { saveToState: false, ...options },
  );
  return finished;
};

const useCheckResult = ({ path, onGet }) => {
  setContext(db);
  const [finished, setFinished] = useState(false);
  const onError = err => {
    throw new Error(err);
  };
  getCollection(
    path,
    doc => {
      onGet(doc);
      setFinished(true);
    },
    err => {
      onError(err);
      setFinished(true);
    },
    {
      order: {
        by: "field1",
      },
    },
    false,
    false,
  );
  return finished;
};

describe("setCollection", () => {
  const path = "/setCollectionTest";
  const fql = [
    {
      id: "doc1",
      fields: {
        field1: Math.random(),
      },
    },
    {
      id: "doc2",
      fields: {
        field1: Math.random(),
      },
    },
    {
      id: "doc3",
      fields: {
        field1: Math.random(),
      },
    },
  ];
  it("should handle a simple query", async () => {
    const onSet = () => {};
    // set doc
    const hooks1 = renderHook(() => useTestFn(setCollection, { path, onSet, fql }));
    await hooks1.waitForNextUpdate();
    const expected = fromJS(fql)
      .map(f => ({
        data: f.get("fields"),
        id: f.get("id"),
      }))
      .sortBy(f => f.data.get("field1"))
      .toJS();
    const onGet = collectionData => {
      expect(collectionData).toEqual(expected);
    };
    const hooks2 = renderHook(() => useCheckResult({ path, onGet }));
    await hooks2.waitForNextUpdate();
  });
});
