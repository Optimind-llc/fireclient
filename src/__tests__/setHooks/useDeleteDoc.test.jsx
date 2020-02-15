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

describe("useDeleteDoc", () => {
  const path1 = "/useDeleteDoc/doc1";
  afterAll(async () => await app.delete());
  it("should handle a simple query", async () => {
    let accessCount = 0;
    const fql = {
      fields: {
        field1: Math.random(),
        field2: Math.random(),
        field3: Math.random(),
        field4: Math.random(),
      },
    };

    const setDocHook = renderHook(() => {
      useSetContext(db, () => accessCount++);
      return useSetDoc(path1, fql, { saveToState: false });
    });

    expect(accessCount).toBe(0);
    setDocHook.result.current[0](); // setFn()
    await setDocHook.waitForNextUpdate();
    expect(accessCount).toBe(1);

    const expectedAfterSetDoc = {
      data: fql.fields,
      id: pathlib.basename(path1),
    };

    const checkAfterSetDocHook = renderHook(() => {
      useSetContext(db, () => accessCount++);
      return useGetDoc(path1, { saveToState: false });
    });

    await checkAfterSetDocHook.waitForNextUpdate();
    expect(checkAfterSetDocHook.result.current[0]).toEqual(expectedAfterSetDoc);
    expect(accessCount).toBe(2);

    const deleteDocHook = renderHook(() => {
      useSetContext(db, () => accessCount++);
      return useDeleteDoc(path1, { saveToState: false });
    });

    expect(deleteDocHook.result.current[1]).toBeFalsy(); // deleting
    expect(deleteDocHook.result.current[2]).toBeFalsy(); // called
    expect(deleteDocHook.result.current[3]).toBeNull(); // error
    deleteDocHook.result.current[0](); // deleteDoc()
    await deleteDocHook.waitForNextUpdate();
    expect(deleteDocHook.result.current[1]).toBeFalsy(); // deleting
    expect(deleteDocHook.result.current[2]).toBeTruthy(); // called
    expect(deleteDocHook.result.current[3]).toBeNull(); // error
    expect(accessCount).toBe(3);

    const expectedAfterSetDocAfterDeleteDoc = {
      data: null,
      id: pathlib.basename(path1),
    };

    const checkAfterDeleteDocHook = renderHook(() => {
      useSetContext(db, () => accessCount++);
      return useGetDoc(path1, { saveToState: false });
    });

    await checkAfterDeleteDocHook.waitForNextUpdate();
    expect(checkAfterDeleteDocHook.result.current[0]).toEqual(expectedAfterSetDocAfterDeleteDoc);
    expect(accessCount).toBe(4);
  });
});
