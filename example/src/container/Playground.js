import React from "react";
import { useUpdateDoc } from "../react-fireclient";

function View(props) {
  const [foo] = useUpdateDoc(
    "cities/Tokyo",
    {
      fields: {
        "foo.a": 4,
      },
    },
    { merge: true },
  );
  return (
    <>
      <h2>Response</h2>
      <h3>writing</h3>
      <button onClick={foo}>asdf</button>
    </>
  );
}

export default View;
