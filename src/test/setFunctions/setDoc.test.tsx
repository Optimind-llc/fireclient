import { renderHook } from "@testing-library/react-hooks";
import * as pathlib from "path";
import { useState } from "react";
import { setContext } from "../../../dist";
import { getDoc } from "../../../dist/getFunctions";
import { setDoc, updateDoc } from "../../../dist/setFunctions";
import db from "../firestore";

const useTestFn = (fn, { path, fql, onSet }) => {
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
    { saveToState: false },
  );
  return finished;
};

const useCheckResult = ({ path, onGet }) => {
  setContext(db);
  const [finished, setFinished] = useState(false);
  const onError = err => {
    throw new Error(err);
  };
  getDoc(
    path,
    doc => {
      onGet(doc);
      setFinished(true);
    },
    err => {
      onError(err);
      setFinished(true);
    },
    false,
    false,
  );
  return finished;
};

describe("should handle a simple query", () => {
  const fql = {
    fields: {
      field1: Math.random(),
      field2: Math.random(),
      field3: Math.random(),
      field4: Math.random(),
    },
  };
  const fql2 = {
    fields: {
      field2: Math.random(),
      field3: Math.random(),
    },
  };
  it("setDoc", async () => {
    const onSet = () => {};
    // set doc
    const hooks1 = renderHook(() =>
      useTestFn(setDoc, { path: "/setFunctionsTest/setDoc", onSet, fql }),
    );
    await hooks1.waitForNextUpdate();

    // check written doc
    const expected = {
      data: fql.fields,
      id: pathlib.basename("/setFunctionsTest/setDoc"),
    };
    const onGet = docData => {
      expect(docData).toEqual(expected);
    };
    const hooks2 = renderHook(() => useCheckResult({ path: "/setFunctionsTest/setDoc", onGet }));
    await hooks2.waitForNextUpdate();
  });
  it("updateDoc", async () => {
    // set doc (create doc)
    const onSet = () => {};
    const hooks1 = renderHook(() =>
      useTestFn(setDoc, { path: "/setFunctionsTest/updateDoc", onSet, fql }),
    );
    await hooks1.waitForNextUpdate();

    // update doc
    const onUpdate = () => {};
    const hooks2 = renderHook(() =>
      useTestFn(updateDoc, { path: "/setFunctionsTest/updateDoc", onSet: onUpdate, fql: fql2 }),
    );
    await hooks2.waitForNextUpdate();

    // check updated doc
    const expected = {
      data: Object.assign(fql.fields, fql2.fields),
      id: pathlib.basename("/setFunctionsTest/updateDoc"),
    };
    const onGet = docData => {
      expect(docData).toEqual(expected);
    };
    const hooks3 = renderHook(() => useCheckResult({ path: "/setFunctionsTest/updateDoc", onGet }));
    await hooks3.waitForNextUpdate();
  });
});
