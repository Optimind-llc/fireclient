import { renderHook } from "@testing-library/react-hooks";
import * as pathlib from "path";
import { useState, useEffect } from "react";
import { subscribeDoc } from "../../../dist/getFunctions";
import { useSetContext } from "../../../dist/provider";
import { generateHooksId } from "../../../dist/utils";
import backup from "../backup1.json";
import db from "../firestore";

const useTest = ({ path, onGet }) => {
  useSetContext(db);
  const [finished, setFinished] = useState(false);
  const uuid = generateHooksId();
  const onError = err => {
    throw new Error(err);
  };
  const onListen = (): void => {
    /* do nothing */
  };
  useEffect(
    () =>
      subscribeDoc(
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
        false,
      ),
    [],
  );
  return finished;
};

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
    const onGet = docData => {
      expect(docData).toEqual(expected);
    };

    const { waitForNextUpdate } = renderHook(() => useTest({ path, onGet }));
    await waitForNextUpdate();
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
