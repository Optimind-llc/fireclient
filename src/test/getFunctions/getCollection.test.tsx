import React from "react";
import { List } from "immutable";
import * as pathlib from "path";
import { mount } from "../enzyme";
import db from "../firestore";
import backup from "../backup1.json";
import { Provider } from "../../../dist";
import { getCollection } from "../../../dist/getFunctions";
import { generateHooksId } from "../../../dist/utils";

let container;

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

const GetWrapper = ({ path, options, onGet }) => {
  const onError = err => {
    throw new Error(err);
  };
  getCollection(path, onGet, onError, options, false, false);
  return <></>;
};

const mountComponent = (path, onGet, options) =>
  mount(
    <Provider firestoreDB={db}>
      <GetWrapper path={path} onGet={onGet} options={options} />
    </Provider>,
    { attachTo: container },
  );

describe("Get Collection", () => {
  it("should handle a simple query", async done => {
    const onGet = collectionData => {
      expect(collectionData).toEqual(
        List(expected)
          .sortBy(e => e.data.name)
          .toJS(),
      );
      done();
    };
    const options = {
      order: {
        by: "name",
      },
    };
    mountComponent("/cities", onGet, options);
  });
  it('should handle "where" option', async done => {
    const onGet = collectionData => {
      collectionData.forEach(coll => expect(coll.data.population).toBeGreaterThanOrEqual(19354922));
      done();
    };
    const options = {
      where: {
        field: "population",
        operator: ">=",
        value: 19354922,
      },
    };
    mountComponent("/cities", onGet, options);
  });
  it('should handle multiple "where" option', async done => {
    const onGet = collectionData => {
      collectionData.forEach(coll => {
        expect(coll.data.population).toBeGreaterThanOrEqual(19354922);
        expect(coll.data.population).toBeLessThan(20000000);
      });
      done();
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
    mountComponent("/cities", onGet, options);
  });
  it('should handle "limit" option', async done => {
    const onGet = collectionData => {
      expect(collectionData.length).toBe(3);
      done();
    };
    const options = {
      limit: 3,
    };
    mountComponent("/cities", onGet, options);
  });
  it('should handle "limit" option', async done => {
    const onGet = collectionData => {
      expect(collectionData.length).toBe(3);
      done();
    };
    const options = {
      limit: 3,
    };
    mountComponent("/cities", onGet, options);
  });
  it('should handle "order" option (no direction)', async done => {
    const onGet = collectionData => {
      let p = null;
      collectionData.forEach(coll => {
        if (p != null) {
          expect(coll.data.population).toBeGreaterThanOrEqual(p);
        }
        p = coll.data.population;
      });
      done();
    };
    const options = {
      order: {
        by: "population",
      },
    };
    mountComponent("/cities", onGet, options);
  });
  it('should handle "order" option (asc)', async done => {
    const onGet = collectionData => {
      let p = null;
      collectionData.forEach(coll => {
        if (p != null) {
          expect(coll.data.population).toBeGreaterThanOrEqual(p);
        }
        p = coll.data.population;
      });
      done();
    };
    const options = {
      order: {
        by: "population",
        direction: "asc",
      },
    };
    mountComponent("/cities", onGet, options);
  });
  it('should handle "order" option (desc)', async done => {
    const onGet = collectionData => {
      let p = null;
      collectionData.forEach(coll => {
        if (p != null) {
          expect(coll.data.population).toBeLessThanOrEqual(p);
        }
        p = coll.data.population;
      });
      done();
    };
    const options = {
      order: {
        by: "population",
        direction: "desc",
      },
    };
    mountComponent("/cities", onGet, options);
  });
  it('should handle multiple "order" option', async done => {
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
      done();
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
    mountComponent("/cities", onGet, options);
  });
  it('should handle multiple "cursor" option (startAt)', async done => {
    const onGet = collectionData => {
      expect(collectionData.length).toBe(2);
      collectionData.forEach(coll => {
        expect(coll.data.population).toBeGreaterThanOrEqual(19028000);
      });
      done();
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
    mountComponent("/cities", onGet, options);
  });
  it('should handle multiple "cursor" option (startAfter)', async done => {
    const onGet = collectionData => {
      expect(collectionData.length).toBe(2);
      collectionData.forEach(coll => {
        expect(coll.data.population).toBeGreaterThan(19028000);
      });
      done();
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
    mountComponent("/cities", onGet, options);
  });
  it('should handle multiple "cursor" option (multiple fields)', async done => {
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
      done();
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
    mountComponent("/cities", onGet, options);
  });
});
