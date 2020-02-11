import * as typeCheck from "../../dist/typeCheck";

const exampleVals = {
  null: null,
  undefined: undefined,
  number: 123,
  string: "hello world",
  boolean: true,
  function: () => console.log("foo"),
  object: {
    foo: "bar",
  },
  array: [1, 2, 3],
};

describe("typeCheck basic function", () => {
  it("isObject", () => {
    expect(typeCheck.isObject(exampleVals.null, "obj").valid).toBe(false);
    expect(typeCheck.isObject(exampleVals.undefined, "obj").valid).toBe(false);
    expect(typeCheck.isObject(exampleVals.number, "obj").valid).toBe(false);
    expect(typeCheck.isObject(exampleVals.string, "obj").valid).toBe(false);
    expect(typeCheck.isObject(exampleVals.boolean, "obj").valid).toBe(false);
    expect(typeCheck.isObject(exampleVals.function, "obj").valid).toBe(false);
    expect(typeCheck.isObject(exampleVals.object, "obj").valid).toBe(true);
    expect(typeCheck.isObject(exampleVals.array, "obj").valid).toBe(false);
  });
  it("isAnyOf", () => {
    expect(typeCheck.isAnyOf([exampleVals.null])(exampleVals.null, "obj").valid).toBe(true);
    expect(typeCheck.isAnyOf([exampleVals.undefined])(exampleVals.undefined, "obj").valid).toBe(
      true,
    );
    expect(typeCheck.isAnyOf([exampleVals.number])(exampleVals.number, "obj").valid).toBe(true);
    expect(
      typeCheck.isAnyOf([exampleVals.number, exampleVals.string])(exampleVals.number, "obj").valid,
    ).toBe(true);
  });
  it("isArrayOf", () => {
    expect(typeCheck.isArrayOf(typeCheck.isString)(exampleVals.null, "obj").valid).toBe(false);
    expect(typeCheck.isArrayOf(typeCheck.isString)([exampleVals.null], "obj").valid).toBe(false);
    expect(typeCheck.isArrayOf(typeCheck.isString)([exampleVals.string], "obj").valid).toBe(true);
    expect(
      typeCheck.isArrayOf(typeCheck.isString)([exampleVals.null, exampleVals.string], "obj").valid,
    ).toBe(false);
  });
  it("isString", () => {
    expect(typeCheck.isString(exampleVals.null, "obj").valid).toBe(false);
    expect(typeCheck.isString(exampleVals.undefined, "obj").valid).toBe(false);
    expect(typeCheck.isString(exampleVals.number, "obj").valid).toBe(false);
    expect(typeCheck.isString(exampleVals.string, "obj").valid).toBe(true);
    expect(typeCheck.isString(exampleVals.boolean, "obj").valid).toBe(false);
    expect(typeCheck.isString(exampleVals.function, "obj").valid).toBe(false);
    expect(typeCheck.isString(exampleVals.object, "obj").valid).toBe(false);
    expect(typeCheck.isString(exampleVals.array, "obj").valid).toBe(false);
  });
  it("isNumber", () => {
    expect(typeCheck.isNumber(exampleVals.null, "obj").valid).toBe(false);
    expect(typeCheck.isNumber(exampleVals.undefined, "obj").valid).toBe(false);
    expect(typeCheck.isNumber(exampleVals.number, "obj").valid).toBe(true);
    expect(typeCheck.isNumber(exampleVals.string, "obj").valid).toBe(false);
    expect(typeCheck.isNumber(exampleVals.boolean, "obj").valid).toBe(false);
    expect(typeCheck.isNumber(exampleVals.function, "obj").valid).toBe(false);
    expect(typeCheck.isNumber(exampleVals.object, "obj").valid).toBe(false);
    expect(typeCheck.isNumber(exampleVals.array, "obj").valid).toBe(false);
  });
  it("isBoolean", () => {
    expect(typeCheck.isBoolean(exampleVals.null, "obj").valid).toBe(false);
    expect(typeCheck.isBoolean(exampleVals.undefined, "obj").valid).toBe(false);
    expect(typeCheck.isBoolean(exampleVals.number, "obj").valid).toBe(false);
    expect(typeCheck.isBoolean(exampleVals.string, "obj").valid).toBe(false);
    expect(typeCheck.isBoolean(exampleVals.boolean, "obj").valid).toBe(true);
    expect(typeCheck.isBoolean(exampleVals.function, "obj").valid).toBe(false);
    expect(typeCheck.isBoolean(exampleVals.object, "obj").valid).toBe(false);
    expect(typeCheck.isBoolean(exampleVals.array, "obj").valid).toBe(false);
  });
  it("isNotNull", () => {
    expect(typeCheck.isNotNull(exampleVals.null, "obj").valid).toBe(false);
    expect(typeCheck.isNotNull(exampleVals.undefined, "obj").valid).toBe(false);
    expect(typeCheck.isNotNull(exampleVals.number, "obj").valid).toBe(true);
    expect(typeCheck.isNotNull(exampleVals.string, "obj").valid).toBe(true);
    expect(typeCheck.isNotNull(exampleVals.boolean, "obj").valid).toBe(true);
    expect(typeCheck.isNotNull(exampleVals.function, "obj").valid).toBe(true);
    expect(typeCheck.isNotNull(exampleVals.object, "obj").valid).toBe(true);
    expect(typeCheck.isNotNull(exampleVals.array, "obj").valid).toBe(true);
  });
  it("isFunction", () => {
    expect(typeCheck.isFunction(exampleVals.null, "obj").valid).toBe(false);
    expect(typeCheck.isFunction(exampleVals.undefined, "obj").valid).toBe(false);
    expect(typeCheck.isFunction(exampleVals.number, "obj").valid).toBe(false);
    expect(typeCheck.isFunction(exampleVals.string, "obj").valid).toBe(false);
    expect(typeCheck.isFunction(exampleVals.boolean, "obj").valid).toBe(false);
    expect(typeCheck.isFunction(exampleVals.function, "obj").valid).toBe(true);
    expect(typeCheck.isFunction(exampleVals.object, "obj").valid).toBe(false);
    expect(typeCheck.isFunction(exampleVals.array, "obj").valid).toBe(false);
  });
  it("concatRule", () => {
    const rule1 = [
      {
        key: "key1",
        fn: typeCheck.isString,
      },
    ];
    const rule2 = [
      {
        key: "key2",
        fn: typeCheck.isNumber,
        optional: false,
      },
    ];
    expect(typeCheck.concatRule(rule1, rule2)).toEqual([
      {
        key: "key1",
        fn: typeCheck.isString,
      },
      {
        key: "key2",
        fn: typeCheck.isNumber,
        optional: false,
      },
    ]);
  });
  it("matches", () => {
    const rule1 = [
      {
        key: "key1",
        fn: typeCheck.isString,
      },
    ];
    const rule2 = [
      {
        key: "key1",
        fn: typeCheck.isString,
        optional: false,
      },
    ];
    const rule3 = [
      {
        key: "key1",
        fn: typeCheck.isString,
        optional: true,
      },
    ];
    const obj1 = {
      key1: exampleVals.string,
    };
    expect(typeCheck.matches(rule1)(obj1, "obj").valid).toBe(true);
    expect(typeCheck.matches(rule1)([obj1], "obj").valid).toBe(false);
    expect(typeCheck.matches(rule1)([], "obj").valid).toBe(false);
    expect(typeCheck.matches(rule1)({}, "obj").valid).toBe(false);
    expect(typeCheck.matches(rule2)({}, "obj").valid).toBe(false);
    expect(typeCheck.matches(rule3)({}, "obj").valid).toBe(true);
  });
  it("matchesArrayOf", () => {
    const rule = [
      {
        key: "key1",
        fn: typeCheck.isString,
      },
    ];
    const obj = {
      key1: exampleVals.string,
    };
    expect(typeCheck.matchesArrayOf(rule)([obj], "obj").valid).toBe(true);
    expect(typeCheck.matchesArrayOf(rule)(obj, "obj").valid).toBe(false);
    expect(typeCheck.matchesArrayOf(rule)({ foo: obj }, "obj").valid).toBe(false);
  });
  it("matchesObjectOf", () => {
    const rule = [
      {
        key: "key1",
        fn: typeCheck.isString,
      },
    ];
    const obj = {
      key1: exampleVals.string,
    };
    expect(typeCheck.matchesObjectOf(rule)([obj], "obj").valid).toBe(false);
    expect(typeCheck.matchesObjectOf(rule)(obj, "obj").valid).toBe(false);
    expect(typeCheck.matchesObjectOf(rule)({ foo: obj }, "obj").valid).toBe(true);
  });
});

