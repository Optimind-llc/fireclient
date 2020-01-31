import React from "react";
import { useSetDoc } from "../react-fireclient";

function View(props) {
  const [setFn, writing, called, error] = useSetDoc("teams/Tokyo", {
    fields: {
      foo: "bar",
    },
  });
  return (
    <>
      <button onClick={setFn}>asdf</button>
      {!called && <div>(It seems no action was called.)</div>}
      {writing && <div>Setting...</div>}
      {error !== null && <div>Error</div>}
      {!writing && called && error === null && <div>Completed</div>}
    </>
  );
}

export default View;
