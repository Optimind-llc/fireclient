import React, { useState } from "react";
import { shallow, mount } from "./enzyme";
import { act } from "react-dom/test-utils";
import { Provider, useGetDoc } from "../../dist";
import db from "./firestore";

const Wrapper = ({ callback }) => {
  const [doc, loading, error, reloadFn] = useGetDoc("/cities/Tokyo", {
    callback: () => {
      callback();
    },
  });
  return (
    <>
      <span className="obj">
        {JSON.stringify({
          doc,
          loading,
          error,
        })}
      </span>
      <button onClick={reloadFn}></button>
    </>
  );
};

describe("useGetDoc", () => {
  it("Before fetching doc", () => {
    const app = mount(
      <Provider firestoreDB={db}>
        <Wrapper />
      </Provider>,
    );

    const obj = JSON.parse(app.find(".obj").text());
    const { doc, loading, error, accessCount } = obj;
    expect(doc.data).toEqual(null);
    expect(doc.id).toEqual(null);
    expect(loading).toEqual(true);
    expect(error).toEqual(null);
  });
  it("After fetching doc", done => {
    let app;
    const callback = () => {
      const obj = JSON.parse(app.find(".obj").text());
      expect;
      const { doc, loading, error } = obj;
      expect(doc.data.country).toEqual("Japan");
      expect(doc.data.name).toEqual("Tokyo");
      expect(doc.data.population).toEqual(35676000);
      expect(doc.id).toEqual("Tokyo");
      expect(loading).toEqual(false);
      expect(error).toEqual(null);
      done();
    };
    app = mount(
      <Provider firestoreDB={db}>
        <Wrapper callback={callback} />
      </Provider>,
    );
  });
});