const checkRule = (rule, obj) => () => typeCheck.assertRule(rule)(obj, "test");
const checkAssert = (assertFn, obj) => () => assertFn(obj, "test");

describe("acceptOutdated rule", () => {
  it("expected usage", () => {
    expect(
      checkRule(typeCheck.acceptOutdatedRule, {
        acceptOutdated: exampleVals.boolean,
      }),
    ).not.toThrow();
    expect(checkRule(typeCheck.acceptOutdatedRule, {})).not.toThrow();
  });
  it("wrong value", () => {
    expect(
      checkRule(typeCheck.acceptOutdatedRule, {
        acceptOutdated: exampleVals.string,
      }),
    ).toThrow();
  });
});
describe("callback rule", () => {
  it("expected usage", () => {
    expect(
      checkRule(typeCheck.callbackRule, {
        callback: exampleVals.function,
      }),
    ).not.toThrow();
    expect(checkRule(typeCheck.callbackRule, {})).not.toThrow();
  });
  it("wrong value", () => {
    expect(
      checkRule(typeCheck.callbackRule, {
        callback: exampleVals.number,
      }),
    ).toThrow();
  });
});
describe("merge rule", () => {
  it("expected usage", () => {
    expect(
      checkRule(typeCheck.mergeRule, {
        merge: exampleVals.boolean,
        mergeFields: [exampleVals.string],
      }),
    ).not.toThrow();
    expect(checkRule(typeCheck.mergeRule, {})).not.toThrow();
  });
  it("wrong merge", () => {
    expect(
      checkRule(typeCheck.mergeRule, {
        merge: exampleVals.string,
      }),
    ).toThrow();
  });
  it("wrong mergeFields", () => {
    expect(
      checkRule(typeCheck.mergeRule, {
        merge: [exampleVals.number],
      }),
    ).toThrow();
  });
});

