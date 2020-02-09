import { getHashCode, generateHooksId, isDocPath } from "../../dist/utils";

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

describe("generateHooksId", () => {
  it("generates different id", () => {
    expect(generateHooksId()).not.toBe(generateHooksId());
  });
});

describe("isDocPath", () => {
  it("doc path should be return true", () => {
    expect(isDocPath("/foo/foo")).toBeTruthy();
    expect(isDocPath("/foo/foo/")).toBeTruthy();
    expect(isDocPath("foo/foo")).toBeTruthy();
    expect(isDocPath("foo/foo/")).toBeTruthy();
    expect(isDocPath("./foo/foo")).toBeTruthy();
    expect(isDocPath("./foo/foo/")).toBeTruthy();
    expect(isDocPath("/foo/foo/foo/foo")).toBeTruthy();
    expect(isDocPath("/foo/foo/foo/foo/foo/foo")).toBeTruthy();
  });
  it("collection path should be return true", () => {
    expect(isDocPath("/foo")).toBeFalsy();
    expect(isDocPath("/foo/")).toBeFalsy();
    expect(isDocPath("foo")).toBeFalsy();
    expect(isDocPath("foo/")).toBeFalsy();
    expect(isDocPath("./foo")).toBeFalsy();
    expect(isDocPath("./foo/")).toBeFalsy();
    expect(isDocPath("/foo/foo/foo")).toBeFalsy();
    expect(isDocPath("/foo/foo/foo/foo/foo")).toBeFalsy();
  });
});
