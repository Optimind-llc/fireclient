import React from "react";
import { useAddDocs, useUpdateDocs, useSetDocs } from "../react-fireclient";

function View(props) {
  const [setFn, writing, called, error] = useSetDocs(
    {
      "cities/nagoya": (n, userName) => ({
        fields: {
          asdf: 3 * n,
        },
        subCollection: {
          users: [
            {
              id: "hoge",
              fields: {
                aaa: 123,
              },
            },
          ],
        },
      }),
      "cities/chikusa": n => ({
        fields: {
          fgh: n,
        },
      }),
    },
    { merge: true },
  );
  const handleClick = () => {
    setFn(123, "taro");
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