describe("where rule", () => {
  it("expected usage", () => {
    expect(
      checkRule(typeCheck.whereRule, {
        field: exampleVals.string,
        operator: "<",
        value: exampleVals.number,
      }),
    ).not.toThrow();
  });
  it("wrong operator", () => {
    expect(
      checkRule(typeCheck.whereRule, {
        field: exampleVals.string,
        operator: "biggerThan",
        value: exampleVals.number,
      }),
    ).toThrow();
  });
  it("without field", () => {
    expect(
      checkRule(typeCheck.whereRule, {
        operator: "biggerThan",
        value: exampleVals.number,
      }),
    ).toThrow();
  });
  it("without operator", () => {
    expect(
      checkRule(typeCheck.whereRule, {
        field: exampleVals.string,
        value: exampleVals.number,
      }),
    ).toThrow();
  });
  it("without value", () => {
    expect(
      checkRule(typeCheck.whereRule, {
        field: exampleVals.string,
        operator: "biggerThan",
      }),
    ).toThrow();
  });
});

describe("order rule", () => {
  it("expected usage", () => {
    expect(
      checkRule(typeCheck.orderRule, {
        by: exampleVals.string,
        direction: "desc",
      }),
    ).not.toThrow();
    expect(
      checkRule(typeCheck.orderRule, {
        by: exampleVals.string,
        direction: "asc",
      }),
    ).not.toThrow();
    expect(
      checkRule(typeCheck.orderRule, {
        by: exampleVals.string,
      }),
    ).not.toThrow();
  });
  it("wrong direction", () => {
    expect(
      checkRule(typeCheck.orderRule, {
        by: exampleVals.string,
        direction: "foo",
      }),
    ).toThrow();
  });
  it("without by", () => {
    expect(
      checkRule(typeCheck.orderRule, {
        direction: exampleVals.boolean,
      }),
    ).toThrow();
  });
});

