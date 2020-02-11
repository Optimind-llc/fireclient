import { renderHook } from "@testing-library/react-hooks";
import { fromJS } from "immutable";
import { useGetCollection, useSetCollection } from "../../../dist";
import { useSetContext } from "../../../dist/provider";
import db from "../firestore";

describe("useSetCollection", () => {
  const path = "/useSetCollectionTest";
  it("should handle a simple query", async () => {
    let accessCount = 0;
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
    const expected = fromJS(fql)
      .map(f => ({
        data: f.get("fields"),
        id: f.get("id"),
      }))
      .sortBy(f => f.data.get("field1"))
      .toJS();

    const hooks1 = renderHook(() => {
      useSetContext(db, () => accessCount++);
      return useSetCollection(path, fql, { saveToState: false });
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
    expect(accessCount).toBe(3);

    const hooks2 = renderHook(() => {
      useSetContext(db, () => accessCount++);
      return useGetCollection(path, { order: { by: "field1" }, saveToState: false });
    });
    const result2 = hooks2.result;
    const waitForNextUpdate2 = hooks2.waitForNextUpdate;

    await waitForNextUpdate2();
    expect(result2.current[0]).toEqual(expected);
    expect(accessCount).toBe(4);
  });
});
