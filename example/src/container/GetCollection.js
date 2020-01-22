import React from "react";
import { useGetCollection } from "../react-fireclient";

function View(props) {
  const { collectionPath } = props;
  const [collection, loading, error, reloadFn] = useGetCollection(collectionPath);
  const code = `
  const [collection, loading, error, reloadFn] = useGetCollection("${collectionPath}");
  `;
  return (
    <>
      <h2>Code</h2>
      <pre>{code}</pre>
      <h2>Response</h2>
      <h3>collection</h3>
      <pre>{JSON.stringify(collection, null, 4)}</pre>
      <h3>loading</h3>
      <pre>{JSON.stringify(loading)}</pre>
      <h3>error</h3>
      <pre>{JSON.stringify(error)}</pre>
      <button onClick={reloadFn}>reloadFn</button>
    </>
  );
}

export default View;