describe("cursor rule", () => {
  it("expected usage", () => {
    expect(
      checkRule(typeCheck.cursorRule, {
        origin: exampleVals.number,
        direction: "startAt",
        multipleFields: exampleVals.boolean,
      }),
    ).not.toThrow();
    expect(
      checkRule(typeCheck.cursorRule, {
        origin: exampleVals.number,
        direction: "startAt",
      }),
    ).not.toThrow();
    expect(
      checkRule(typeCheck.cursorRule, {
        origin: exampleVals.number,
        direction: "startAfter",
      }),
    ).not.toThrow();
    expect(
      checkRule(typeCheck.cursorRule, {
        origin: exampleVals.number,
        direction: "endAt",
      }),
    ).not.toThrow();
    expect(
      checkRule(typeCheck.cursorRule, {
        origin: exampleVals.number,
        direction: "endBefore",
      }),
    ).not.toThrow();
  });
  it("without origin", () => {
    expect(
      checkRule(typeCheck.cursorRule, {
        direction: "startAt",
      }),
    ).toThrow();
  });
  it("without direction", () => {
    expect(
      checkRule(typeCheck.cursorRule, {
        origin: exampleVals.number,
      }),
    ).toThrow();
  });
});

describe("queryOption rule", () => {
  it("expected usage", () => {
    expect(
      checkRule(typeCheck.queryOptionRule, {
        where: { field: exampleVals.string, operator: ">", value: exampleVals.number },
        limit: exampleVals.number,
        order: {
          by: exampleVals.string,
          direction: "desc",
        },
        cursor: {
          origin: exampleVals.number,
          direction: "startAt",
        },
      }),
    ).not.toThrow();
    expect(
      checkRule(typeCheck.queryOptionRule, {
        where: [{ field: exampleVals.string, operator: ">", value: exampleVals.number }],
        limit: exampleVals.number,
        order: [
          {
            by: exampleVals.string,
            direction: "desc",
          },
        ],
        cursor: {
          origin: exampleVals.number,
          direction: "startAt",
        },
      }),
    ).not.toThrow();
  });
  it("expected usage (individual)", () => {
    expect(
      checkRule(typeCheck.queryOptionRule, {
        where: { field: exampleVals.string, operator: ">", value: exampleVals.number },
      }),
    ).not.toThrow();
    expect(
      checkRule(typeCheck.queryOptionRule, {
        where: [{ field: exampleVals.string, operator: ">", value: exampleVals.number }],
      }),
    ).not.toThrow();
    expect(
      checkRule(typeCheck.queryOptionRule, {
        limit: exampleVals.number,
      }),
    ).not.toThrow();
    expect(
      checkRule(typeCheck.queryOptionRule, {
        order: {
          by: exampleVals.string,
          direction: "desc",
        },
      }),
    ).not.toThrow();
    expect(
      checkRule(typeCheck.queryOptionRule, {
        order: [
          {
            by: exampleVals.string,
            direction: "desc",
          },
        ],
      }),
    ).not.toThrow();
    expect(
      checkRule(typeCheck.queryOptionRule, {
        cursor: {
          origin: exampleVals.number,
          direction: "startAt",
        },
      }),
    ).not.toThrow();
  });

  it("wrong where", () => {
    expect(
      checkRule(typeCheck.queryOptionRule, {
        where: { field: exampleVals.number, operator: ">", value: exampleVals.number },
      }),
    ).toThrow();
    expect(
      checkRule(typeCheck.queryOptionRule, {
        where: [{ field: exampleVals.number, operator: ">", value: exampleVals.number }],
      }),
    ).toThrow();
  });
  it("wrong limit", () => {
    expect(
      checkRule(typeCheck.queryOptionRule, {
        limit: { foo: "bar" },
      }),
    ).toThrow();
    expect(
      checkRule(typeCheck.queryOptionRule, {
        limit: exampleVals.string,
      }),
    ).toThrow();
  });
  it("wrong order", () => {
    expect(
      checkRule(typeCheck.queryOptionRule, {
        order: {
          by: exampleVals.number,
          direction: "desc",
        },
      }),
    ).toThrow();
    expect(
      checkRule(typeCheck.queryOptionRule, {
        order: [
          {
            by: exampleVals.number,
            direction: "desc",
          },
        ],
      }),
    ).toThrow();
  });
  it("wrong cursor", () => {
    expect(
      checkRule(typeCheck.queryOptionRule, {
        cursor: {
          origin: exampleVals.number,
          direction: "wrongDirection",
        },
      }),
    ).toThrow();
    expect(
      checkRule(typeCheck.queryOptionRule, {
        cursor: [
          {
            origin: exampleVals.number,
            direction: "startAt",
          },
        ],
      }),
    ).toThrow();
  });
});

