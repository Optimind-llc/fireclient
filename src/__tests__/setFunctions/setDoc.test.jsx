import { renderHook } from "@testing-library/react-hooks";
import * as pathlib from "path";
import { useState, useEffect } from "react";
import { getDoc } from "../../../dist/getFunctions";
import { useSetContext } from "../../../dist/provider";
import { setDoc, updateDoc } from "../../../dist/setFunctions";
import { app, db } from "../firestore";

const useTestFn = (fn, { path, fql, onSet, options = {}, onAccess = undefined }) => {
  useSetContext(db, onAccess);
  const [finished, setFinished] = useState(false);
  const onError = err => {
    throw new Error(err);
  };
  useEffect(
    () =>
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
      ),
    [],
  );
  return finished;
};

const useCheckResult = ({ path, onGet }) => {
  useSetContext(db);
  const [finished, setFinished] = useState(false);
  const onError = err => {
    throw new Error(err);
  };
  useEffect(
    () =>
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
      ),
    [],
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
  const updateFql = {
    fields: {
      field2: Math.random(),
      field3: Math.random(),
    },
  };
  afterAll(async () => await app.delete());
  it("should handle a simple query", async () => {
    let accessCount = 0;
    const onSet = () => {
      /* do nothing */
    };
    // set doc
    const setDocHooks = renderHook(() =>
      useTestFn(setDoc, { path, onSet, fql, onAccess: () => accessCount++ }),
    );
    await setDocHooks.waitForNextUpdate();
    expect(accessCount).toBe(1);

    // check written doc
    const expected = {
      data: fql.fields,
      id: pathlib.basename(path),
    };
    const onGet = docData => {
      expect(docData).toEqual(expected);
    };
    const checkDocHook = renderHook(() => useCheckResult({ path, onGet }));
    await checkDocHook.waitForNextUpdate();
    expect(accessCount).toBe(2);
  });
  it("setDoc merge option", async () => {
    let accessCount = 0;
    // set doc (create doc)
    const onSet = () => {
      /* do nothing */
    };
    const setDocHooks = renderHook(() =>
      useTestFn(setDoc, { path, onSet, fql, onAccess: () => accessCount++ }),
    );
    await setDocHooks.waitForNextUpdate();
    expect(accessCount).toBe(1);

    // set doc (merge true)
    const onUpdate = () => {
      /* do nothing */
    };
    const setDocWithMergeTrueHooks = renderHook(() =>
      useTestFn(setDoc, {
        path,
        onSet: onUpdate,
        fql: updateFql,
        options: {
          merge: true,
        },
      }),
    );
    await setDocWithMergeTrueHooks.waitForNextUpdate();
    expect(accessCount).toBe(2);

    // check updated doc
    const expected = {
      data: Object.assign(fql.fields, updateFql.fields),
      id: pathlib.basename(path),
    };
    const onGet = docData => {
      expect(docData).toEqual(expected);
    };
    const checkDocHook = renderHook(() => useCheckResult({ path, onGet }));
    await checkDocHook.waitForNextUpdate();
    expect(accessCount).toBe(3);
  });
  it("setDoc mergeFields option", async () => {
    let accessCount = 0;
    // https://firebase.google.com/docs/reference/js/firebase.firestore.SetOptions.html
    // Changes the behavior of set() calls to only replace the specified field paths.
    // Any field path that is not specified is ignored and remains untouched.

    // set doc (create doc)
    const onSet = () => {
      /* do nothing */
    };
    const setDocHook = renderHook(() =>
      useTestFn(setDoc, { path, onSet, fql, onAccess: () => accessCount++ }),
    );
    await setDocHook.waitForNextUpdate();
    expect(accessCount).toBe(1);

    // set doc (mergeFields specified)
    const onUpdate = () => {
      /* do nothing */
    };
    const setDocWithMergeFieldsHook = renderHook(() =>
      useTestFn(setDoc, {
        path,
        onSet: onUpdate,
        fql: updateFql,
        options: {
          mergeFields: ["field2"],
        },
      }),
    );
    await setDocWithMergeFieldsHook.waitForNextUpdate();
    expect(accessCount).toBe(2);

    // check updated doc
    const expected = {
      data: { ...fql.fields, field2: updateFql.fields.field2 },
      id: pathlib.basename(path),
    };
    const onGet = docData => {
      expect(docData).toEqual(expected);
    };
    const checkDocHook = renderHook(() => useCheckResult({ path, onGet }));
    await checkDocHook.waitForNextUpdate();
    expect(accessCount).toBe(3);
  });
  it("updateDoc", async () => {
    let accessCount = 0;
    // set doc (create doc)
    const onSet = () => {
      /* do nothing */
    };
    const setDocHook = renderHook(() =>
      useTestFn(setDoc, { path, onSet, fql, onAccess: () => accessCount++ }),
    );
    await setDocHook.waitForNextUpdate();
    expect(accessCount).toBe(1);

    // update doc
    const onUpdate = () => {
      /* do nothing */
    };
    const updateDocHook = renderHook(() =>
      useTestFn(updateDoc, { path, onSet: onUpdate, fql: updateFql }),
    );
    await updateDocHook.waitForNextUpdate();
    expect(accessCount).toBe(2);

    // check updated doc
    const expected = {
      data: Object.assign(fql.fields, updateFql.fields),
      id: pathlib.basename(path),
    };
    const onGet = docData => {
      expect(docData).toEqual(expected);
    };
    const checkDocHook = renderHook(() => useCheckResult({ path, onGet }));
    await checkDocHook.waitForNextUpdate();
    expect(accessCount).toBe(3);
  });
});
