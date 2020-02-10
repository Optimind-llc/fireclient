import React from "react";
import { useSetCollection, useQuery } from "../react-fireclient";

function View(props) {
  const fql = {
    // saveToState: false,
    queries: {
      number: {
        location: "/test/number",
      },
      string: {
        location: "/test/string",
      },
      cities: {
        location: "/cities",
        where: {
          field: "population",
          operator: ">=",
          value: 19354922,
        },
        order: {
          by: "name",
        },
      },
    },
  };
  const [d] = useQuery(fql);
  return (
    <>
      {/* <button onClick={handleClick}>asdf</button>
      {!called && <div>(It seems no action was called.)</div>}
      {writing && <div>Setting...</div>}
      {error !== null && <div>Error</div>}
      {!writing && called && error === null && <div>Completed</div>} */}
      <pre>{JSON.stringify(d, null, 4)}</pre>
    </>
  );
}

export default View;