describe("query rule", () => {
  it("expected usage", () => {
    expect(
      checkRule(typeCheck.queryRule, {
        location: exampleVals.string,
        connects: exampleVals.boolean,
        acceptOutdated: exampleVals.boolean,
        callback: exampleVals.function,
        where: { field: exampleVals.string, operator: ">", value: exampleVals.number },
        limit: exampleVals.number,
        order: {
          by: exampleVals.string,
          direction: "desc",
        },
        cursor: {
          origin: exampleVals.number,
          direction: "startAt",
        },
      }),
    ).not.toThrow();
    expect(
      checkRule(typeCheck.queryRule, {
        location: exampleVals.string,
      }),
    ).not.toThrow();
  });
  it("without location", () => {
    expect(
      checkRule(typeCheck.queryRule, {
        connects: exampleVals.boolean,
      }),
    ).toThrow();
  });
});

describe("arrayGetFql rule", () => {
  it("expected usage", () => {
    expect(
      checkRule(typeCheck.arrayGetFqlRule, {
        connects: exampleVals.boolean,
        queries: [
          {
            location: exampleVals.string,
            connects: exampleVals.boolean,
            acceptOutdated: exampleVals.boolean,
            callback: exampleVals.function,
            where: { field: exampleVals.string, operator: ">", value: exampleVals.number },
            limit: exampleVals.number,
            order: {
              by: exampleVals.string,
              direction: "desc",
            },
            cursor: {
              origin: exampleVals.number,
              direction: "startAt",
            },
          },
        ],
      }),
    ).not.toThrow();
    expect(
      checkRule(typeCheck.arrayGetFqlRule, {
        queries: [
          {
            location: exampleVals.string,
          },
        ],
      }),
    ).not.toThrow();
  });
  it("wrong queries", () => {
    expect(
      checkRule(typeCheck.arrayGetFqlRule, {
        queries: {
          location: exampleVals.string,
        },
      }),
    ).toThrow();
    expect(
      checkRule(typeCheck.arrayGetFqlRule, {
        queries: {
          foo: {
            location: exampleVals.string,
          },
        },
      }),
    ).toThrow();
  });
});
describe("getFql rule", () => {
  it("expected usage", () => {
    expect(
      checkRule(typeCheck.getFqlRule, {
        connects: exampleVals.boolean,
        queries: {
          foo: {
            location: exampleVals.string,
            connects: exampleVals.boolean,
            acceptOutdated: exampleVals.boolean,
            callback: exampleVals.function,
            where: { field: exampleVals.string, operator: ">", value: exampleVals.number },
            limit: exampleVals.number,
            order: {
              by: exampleVals.string,
              direction: "desc",
            },
            cursor: {
              origin: exampleVals.number,
              direction: "startAt",
            },
          },
        },
      }),
    ).not.toThrow();
    expect(
      checkRule(typeCheck.getFqlRule, {
        queries: {
          foo: {
            location: exampleVals.string,
          },
        },
      }),
    ).not.toThrow();
  });
  it("wrong queries", () => {
    expect(
      checkRule(typeCheck.getFqlRule, {
        queries: {
          location: exampleVals.string,
        },
      }),
    ).toThrow();
    expect(
      checkRule(typeCheck.getFqlRule, {
        queries: [
          {
            location: exampleVals.string,
          },
        ],
      }),
    ).toThrow();
  });
});

describe("paginate rule", () => {
  it("expected usage", () => {
    expect(
      checkRule(typeCheck.paginateOptionRule, {
        acceptOutdated: exampleVals.boolean,
        callback: exampleVals.function,
        where: { field: exampleVals.string, operator: ">", value: exampleVals.number },
        limit: exampleVals.number,
        order: {
          by: exampleVals.string,
          direction: "desc",
        },
        // this will be ignored in usePaginateCollection
        cursor: {
          origin: exampleVals.number,
          direction: "startAt",
        },
      }),
    ).not.toThrow();
    expect(
      checkRule(typeCheck.paginateOptionRule, {
        limit: exampleVals.number,
        order: {
          by: exampleVals.string,
          direction: "desc",
        },
      }),
    ).not.toThrow();
  });
  it("without limit", () => {
    expect(
      checkRule(typeCheck.paginateOptionRule, {
        order: {
          by: exampleVals.string,
          direction: "desc",
        },
      }),
    ).toThrow();
  });
  it("without order", () => {
    expect(
      checkRule(typeCheck.paginateOptionRule, {
        limit: exampleVals.number,
      }),
    ).toThrow();
  });
});

