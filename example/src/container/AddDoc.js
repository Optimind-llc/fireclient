import React from "react";
import { useAddDoc } from "../react-fireclient";

function View(props) {
  const { collectionPath, query } = props;
  const [setFn, writing, called, error] = useAddDoc(collectionPath, {
    fields: query,
  });
  const code = `
  const [setFn, writing, called, error] = useAddDoc(collectionPath, {
    fields: ${JSON.stringify(query)},
  });
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
