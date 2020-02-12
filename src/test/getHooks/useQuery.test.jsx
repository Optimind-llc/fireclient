import { renderHook } from "@testing-library/react-hooks";
import { List } from "immutable";
import { useQuery } from "../../../dist";
import { useSetContext } from "../../../dist/provider";
import backup from "../backup1.json";
import db from "../firestore";

describe("useQuery", () => {
  const fql = {
    saveToState: false,
    queries: {
      number: {
        location: "/test/number",
      },
      string: {
        location: "/test/string",
      },
      cities: {
        location: "/cities",
        order: {
          by: "name",
        },
      },
    },
  };
  it(`should handle a simple query`, async () => {
    let accessCount = 0;
    const expected = {
      number: {
        data: backup.test.number,
        id: "number",
      },
      string: {
        data: backup.test.string,
        id: "string",
      },
      cities: List(Object.entries(backup.cities))
        .sortBy(([key, city]) => city.name)
        .map(([key, city]) => ({ data: city, id: key }))
        .toJS(),
    };
    const { result, waitForNextUpdate } = renderHook(() => {
      useSetContext(db, () => accessCount++);
      // @ts-ignore
      return useQuery(fql);
    });
    expect(result.current[0]).toEqual({
      number: {
        data: null,
        id: null,
      },
      string: {
        data: null,
        id: null,
      },
      cities: [],
    });
    expect(result.current[1]).toBeTruthy();
    expect(result.current[2]).toBeNull();
    await waitForNextUpdate();
    await waitForNextUpdate();
    expect(result.current[0]).toEqual(expected);
    expect(result.current[1]).toBeFalsy();
    expect(result.current[2]).toBeNull();
    expect(accessCount).toBe(Object.keys(expected).length);
  });
});
