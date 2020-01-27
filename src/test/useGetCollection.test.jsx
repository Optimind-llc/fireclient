import React from "react";
import { Seq } from "immutable";
import { shallow, mount } from "./enzyme";
import { act } from "react-dom/test-utils";
import { Provider, useGetCollection, getHashCode } from "../../dist";
import db from "./firestore";

const cities = {
  MexicoCity: {
    population: 19028000,
    area: 1485,
    foo: 2,
    name: "Mexico City",
    country: "Mexico",
  },
  Mumbai: {
    name: "Mumbai",
    country: "India",
    foo: 1,
    area: 603,
    population: 18978000,
  },
  NewYork: {
    population: 19354922,
    name: "New York",
    country: "United States",
    foo: 1,
    area: 783,
    users: ["Baker", "Davis"],
  },
  SaoPaulo: {
    population: 18845000,
    foo: 2,
    area: 1521,
    name: "São Paulo",
    country: "Brazil",
  },
  Tokyo: {
    name: "Tokyo",
    country: "Japan",
    foo: 2,
    area: 622,
    population: 35676000,
  },
};

const Wrapper = ({ option }) => {
  const [collection, loading, error, reloadFn] = useGetCollection("/cities", option);
  return (
    <>
      <span className="obj">
        {JSON.stringify({
          collection,
          loading,
          error,
        })}
      </span>
      <button onClick={reloadFn}></button>
    </>
  );
};

describe("getHashCode", () => {
  it("different key, different value", () => {
    expect(getHashCode({ foo: 123, bar: 456 })).toBe(getHashCode({ bar: 456, foo: 123 }));
  });
  it("different key, same value", () => {
    expect(getHashCode({ foo: 123, bar: 123 })).toBe(getHashCode({ bar: 123, foo: 123 }));
  });
  it("nested", () => {
    expect(getHashCode({ foo: 123, bar: { foo: 123, bar: 456 } })).toBe(
      getHashCode({ bar: { bar: 456, foo: 123 }, foo: 123 }),
    );
  });
});

describe("useGetCollection", () => {
  it("Before fetching collection", () => {
    const app = mount(
      <Provider firestoreDB={db}>
        <Wrapper />
      </Provider>,
    );

    const obj = JSON.parse(app.find(".obj").text());
    const { collection, loading, error, accessCount } = obj;
    expect(collection.length).toBe(0);
    expect(loading).toBe(true);
    expect(error).toBeNull();
  });
  it("After fetching collection", done => {
    let app;
    const callback = () => {
      const obj = JSON.parse(app.find(".obj").text());
      const { collection, loading, error } = obj;
      expect(collection.length).toBe(Object.keys(cities).length);
      collection.forEach(coll => {
        const docIds = Object.keys(cities);
        const includes = docIds.includes(coll.id);
        expect(includes).toBe(true);
        if (includes) {
          expect(coll.data).toEqual(cities[coll.id]);
        }
      });
      expect(loading).toBe(false);
      expect(error).toBeNull();
      done();
    };
    app = mount(
      <Provider firestoreDB={db}>
        <Wrapper option={{ callback }} />
      </Provider>,
    );
  });
  it("Condition1", done => {
    const callback = collection => {
      collection.forEach(coll => {
        console.log(coll.data.population);
        expect(coll.data.population).toBeGreaterThanOrEqual(19354922);
      });
      done();
    };
    const app = mount(
      <Provider firestoreDB={db}>
        <Wrapper
          option={{
            callback,
            where: {
              field: "population",
              operator: ">=",
              value: 19354922,
            },
          }}
        />
      </Provider>,
    );
  });
  it("Condition2", done => {
    const callback = collection => {
      collection.forEach(coll => {
        expect(coll.data.population).toBeGreaterThanOrEqual(19354922);
        expect(coll.data.population).toBeLessThan(20000000);
      });
      done();
    };
    const app = mount(
      <Provider firestoreDB={db}>
        <Wrapper
          option={{
            callback,
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
          }}
        />
      </Provider>,
    );
  });
  it("Limit", done => {
    const callback = collection => {
      expect(collection.length).toBe(3);
      done();
    };
    const app = mount(
      <Provider firestoreDB={db}>
        <Wrapper
          option={{
            callback,
            limit: 3,
          }}
        />
      </Provider>,
    );
  });
  it("Order asc", done => {
    const callback = collection => {
      let p = null;
      collection.forEach(coll => {
        if (p != null) {
          expect(coll.data.population).toBeGreaterThanOrEqual(p);
        }
        p = coll.data.population;
      });
      done();
    };
    const app = mount(
      <Provider firestoreDB={db}>
        <Wrapper
          option={{
            callback,
            order: {
              by: "population",
            },
          }}
        />
      </Provider>,
    );
  });
  it("Order desc", done => {
    const callback = collection => {
      let p = null;
      collection.forEach(coll => {
        if (p != null) {
          expect(coll.data.population).toBeLessThanOrEqual(p);
        }
        p = coll.data.population;
      });
      done();
    };
    const app = mount(
      <Provider firestoreDB={db}>
        <Wrapper
          option={{
            callback,
            order: {
              by: "population",
              direction: "desc",
            },
          }}
        />
      </Provider>,
    );
  });
  // This test will fail if composite indexes is not registered.
  it("Order multi", done => {
    const callback = collection => {
      let p = null;
      let f = null;
      collection.forEach(coll => {
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
    const app = mount(
      <Provider firestoreDB={db}>
        <Wrapper
          option={{
            callback,
            order: [
              {
                by: "population",
              },
              {
                by: "foo",
              },
            ],
          }}
        />
      </Provider>,
    );
  });
  it("Cursor startAt", done => {
    const callback = collection => {
      console.log(collection);
      expect(collection.length).toBe(2);
      collection.forEach(coll => {
        expect(coll.data.population).toBeGreaterThanOrEqual(19028000);
      });
      done();
    };
    const app = mount(
      <Provider firestoreDB={db}>
        <Wrapper
          option={{
            callback,
            order: {
              by: "population",
            },
            limit: 2,
            cursor: {
              origin: 19028000,
              direction: "startAt",
            },
          }}
        />
      </Provider>,
    );
  });
  it("Cursor startAfter", done => {
    const callback = collection => {
      expect(collection.length).toBe(2);
      collection.forEach(coll => {
        expect(coll.data.population).toBeGreaterThan(19028000);
      });
      done();
    };
    const app = mount(
      <Provider firestoreDB={db}>
        <Wrapper
          option={{
            callback,
            order: {
              by: "population",
            },
            limit: 2,
            cursor: {
              origin: 19028000,
              direction: "startAfter",
            },
          }}
        />
      </Provider>,
    );
  });
  // This test will fail if composite indexes is not registered.
  it("Cursor multiple fields", done => {
    const callback = collection => {
      expect(collection.length).toBe(2);
      let p = null;
      let f = null;
      collection.forEach(coll => {
        if (p != null) {
          expect(coll.data.foo).toBeGreaterThanOrEqual(f);
          if (coll.data.foo === f) {
            expect(coll.data.population).toBeGreaterThanOrEqual(p);
          }
        }
        p = coll.data.population;
        f = coll.data.foo;
      });
      done();
    };
    const app = mount(
      <Provider firestoreDB={db}>
        <Wrapper
          option={{
            callback,
            order: [
              {
                by: "foo",
              },
              {
                by: "population",
              },
            ],
            limit: 2,
            cursor: {
              multipleFields: true,
              origin: [2, 18845000],
              direction: "startAfter",
            },
          }}
        />
      </Provider>,
    );
  });
});
