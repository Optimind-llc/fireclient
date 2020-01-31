import * as typeCheck from "../../dist/typeCheck";

const fn = (rule, obj) => () => typeCheck.assertRule(rule)(obj, "test");
describe("Get Fql", () => {
  it("Object Fql", () => {
    expect(
      fn(typeCheck.getFqlRule, {
        connects: true,
        queries: {
          foo: {
            location: "path",
            connects: true,
          },
        },
      }),
    ).not.toThrow();
    expect(
      fn(typeCheck.getFqlRule, {
        connects: true,
        queries: {
          foo: {
            location: "path",
            connects: true,
            where: {
              field: "asdf",
              operator: ">",
              value: 123,
            },
          },
        },
      }),
    ).not.toThrow();
    expect(
      fn(typeCheck.getFqlRule, {
        connects: true,
        queries: {
          foo: {
            location: "path",
            connects: true,
            where: {
              field: "asdf",
              operator: ">",
            },
          },
        },
      }),
    ).toThrow();

    expect(
      fn(typeCheck.getFqlRule, {
        connects: true,
        queries: {
          foo: {
            location: null,
            connects: true,
          },
        },
      }),
    ).toThrow();
    expect(
      fn(typeCheck.getFqlRule, {
        connects: true,
        queries: {
          foo: {
            location: 123,
            connects: true,
          },
        },
      }),
    ).toThrow();
    expect(
      fn(typeCheck.getFqlRule, {
        connects: true,
        queries: {
          foo: {
            location: () => console.log("foo"),
            connects: true,
          },
        },
      }),
    ).toThrow();
    expect(
      fn(typeCheck.getFqlRule, {
        connects: true,
        queries: {
          foo: {
            location: () => [1, 2, 3, 4],
            connects: true,
          },
        },
      }),
    ).toThrow();
    expect(
      fn(typeCheck.getFqlRule, {
        connects: true,
        queries: {
          foo: {
            location: { foo: "bar" },
            connects: true,
          },
        },
      }),
    ).toThrow();

    expect(
      fn(typeCheck.getFqlRule, {
        connects: true,
        queries: {
          foo: {
            location: () => "path",
            connects: 1,
          },
        },
      }),
    ).toThrow();
    expect(
      fn(typeCheck.getFqlRule, {
        connects: true,
        queries: {
          foo: {
            location: true,
            connects: 1,
          },
        },
      }),
    ).toThrow();
    expect(
      fn(typeCheck.getFqlRule, {
        connects: true,
        queries: {
          foo: {
            location: () => "path",
            connects: "foo",
          },
        },
      }),
    ).toThrow();
    expect(
      fn(typeCheck.getFqlRule, {
        connects: true,
        queries: {
          foo: {
            location: () => "path",
            connects: [1, 2, 3],
          },
        },
      }),
    ).toThrow();
    expect(
      fn(typeCheck.getFqlRule, {
        connects: true,
        queries: {
          foo: {
            location: () => "path",
            connects: null,
          },
        },
      }),
    ).toThrow();
    expect(
      fn(typeCheck.getFqlRule, {
        connects: true,
        queries: {
          foo: {
            location: () => "path",
            connects: () => console.log("foo"),
          },
        },
      }),
    ).toThrow();
    expect(
      fn(typeCheck.getFqlRule, {
        connects: true,
        queries: {
          foo: {
            location: () => "path",
            connects: { foo: "bar" },
          },
        },
      }),
    ).toThrow();
    expect(
      fn(typeCheck.getFqlRule, {
        connects: true,
        queries: [
          {
            location: () => "path",
            connects: { foo: "bar" },
          },
        ],
      }),
    ).toThrow();

    expect(fn(typeCheck.getFqlRule, { connects: true })).toThrow();
  });
  it("Array Fql", () => {
    expect(
      fn(typeCheck.arrayGetFqlRule, {
        connects: true,
        queries: [
          {
            location: "path",
            connects: true,
          },
        ],
      }),
    ).not.toThrow();
    expect(
      fn(typeCheck.arrayGetFqlRule, {
        connects: true,
        queries: [
          {
            location: "path",
            connects: true,
            where: {
              field: "asdf",
              operator: ">",
              value: 123,
            },
          },
        ],
      }),
    ).not.toThrow();
    expect(
      fn(typeCheck.arrayGetFqlRule, {
        connects: true,
        queries: [
          {
            location: "path",
            connects: true,
            where: {
              field: "asdf",
              operator: ">",
            },
          },
        ],
      }),
    ).toThrow();

    expect(
      fn(typeCheck.arrayGetFqlRule, {
        connects: true,
        queries: [
          {
            location: null,
            connects: true,
          },
        ],
      }),
    ).toThrow();
    expect(
      fn(typeCheck.arrayGetFqlRule, {
        connects: true,
        queries: [
          {
            location: 123,
            connects: true,
          },
        ],
      }),
    ).toThrow();
    expect(
      fn(typeCheck.arrayGetFqlRule, {
        connects: true,
        queries: [
          {
            location: () => console.log("foo"),
            connects: true,
          },
        ],
      }),
    ).toThrow();
    expect(
      fn(typeCheck.arrayGetFqlRule, {
        connects: true,
        queries: [
          {
            location: () => [1, 2, 3, 4],
            connects: true,
          },
        ],
      }),
    ).toThrow();
    expect(
      fn(typeCheck.arrayGetFqlRule, {
        connects: true,
        queries: [
          {
            location: { foo: "bar" },
            connects: true,
          },
        ],
      }),
    ).toThrow();

    expect(
      fn(typeCheck.arrayGetFqlRule, {
        connects: true,
        queries: [
          {
            location: () => "path",
            connects: 1,
          },
        ],
      }),
    ).toThrow();
    expect(
      fn(typeCheck.arrayGetFqlRule, {
        connects: true,
        queries: [
          {
            location: true,
            connects: 1,
          },
        ],
      }),
    ).toThrow();
    expect(
      fn(typeCheck.arrayGetFqlRule, {
        connects: true,
        queries: [
          {
            location: () => "path",
            connects: "foo",
          },
        ],
      }),
    ).toThrow();
    expect(
      fn(typeCheck.arrayGetFqlRule, {
        connects: true,
        queries: [
          {
            location: () => "path",
            connects: [1, 2, 3],
          },
        ],
      }),
    ).toThrow();
    expect(
      fn(typeCheck.arrayGetFqlRule, {
        connects: true,
        queries: [
          {
            location: () => "path",
            connects: null,
          },
        ],
      }),
    ).toThrow();
    expect(
      fn(typeCheck.arrayGetFqlRule, {
        connects: true,
        queries: [
          {
            location: () => "path",
            connects: () => console.log("foo"),
          },
        ],
      }),
    ).toThrow();
    expect(
      fn(typeCheck.arrayGetFqlRule, {
        connects: true,
        queries: [
          {
            location: () => "path",
            connects: { foo: "bar" },
          },
        ],
      }),
    ).toThrow();
    expect(
      fn(typeCheck.arrayGetFqlRule, {
        connects: true,
        queries: {
          foo: {
            location: "path",
            connects: true,
          },
        },
      }),
    ).toThrow();

    expect(fn(typeCheck.arrayGetFqlRule, { connects: true })).toThrow();
  });
});

