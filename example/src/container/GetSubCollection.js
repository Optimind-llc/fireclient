import React from "react";
import { useGetSubCollection } from "../react-fireclient";

function View(props) {
  const path = "/subcollections";
  const [users, loading, error] = useGetSubCollection(path, {
    subCollectionName: "users",
  });
  const code = `
  const path = "/subcollections";
  const [subCollection, loading, error] = useGetSubCollection(
    ${path}, {
    subCollectionName: "users",
  });
  `;
  return (
    <>
      <h2>Code</h2>
      <pre>{code}</pre>
      <h2>Response</h2>
      <h3>users</h3>
      <pre>{JSON.stringify(users, null, 4)}</pre>
      <h3>loading</h3>
      <pre>{JSON.stringify(loading)}</pre>
      <h3>error</h3>
    </>
  );
}

export default View;
