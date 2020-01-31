import React from "react";
import { useSetCollection } from "../react-fireclient";

function View(props) {
  const [setFn, writing, called, error] = useSetCollection("teams", [
    {
      fields: {
        foo: "bar",
      },
    },
    {
      fields: {
        foo: "bar",
      },
    },
    foo => ({
      fields: {
        foo: foo,
      },
    }),
  ]);
  const handleClick = () => setFn("foo");
  return (
    <>
      <button onClick={handleClick}>asdf</button>
      {!called && <div>(It seems no action was called.)</div>}
      {writing && <div>Setting...</div>}
      {error !== null && <div>Error</div>}
      {!writing && called && error === null && <div>Completed</div>}
    </>
  );
}

export default View;
