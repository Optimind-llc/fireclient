import React from "react";
import { useGetSubCollection } from "../react-fireclient";

function View(props) {
  const [foo] = useGetSubCollection("teams", "members", { callback: () => console.log("asdf") });
  return (
    <>
      <h2>Response</h2>
      <h3>writing</h3>
      <pre>{JSON.stringify(foo, null, 4)}</pre>
    </>
  );
}

export default View;
