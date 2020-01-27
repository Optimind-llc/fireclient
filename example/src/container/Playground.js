import React from "react";
import { useAddDocs, useUpdateDocs, useSetDocs } from "../react-fireclient";

function View(props) {
  const [setFn, writing, called, error] = useSetDocs({
    "cities/nagoya": n => ({
      fields: 123,
    }),
    "cities/chikusa": n => ({
      fields: {
        common: n,
      },
    }),
  });
  const handleClick = () => {
    console.log("fooo");
    setFn("123");
  };
  return (
    <>
      <button onClick={handleClick}>setFn</button>
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
