import { renderHook } from "@testing-library/react-hooks";
import * as pathlib from "path";
import { useQuery, useSetDocs } from "../../../dist";
import { useSetContext } from "../../../dist/provider";
import { app, db } from "../firestore";

describe("useSetDocs", () => {
  const path1 = "/useSetDocsTest/doc1";
  const path2 = "/useSetDocsTest/doc2";
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

    const expected = {
      [path1]: {
        data: fql[path1].fields,
        id: pathlib.basename(path1),
      },
      [path2]: {
        data: fql[path2].fields,
        id: pathlib.basename(path2),
      },
    };

    const useSetDocsHook = renderHook(() => {
      useSetContext(db, () => accessCount++);
      return useSetDocs(fql, { saveToState: false });
    });

    expect(useSetDocsHook.result.current[1]).toBeFalsy(); // writing
    expect(useSetDocsHook.result.current[2]).toBeFalsy(); // called
    expect(useSetDocsHook.result.current[3]).toBeNull(); // error
    expect(accessCount).toBe(0);
    useSetDocsHook.result.current[0](); // setFn()
    await useSetDocsHook.waitForNextUpdate();
    expect(useSetDocsHook.result.current[1]).toBeFalsy(); // writing
    expect(useSetDocsHook.result.current[2]).toBeTruthy(); // called
    expect(useSetDocsHook.result.current[3]).toBeNull(); // error
    expect(accessCount).toBe(2);

    const useQueryHook = renderHook(() => {
      useSetContext(db, () => accessCount++);
      return useQuery({
        queries: {
          [path1]: { location: path1 },
          [path2]: { location: path2 },
        },
      });
    });

    await useQueryHook.waitForNextUpdate();
    expect(useQueryHook.result.current[0]).toEqual(expected);
  });
});
