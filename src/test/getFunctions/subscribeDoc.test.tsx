import React from "react";
import * as pathlib from "path";
import { mount } from "../enzyme";
import db from "../firestore";
import backup from "../backup1.json";
import { Provider } from "../../../dist";
import { getDoc, subscribeDoc } from "../../../dist/getFunctions";
import { generateHooksId } from "../../../dist/utils";

let container;
const SubscribeWrapper = ({ path, onChange }) => {
  const onError = err => {
    throw new Error(err);
  };
  const onListen = () => {};
  const uuid = generateHooksId();
  subscribeDoc(uuid, path, onChange, onError, onListen, false);
  return <></>;
};

const mountComponent = (path, onChange) =>
  mount(
    <Provider firestoreDB={db}>
      <SubscribeWrapper path={path} onChange={onChange} />
    </Provider>,
    { attachTo: container },
  );

const testSubscribingDoc = path => {
  it(`should handle a simple query "${path}"`, async done => {
    const pathSplitted = pathlib
      .resolve(path)
      .split("/")
      .slice(1);
    const expected = {
      data: pathSplitted.reduce((acc, val) => acc[val], backup),
      id: pathlib.basename(path),
    };
    const onChange = docData => {
      expect(docData).toEqual(expected);
      done();
    };
    mountComponent(path, onChange);
  });
};

describe("Subscribe Doc", () => {
  const docPaths = [
    "/test/array",
    "/test/boolean",
    "/test/map",
    "/test/null",
    "/test/number",
    "/test/string",
  ];
  docPaths.forEach(docPath => testSubscribingDoc(docPath));
});
