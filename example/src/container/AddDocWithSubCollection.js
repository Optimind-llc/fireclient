import React from "react";
import { useAddDoc } from "../react-fireclient";

function View(props) {
  const { collectionPath } = props;
  const query = {
    fields: {
      title: "Add Doc with SubCollection",
      foo: 123,
    },
    subCollection: {
      sub1: [
        {
          fields: {
            title: "Random ID",
            foo: 321,
          },
        },
        {
          id: "fooooo",
          fields: {
            title: "With specified ID",
            bar: 345,
          },
        },
      ],
    },
  };
  const [setFn, writing, called, error] = useAddDoc(collectionPath, query);
  const code = `
  const [setFn, writing, called, error] = useAddDoc(
    collectionPath, 
    ${JSON.stringify(query, null, 4)}
  );
  `;
  return (
    <>
      <h2>Code</h2>
      <pre>{code}</pre>
      <button onClick={setFn}>setFn</button>
      <h2>Response</h2>
      <h3>writing</h3>
      <pre>{JSON.stringify(writing)}</pre>
      <h3>called</h3>
      <pre>{JSON.stringify(called)}</pre>
      <h3>error</h3>
      <pre>{JSON.stringify(error)}</pre>
    </>
  );
}

export default View;
