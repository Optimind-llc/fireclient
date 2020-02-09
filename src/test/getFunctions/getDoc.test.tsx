import React from "react";
import * as pathlib from "path";
import { mount } from "../enzyme";
import db from "../firestore";
import backup from "../backup1.json";
import { Provider } from "../../../dist";
import { getDoc, subscribeDoc } from "../../../dist/getFunctions";
import { generateHooksId } from "../../../dist/utils";

let container;

const GetWrapper = ({ path, onGet }) => {
  const onError = err => {
    throw new Error(err);
  };
  getDoc(path, onGet, onError, false, false);
  return <></>;
};

const mountComponent = (path, onGet) =>
  mount(
    <Provider firestoreDB={db}>
      <GetWrapper path={path} onGet={onGet} />
    </Provider>,
    { attachTo: container },
  );

const testGettingDoc = path => {
  it(`Get Doc "${path}"`, async done => {
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
      done();
    };
    mountComponent(path, onGet);
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
