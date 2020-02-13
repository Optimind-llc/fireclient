import { renderHook } from "@testing-library/react-hooks";
import { List } from "immutable";
import { useSubscribeCollection } from "../../../dist";
import { useSetContext } from "../../../dist/provider";
import backup from "../backup1.json";
import { app, db } from "../firestore";

const expected = [
  {
    data: backup.cities.MexicoCity,
    id: "MexicoCity",
  },
  {
    data: backup.cities.Mumbai,
    id: "Mumbai",
  },
  {
    data: backup.cities.NewYork,
    id: "NewYork",
  },
  {
    data: backup.cities.SaoPaulo,
    id: "SaoPaulo",
  },
  {
    data: backup.cities.Tokyo,
    id: "Tokyo",
  },
];

describe("useSubscribeCollection", () => {
  afterAll(async () => await app.delete());
  it("should handle a simple query", async () => {
    let accessCount = 0;
    const { result, waitForNextUpdate } = renderHook(() => {
      useSetContext(db, () => accessCount++);
      const options = {
        order: {
          by: "name",
        },
        saveToState: false,
      };
      return useSubscribeCollection("/cities", options);
    });

    expect(result.current[0].length).toBe(0);
    expect(result.current[1]).toBeTruthy(); // loading
    expect(result.current[2]).toBeNull(); // error

    await waitForNextUpdate();
    expect(result.current[0]).toEqual(
      List(expected)
        .sortBy(e => e.data.name)
        .toJS(),
    );
    expect(result.current[1]).toBeFalsy(); // loading
    expect(result.current[2]).toBeNull(); // error
    expect(accessCount).toBe(1);
  });
});
