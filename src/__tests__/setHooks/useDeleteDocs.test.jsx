import { renderHook } from "@testing-library/react-hooks";
import * as pathlib from "path";
import {
  useGetDoc,
  useSetDoc,
  useSetDocs,
  useDeleteDoc,
  useDeleteDocs,
  useQuery,
} from "../../../dist";
import { useSetContext } from "../../../dist/provider";
import { app, db } from "../firestore";

describe("useDeleteDocs", () => {
  const path1 = "/useDeleteDocsTest/doc1";
  const path2 = "/useDeleteDocsTest/doc2";
  afterAll(async () => await app.delete());
  it("should handle a simple query", async () => {
    let accessCount = 0;
    const fql = {
      [path1]: {
        fields: {
          field1: Math.random(),
          field2: Math.random(),
          field3: Math.random(),
          field4: Math.random(),
        },
      },
      [path2]: {
        fields: {
          field1: Math.random(),
          field2: Math.random(),
          field3: Math.random(),
          field4: Math.random(),
        },
      },
    };

    const setDocsHook = renderHook(() => {
      useSetContext(db, () => accessCount++);
      return useSetDocs(fql, { saveToState: false });
    });

    expect(accessCount).toBe(0);
    setDocsHook.result.current[0](); // setFn()
    await setDocsHook.waitForNextUpdate();
    expect(accessCount).toBe(2);

    const expectedAfterSetDocs = {
      [path1]: {
        data: fql[path1].fields,
        id: pathlib.basename(path1),
      },
      [path2]: {
        data: fql[path2].fields,
        id: pathlib.basename(path2),
      },
    };

    const checkAfterSetDocsHook = renderHook(() => {
      useSetContext(db, () => accessCount++);
      return useQuery({
        saveToState: false,
        queries: {
          [path1]: { location: path1 },
          [path2]: { location: path2 },
        },
      });
    });

    await checkAfterSetDocsHook.waitForNextUpdate();
    expect(checkAfterSetDocsHook.result.current[0]).toEqual(expectedAfterSetDocs);
    expect(accessCount).toBe(4);

    const deleteDocsHook = renderHook(() => {
      useSetContext(db, () => accessCount++);
      return useDeleteDocs([path1, path2], { saveToState: false });
    });

    expect(deleteDocsHook.result.current[1]).toBeFalsy(); // deleting
    expect(deleteDocsHook.result.current[2]).toBeFalsy(); // called
    expect(deleteDocsHook.result.current[3]).toBeNull(); // error
    deleteDocsHook.result.current[0](); // deleteDoc()
    await deleteDocsHook.waitForNextUpdate();
    expect(deleteDocsHook.result.current[1]).toBeTruthy(); // deleting
    expect(deleteDocsHook.result.current[2]).toBeTruthy(); // called
    expect(deleteDocsHook.result.current[3]).toBeNull(); // error
    await deleteDocsHook.waitForNextUpdate();
    expect(deleteDocsHook.result.current[1]).toBeFalsy(); // deleting
    expect(deleteDocsHook.result.current[2]).toBeTruthy(); // called
    expect(deleteDocsHook.result.current[3]).toBeNull(); // error
    expect(accessCount).toBe(6);

    const expectedAfterDeleteDocs = {
      [path1]: {
        data: null,
        id: pathlib.basename(path1),
      },
      [path2]: {
        data: null,
        id: pathlib.basename(path2),
      },
    };

    const checkAfterDeleteDocsHook = renderHook(() => {
      useSetContext(db, () => accessCount++);
      return useQuery({
        saveToState: false,
        queries: {
          [path1]: { location: path1 },
          [path2]: { location: path2 },
        },
      });
    });

    await checkAfterDeleteDocsHook.waitForNextUpdate();
    expect(checkAfterDeleteDocsHook.result.current[0]).toEqual(expectedAfterDeleteDocs);
    expect(accessCount).toBe(8);
  });
});
