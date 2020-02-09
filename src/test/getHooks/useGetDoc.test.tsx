import * as pathlib from "path";
import { renderHook } from "@testing-library/react-hooks";
import db from "../firestore";
import backup from "../backup1.json";
import { useGetDoc, setContext } from "../../../dist";

const testGettingDoc = path => {
  it(`Get Doc "${path}"`, async () => {
    const pathSplitted = pathlib
      .resolve(path)
      .split("/")
      .slice(1);
    const expected = {
      data: pathSplitted.reduce((acc, val) => acc[val], backup),
      id: pathlib.basename(path),
    };

    const { result, waitForNextUpdate } = renderHook(() => {
      setContext(db);
      return useGetDoc(path, { saveToState: false });
    });

    expect(result.current[0].id).toBeNull();
    expect(result.current[0].data).toBeNull();
    expect(result.current[1]).toBeTruthy();
    expect(result.current[2]).toBeNull();
    await waitForNextUpdate();
    expect(result.current[0]).toEqual(expected);
    expect(result.current[1]).toBeFalsy();
    expect(result.current[2]).toBeNull();
  });
};

describe("should handle a simple query", () => {
  const docPaths = [
    "/test/array",
    "/test/boolean",
    "/test/map",
    "/test/null",
    "/test/number",
    "/test/string",
  ];
  docPaths.forEach(docPath => testGettingDoc(docPath));
});
