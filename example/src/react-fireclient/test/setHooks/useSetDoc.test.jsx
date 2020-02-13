import { renderHook } from "@testing-library/react-hooks";
import * as pathlib from "path";
import { useGetDoc, useSetDoc } from "../../../dist";
import { useSetContext } from "../../../dist/provider";
import { app, db } from "../firestore";

describe("useSetDoc", () => {
  const path = "/useSetDocTest/doc1";
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
    const expected = {
      data: fql.fields,
      id: pathlib.basename(path),
    };

    const useSetDocHook = renderHook(() => {
      useSetContext(db, () => accessCount++);
      return useSetDoc(path, fql, { saveToState: false });
    });

    expect(useSetDocHook.result.current[1]).toBeFalsy(); // writing
    expect(useSetDocHook.result.current[2]).toBeFalsy(); // called
    expect(useSetDocHook.result.current[3]).toBeNull(); // error
    expect(accessCount).toBe(0);
    useSetDocHook.result.current[0](); // setFn()
    await useSetDocHook.waitForNextUpdate();
    expect(useSetDocHook.result.current[1]).toBeFalsy(); // writing
    expect(useSetDocHook.result.current[2]).toBeTruthy(); // called
    expect(useSetDocHook.result.current[3]).toBeNull(); // error
    expect(accessCount).toBe(1);

    const useGetDocHook = renderHook(() => {
      useSetContext(db, () => accessCount++);
      return useGetDoc(path, { saveToState: false });
    });

    await useGetDocHook.waitForNextUpdate();
    expect(useGetDocHook.result.current[0]).toEqual(expected);
    expect(accessCount).toBe(2);
  });
});