describe("assertStaticSetFql", () => {
  it("expected usage", () => {
    expect(
      checkAssert(typeCheck.assertStaticSetFql, {
        id: exampleVals.string,
        fields: exampleVals.object,
        subCollection: {
          users: [
            {
              id: exampleVals.string,
              subCollection: {
                users: [
                  {
                    id: exampleVals.string,
                  },
                ],
              },
            },
          ],
        },
      }),
    ).not.toThrow();
    expect(checkAssert(typeCheck.assertStaticSetFql, {})).not.toThrow();
  });
  it("wrong fields", () => {
    expect(
      checkAssert(typeCheck.assertStaticSetFql, {
        fields: exampleVals.string,
      }),
    ).toThrow();
  });
  it("wrong sub collection", () => {
    expect(
      checkAssert(typeCheck.assertStaticSetFql, {
        subCollection: {
          users: {
            id: exampleVals.string,
          },
        },
      }),
    ).toThrow();
    expect(
      checkAssert(typeCheck.assertStaticSetFql, {
        subCollection: [
          {
            id: exampleVals.string,
          },
        ],
      }),
    ).toThrow();
    expect(
      checkAssert(typeCheck.assertStaticSetFql, {
        subCollection: {
          users: [
            {
              id: exampleVals.number,
            },
          ],
        },
      }),
    ).toThrow();
  });
});

describe("assertSetFql", () => {
  it("expected usage", () => {
    expect(
      checkAssert(typeCheck.assertSetFql, {
        id: exampleVals.string,
        fields: exampleVals.object,
        subCollection: {
          users: [
            {
              id: exampleVals.string,
              subCollection: {
                users: [
                  {
                    id: exampleVals.string,
                  },
                ],
              },
            },
          ],
        },
      }),
    ).not.toThrow();
    expect(checkAssert(typeCheck.assertSetFql, {})).not.toThrow();
    expect(checkAssert(typeCheck.assertSetFql, exampleVals.function)).not.toThrow();
  });
  it("wrong fields", () => {
    expect(
      checkAssert(typeCheck.assertSetFql, {
        fields: exampleVals.string,
      }),
    ).toThrow();
  });
});

describe("assertStaticSetCollectionFql", () => {
  it("expected usage", () => {
    expect(
      checkAssert(typeCheck.assertStaticSetCollectionFql, [
        {
          id: exampleVals.string,
          fields: exampleVals.object,
          subCollection: {
            users: [{ id: exampleVals.string }],
          },
        },
      ]),
    ).not.toThrow();
    expect(checkAssert(typeCheck.assertStaticSetCollectionFql, [{}])).not.toThrow();
  });
  it("wrong fields", () => {
    expect(
      checkAssert(typeCheck.assertStaticSetCollectionFql, [
        {
          fields: exampleVals.string,
        },
      ]),
    ).toThrow();
  });
});
describe("assertSetCollectionFql", () => {
  it("expected usage", () => {
    expect(checkAssert(typeCheck.assertSetCollectionFql, [exampleVals.function])).not.toThrow();
    expect(checkAssert(typeCheck.assertSetCollectionFql, [{}])).not.toThrow();
  });
  it("wrong fields", () => {
    expect(
      checkAssert(typeCheck.assertStaticSetCollectionFql, [
        {
          fields: exampleVals.string,
        },
      ]),
    ).toThrow();
  });
});

describe("assertSetDocsFql", () => {
  it("expected usage", () => {
    expect(
      checkAssert(typeCheck.assertSetDocsFql, {
        "foo/bar": () => ({
          id: exampleVals.string,
          fields: exampleVals.object,
        }),
      }),
    ).not.toThrow();
    expect(
      checkAssert(typeCheck.assertSetDocsFql, {
        "foo/bar": () => exampleVals.function,
      }),
    ).not.toThrow();
  });
  it("wrong fields", () => {
    expect(
      checkAssert(typeCheck.assertSetDocsFql, {
        "foo/bar": {
          fields: exampleVals.string,
        },
      }),
    ).toThrow();
  });
});