const fn2 = (assertFn, obj) => () => assertFn(obj, "test");

describe("SetSchema", () => {
  it("SetFql", () => {
    expect(
      fn2(typeCheck.assertSetFql, () => ({
        id: "foo",
        fields: {
          foo: "bar",
        },
        subCollection: {
          users: [
            {
              id: "foo",
            },
          ],
        },
      })),
    ).not.toThrow;
    expect(
      fn2(typeCheck.assertStaticSetFql, {
        id: "foo",
        fields: {
          foo: "bar",
        },
        subCollection: {
          users: [
            {
              id: "foo",
            },
          ],
        },
      }),
    ).not.toThrow();
    expect(
      fn2(typeCheck.assertStaticSetFql, {
        id: "foo",
        fields: {
          foo: "bar",
        },
        subCollection: {
          users: {
            id: "foo",
          },
        },
      }),
    ).toThrow();
    expect(
      fn2(typeCheck.assertStaticSetFql, {
        id: 123,
        fields: {
          foo: "bar",
        },
        subCollection: {
          users: [
            {
              id: "foo",
            },
          ],
        },
      }),
    ).toThrow();
    expect(
      fn2(typeCheck.assertStaticSetFql, {
        id: null,
        fields: {
          foo: "bar",
        },
        subCollection: {
          users: [
            {
              id: "foo",
            },
          ],
        },
      }),
    ).toThrow();
    expect(
      fn2(typeCheck.assertStaticSetFql, {
        id: "asdf",
        fields: {
          foo: "bar",
        },
        subCollection: {
          users: [
            {
              id: 123,
            },
          ],
        },
      }),
    ).toThrow();
    expect(
      fn2(typeCheck.assertStaticSetFql, {
        id: "asdf",
        fields: {
          foo: "bar",
        },
        subCollection: {
          users: [
            {
              id: null,
            },
          ],
        },
      }),
    ).toThrow();
  });
  it("SetCollectionFql", () => {
    expect(
      fn2(typeCheck.assertStaticSetCollectionFql, [
        {
          id: "asdf",
          fields: { foo: "bar" },
          subCollection: {
            users: [{ id: "asdf" }],
          },
        },
      ]),
    ).not.toThrow();
    expect(
      fn2(typeCheck.assertStaticSetCollectionFql, [
        () => ({
          id: "asdf",
          fields: { foo: "bar" },
          subCollection: {
            users: [{ id: "asdf" }],
          },
        }),
      ]),
    ).not.toThrow();
    expect(
      fn2(typeCheck.assertStaticSetCollectionFql, [
        {
          id: 123,
          fields: { foo: "bar" },
        },
      ]),
    ).toThrow();
    expect(
      fn2(typeCheck.assertStaticSetCollectionFql, [
        {
          id: null,
          fields: { foo: "bar" },
        },
      ]),
    ).toThrow();
    expect(
      fn2(typeCheck.assertStaticSetCollectionFql, {
        id: null,
        fields: { foo: "bar" },
      }),
    ).toThrow();
    expect(
      fn2(typeCheck.assertStaticSetCollectionFql, [
        {
          id: "asdf",
          fields: { foo: "bar" },
          subCollection: {
            users: [{ id: 123 }],
          },
        },
      ]),
    ).toThrow();
    expect(
      fn2(typeCheck.assertStaticSetCollectionFql, [
        {
          id: "asdf",
          fields: { foo: "bar" },
          subCollection: {
            users: [{ id: null }],
          },
        },
      ]),
    ).toThrow();
    expect(
      fn2(typeCheck.assertStaticSetCollectionFql, [
        {
          id: "asdf",
          fields: { foo: "bar" },
          subCollection: {
            users: { id: "asdf" },
          },
        },
      ]),
    ).toThrow();
  });
});
describe("SetDocsSchema", () => {
  it("main", () => {
    expect(
      fn2(typeCheck.assertSetDocsFql, {
        "foo/asdf": () => ({
          id: "asdf",
        }),
      }),
    ).not.toThrow();
    expect(
      fn2(typeCheck.assertSetDocsFql, {
        "foo/asdf": {
          id: "asdf",
        },
      }),
    ).not.toThrow();
    expect(
      fn2(typeCheck.assertSetDocsFql, {
        "foo/asdf": {
          fields: {
            foo: "bar",
          },
        },
      }),
    ).not.toThrow();
    expect(
      fn2(typeCheck.assertSetDocsFql, {
        "foo/asdf": {
          subCollection: {
            users: [
              {
                id: "asdf",
              },
            ],
          },
        },
      }),
    ).not.toThrow();
    expect(
      fn2(typeCheck.assertSetDocsFql, {
        "foo/asdf": {
          subCollection: {
            users: [
              {
                id: 123,
              },
            ],
          },
        },
      }),
    ).toThrow();
    expect(
      fn2(typeCheck.assertSetDocsFql, {
        "foo/asdf": {
          id: 123,
        },
      }),
    ).toThrow();
    expect(
      fn2(typeCheck.assertSetDocsFql, {
        "foo/asdf": {
          id: null,
        },
      }),
    ).toThrow();
    expect(
      fn2(typeCheck.assertSetDocsFql, {
        "foo/asdf": {
          fields: {
            asdf: null,
          },
        },
      }),
    ).not.toThrow();
    expect(
      fn2(typeCheck.assertSetDocsFql, {
        "foo/asdf": {
          fields: {
            asdf: [1, 2, 3],
          },
        },
      }),
    ).not.toThrow();
  });
});
