import { renderHook } from "@testing-library/react-hooks";
import * as pathlib from "path";
import { useState } from "react";
import { getDoc } from "../../../dist/getFunctions";
import { useSetContext } from "../../../dist/provider";
import { setDoc, updateDoc } from "../../../dist/setFunctions";
import db from "../firestore";

const useTestFn = (fn, { path, fql, onSet, options = {} }) => {
  useSetContext(db);
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
  useSetContext(db);
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

describe("setDoc", () => {
  const path = "/setDocTest/doc1";
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
  it("should handle a simple query", async () => {
    const onSet = () => {};
    // set doc
    const hooks1 = renderHook(() => useTestFn(setDoc, { path, onSet, fql }));
    await hooks1.waitForNextUpdate();

    // check written doc
    const expected = {
      data: fql.fields,
      id: pathlib.basename(path),
    };
    const onGet = docData => {
      expect(docData).toEqual(expected);
    };
    const hooks2 = renderHook(() => useCheckResult({ path, onGet }));
    await hooks2.waitForNextUpdate();
  });
  it("setDoc merge option", async () => {
    // set doc (create doc)
    const onSet = () => {};
    const hooks1 = renderHook(() => useTestFn(setDoc, { path, onSet, fql }));
    await hooks1.waitForNextUpdate();

    // set doc (merge true)
    const onUpdate = () => {};
    const hooks2 = renderHook(() =>
      useTestFn(setDoc, {
        path,
        onSet: onUpdate,
        fql: fql2,
        options: {
          merge: true,
        },
      }),
    );
    await hooks2.waitForNextUpdate();

    // check updated doc
    const expected = {
      data: Object.assign(fql.fields, fql2.fields),
      id: pathlib.basename(path),
    };
    const onGet = docData => {
      expect(docData).toEqual(expected);
    };
    const hooks3 = renderHook(() => useCheckResult({ path, onGet }));
    await hooks3.waitForNextUpdate();
  });
  it("setDoc mergeFields option", async () => {
    // https://firebase.google.com/docs/reference/js/firebase.firestore.SetOptions.html
    // Changes the behavior of set() calls to only replace the specified field paths.
    // Any field path that is not specified is ignored and remains untouched.

    // set doc (create doc)
    const onSet = () => {};
    const hooks1 = renderHook(() => useTestFn(setDoc, { path, onSet, fql }));
    await hooks1.waitForNextUpdate();

    // set doc (mergeFields specified)
    const onUpdate = () => {};
    const hooks2 = renderHook(() =>
      useTestFn(setDoc, {
        path,
        onSet: onUpdate,
        fql: fql2,
        options: {
          mergeFields: ["field2"],
        },
      }),
    );
    await hooks2.waitForNextUpdate();

    // check updated doc
    const expected = {
      data: { ...fql.fields, field2: fql2.fields.field2 },
      id: pathlib.basename(path),
    };
    const onGet = docData => {
      expect(docData).toEqual(expected);
    };
    const hooks3 = renderHook(() => useCheckResult({ path, onGet }));
    await hooks3.waitForNextUpdate();
  });
  it("updateDoc", async () => {
    // set doc (create doc)
    const onSet = () => {};
    const hooks1 = renderHook(() => useTestFn(setDoc, { path, onSet, fql }));
    await hooks1.waitForNextUpdate();

    // update doc
    const onUpdate = () => {};
    const hooks2 = renderHook(() => useTestFn(updateDoc, { path, onSet: onUpdate, fql: fql2 }));
    await hooks2.waitForNextUpdate();

    // check updated doc
    const expected = {
      data: Object.assign(fql.fields, fql2.fields),
      id: pathlib.basename(path),
    };
    const onGet = docData => {
      expect(docData).toEqual(expected);
    };
    const hooks3 = renderHook(() => useCheckResult({ path, onGet }));
    await hooks3.waitForNextUpdate();
  });
});
