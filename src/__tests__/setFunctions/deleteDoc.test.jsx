import { renderHook } from "@testing-library/react-hooks";
import * as pathlib from "path";
import { useState, useEffect } from "react";
import { getDoc } from "../../../dist/getFunctions";
import { deleteDoc } from "../../../dist/setFunctions";
import { useSetContext } from "../../../dist/provider";
import { setDoc, updateDoc } from "../../../dist/setFunctions";
import { app, db } from "../firestore";
import { access } from "fs";

const useSetDoc = ({ path, fql, onSet, onAccess = undefined }) => {
  useSetContext(db, onAccess);
  const [finished, setFinished] = useState(false);
  const onError = err => {
    throw new Error(err);
  };
  useEffect(
    () =>
      setDoc(
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
      ),
    [],
  );
  return finished;
};

const useDeleteDoc = ({ path, onSet, onAccess = undefined }) => {
  useSetContext(db, onAccess);
  const [finished, setFinished] = useState(false);
  const onError = err => {
    throw new Error(err);
  };
  useEffect(
    () =>
      deleteDoc(
        path,
        () => {
          setFinished(true);
          onSet();
        },
        err => {
          setFinished(true);
          onError(err);
        },
        { saveToState: false },
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

describe("deleteDoc", () => {
  const path = "/deleteDocTest/doc1";
  const fql = {
    fields: {
      field1: Math.random(),
      field2: Math.random(),
      field3: Math.random(),
      field4: Math.random(),
    },
  };
  afterAll(async () => await app.delete());
  it("should handle a simple query", async () => {
    let accessCount = 0;
    const onSet = () => {
      /* do nothing */
    };
    // set doc
    const useSetDocHook = renderHook(() =>
      useSetDoc({
        path,
        onSet,
        fql,
        onAccess: () => accessCount++,
      }),
    );
    await useSetDocHook.waitForNextUpdate();
    expect(accessCount).toBe(1);

    // check written doc
    const expectedAfterSetDoc = {
      data: fql.fields,
      id: pathlib.basename(path),
    };

    const checkAfterSetDocHook = renderHook(() =>
      useCheckResult({
        path,
        onGet: docData => {
          expect(docData).toEqual(expectedAfterSetDoc);
        },
      }),
    );
    await checkAfterSetDocHook.waitForNextUpdate();
    expect(accessCount).toBe(2);

    // delete doc
    const deleteDocHook = renderHook(() => useDeleteDoc({ path, onSet }));
    await deleteDocHook.waitForNextUpdate();
    expect(accessCount).toBe(3);

    // check deleted doc
    const expectedAfterDeleteDoc = {
      data: null,
      id: pathlib.basename(path),
    };

    const checkAfterDeleteDocHook = renderHook(() =>
      useCheckResult({
        path,
        onGet: docData => {
          expect(docData).toEqual(expectedAfterDeleteDoc);
        },
      }),
    );
    await checkAfterDeleteDocHook.waitForNextUpdate();
    expect(accessCount).toBe(4);
  });
});
