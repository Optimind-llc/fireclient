import { renderHook } from "@testing-library/react-hooks";
import { fromJS } from "immutable";
import { useGetCollection, useSetCollection } from "../../../dist";
import { useSetContext } from "../../../dist/provider";
import { app, db } from "../firestore";

describe("useSetCollection", () => {
  const path = "/useSetCollectionTest";
  afterAll(async () => await app.delete());
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

    const useSetCollectionHook = renderHook(() => {
      useSetContext(db, () => accessCount++);
      return useSetCollection(path, fql, { saveToState: false });
    });

    expect(useSetCollectionHook.result.current[1]).toBeFalsy(); // writing
    expect(useSetCollectionHook.result.current[2]).toBeFalsy(); // called
    expect(useSetCollectionHook.result.current[3]).toBeNull(); // error
    expect(accessCount).toBe(0);
    useSetCollectionHook.result.current[0](); // setFn()
    await useSetCollectionHook.waitForNextUpdate();
    expect(useSetCollectionHook.result.current[1]).toBeFalsy(); // writing
    expect(useSetCollectionHook.result.current[2]).toBeTruthy(); // called
    expect(useSetCollectionHook.result.current[3]).toBeNull(); // error
    expect(accessCount).toBe(3);

    const useGetCollectionHook = renderHook(() => {
      useSetContext(db, () => accessCount++);
      return useGetCollection(path, { order: { by: "field1" }, saveToState: false });
    });

    await useGetCollectionHook.waitForNextUpdate();
    expect(useGetCollectionHook.result.current[0]).toEqual(expected);
    expect(accessCount).toBe(4);
  });
});
