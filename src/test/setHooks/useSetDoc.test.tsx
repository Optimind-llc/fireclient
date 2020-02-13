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

    const hooks1 = renderHook(() => {
      useSetContext(db, () => accessCount++);
      return useSetDoc(path, fql, { saveToState: false });
    });
    const result1 = hooks1.result;
    const waitForNextUpdate1 = hooks1.waitForNextUpdate;

    expect(result1.current[1]).toBeFalsy(); // writing
    expect(result1.current[2]).toBeFalsy(); // called
    expect(result1.current[3]).toBeNull(); // error
    expect(accessCount).toBe(0);
    result1.current[0](); // setFn()
    await waitForNextUpdate1();
    expect(result1.current[1]).toBeFalsy(); // writing
    expect(result1.current[2]).toBeTruthy(); // called
    expect(result1.current[3]).toBeNull(); // error
    expect(accessCount).toBe(1);

    const hooks2 = renderHook(() => {
      useSetContext(db, () => accessCount++);
      return useGetDoc(path, { saveToState: false });
    });
    const result2 = hooks2.result;
    const waitForNextUpdate2 = hooks2.waitForNextUpdate;

    await waitForNextUpdate2();
    expect(result2.current[0]).toEqual(expected);
    expect(accessCount).toBe(2);
  });
});
