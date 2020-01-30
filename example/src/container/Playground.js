import React from "react";
import { useQuery } from "../react-fireclient";

function View(props) {
  const [foo, , , fn] = useQuery({
    acceptOutdated: true,
    callback: () => console.log("parent callback"),
    queries: {
      fll: {
        location: "teams/A",
        acceptOutdated: false,
        callback: () => console.log("child callback"),
      },
    },
  });
  return (
    <>
      <button onClick={fn.reload}>reload</button>
      <h2>Response</h2>
      <h3>writing</h3>
      <pre>{JSON.stringify(foo, null, 4)}</pre>
    </>
  );
}

export default View;
