import { renderHook } from "@testing-library/react-hooks";
import { List } from "immutable";
import { useState } from "react";
import { subscribeCollection } from "../../../dist/getFunctions";
import { useSetContext } from "../../../dist/provider";
import { generateHooksId } from "../../../dist/utils";
import backup from "../backup1.json";
import db from "../firestore";

const useTest = ({ path, onGet, options }) => {
  useSetContext(db);
  const [finished, setFinished] = useState(false);
  const uuid = generateHooksId();
  const onError = err => {
    throw new Error(err);
  };
  const onListen = () => {};
  subscribeCollection(
    uuid,
    path,
    doc => {
      onGet(doc);
      setFinished(true);
    },
    err => {
      onError(err);
      setFinished(true);
    },
    onListen,
    options,
    false,
  );
  return finished;
};

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

describe("Get Collection", () => {
  it("should handle a simple query", async () => {
    const onGet = collectionData => {
      expect(collectionData).toEqual(
        List(expected)
          .sortBy(e => e.data.name)
          .toJS(),
      );
    };
    const options = {
      order: {
        by: "name",
      },
    };
    const { waitForNextUpdate } = renderHook(() => useTest({ path: "/cities", onGet, options }));
    await waitForNextUpdate();
  });

  it('should handle "where" option', async () => {
    const onGet = collectionData => {
      collectionData.forEach(coll => expect(coll.data.population).toBeGreaterThanOrEqual(19354922));
    };
    const options = {
      where: {
        field: "population",
        operator: ">=",
        value: 19354922,
      },
    };
    const { waitForNextUpdate } = renderHook(() => useTest({ path: "/cities", onGet, options }));
    await waitForNextUpdate();
  });

  it('should handle multiple "where" option', async () => {
    const onGet = collectionData => {
      collectionData.forEach(coll => {
        expect(coll.data.population).toBeGreaterThanOrEqual(19354922);
        expect(coll.data.population).toBeLessThan(20000000);
      });
    };
    const options = {
      where: [
        {
          field: "population",
          operator: "<",
          value: 20000000,
        },
        {
          field: "population",
          operator: ">=",
          value: 19354922,
        },
      ],
    };
    const { waitForNextUpdate } = renderHook(() => useTest({ path: "/cities", onGet, options }));
    await waitForNextUpdate();
  });

  it('should handle "limit" option', async () => {
    const onGet = collectionData => {
      expect(collectionData.length).toBe(3);
    };
    const options = {
      limit: 3,
    };
    const { waitForNextUpdate } = renderHook(() => useTest({ path: "/cities", onGet, options }));
    await waitForNextUpdate();
  });

  it('should handle "limit" option', async () => {
    const onGet = collectionData => {
      expect(collectionData.length).toBe(3);
    };
    const options = {
      limit: 3,
    };
    const { waitForNextUpdate } = renderHook(() => useTest({ path: "/cities", onGet, options }));
    await waitForNextUpdate();
  });

  it('should handle "order" option (no direction)', async () => {
    const onGet = collectionData => {
      let p = null;
      collectionData.forEach(coll => {
        if (p != null) {
          expect(coll.data.population).toBeGreaterThanOrEqual(p);
        }
        p = coll.data.population;
      });
    };
    const options = {
      order: {
        by: "population",
      },
    };
    const { waitForNextUpdate } = renderHook(() => useTest({ path: "/cities", onGet, options }));
    await waitForNextUpdate();
  });

  it('should handle "order" option (asc)', async () => {
    const onGet = collectionData => {
      let p = null;
      collectionData.forEach(coll => {
        if (p != null) {
          expect(coll.data.population).toBeGreaterThanOrEqual(p);
        }
        p = coll.data.population;
      });
    };
    const options = {
      order: {
        by: "population",
        direction: "asc",
      },
    };
    const { waitForNextUpdate } = renderHook(() => useTest({ path: "/cities", onGet, options }));
    await waitForNextUpdate();
  });

  it('should handle "order" option (desc)', async () => {
    const onGet = collectionData => {
      let p = null;
      collectionData.forEach(coll => {
        if (p != null) {
          expect(coll.data.population).toBeLessThanOrEqual(p);
        }
        p = coll.data.population;
      });
    };
    const options = {
      order: {
        by: "population",
        direction: "desc",
      },
    };
    const { waitForNextUpdate } = renderHook(() => useTest({ path: "/cities", onGet, options }));
    await waitForNextUpdate();
  });

  it('should handle multiple "order" option', async () => {
    const onGet = collectionData => {
      let p = null;
      let f = null;
      collectionData.forEach(coll => {
        if (p != null) {
          expect(coll.data.population).toBeGreaterThanOrEqual(p);
          if (coll.data.population === p) {
            expect(coll.data.foo).toBeGreaterThanOrEqual(f);
          }
        }
        p = coll.data.population;
        f = coll.data.foo;
      });
    };
    const options = {
      order: [
        {
          by: "population",
        },
        {
          by: "foo",
        },
      ],
    };
    const { waitForNextUpdate } = renderHook(() => useTest({ path: "/cities", onGet, options }));
    await waitForNextUpdate();
  });

  it('should handle multiple "cursor" option (startAt)', async () => {
    const onGet = collectionData => {
      expect(collectionData.length).toBe(2);
      collectionData.forEach(coll => {
        expect(coll.data.population).toBeGreaterThanOrEqual(19028000);
      });
    };
    const options = {
      order: {
        by: "population",
      },
      limit: 2,
      cursor: {
        origin: 19028000,
        direction: "startAt",
      },
    };
    const { waitForNextUpdate } = renderHook(() => useTest({ path: "/cities", onGet, options }));
    await waitForNextUpdate();
  });

  it('should handle multiple "cursor" option (startAfter)', async () => {
    const onGet = collectionData => {
      expect(collectionData.length).toBe(2);
      collectionData.forEach(coll => {
        expect(coll.data.population).toBeGreaterThan(19028000);
      });
    };
    const options = {
      order: {
        by: "population",
      },
      limit: 2,
      cursor: {
        origin: 19028000,
        direction: "startAfter",
      },
    };
    const { waitForNextUpdate } = renderHook(() => useTest({ path: "/cities", onGet, options }));
    await waitForNextUpdate();
  });

  it('should handle multiple "cursor" option (multiple fields)', async () => {
    const onGet = collectionData => {
      expect(collectionData.length).toBe(2);
      let p = null;
      let f = null;
      collectionData.forEach(coll => {
        if (p != null) {
          expect(coll.data.population).toBeGreaterThanOrEqual(p);
          if (coll.data.population === p) {
            expect(coll.data.foo).toBeGreaterThanOrEqual(f);
          }
        }
        p = coll.data.population;
        f = coll.data.foo;
      });
    };
    const options = {
      order: [
        {
          by: "population",
        },
        {
          by: "foo",
        },
      ],
      limit: 2,
      cursor: {
        multipleFields: true,
        origin: [2, 18845000],
        direction: "startAfter",
      },
    };
    const { waitForNextUpdate } = renderHook(() => useTest({ path: "/cities", onGet, options }));
    await waitForNextUpdate();
  });
});
