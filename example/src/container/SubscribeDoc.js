import React from "react";
import { useSubscribeDoc } from "react-fireclient";

function View(props) {
  const { docPath } = props;
  const [doc, loading, error, unsubscribeFn] = useSubscribeDoc(docPath);
  const code = `
  const [doc, loading, error, unsubscribeFn] = useSubscribeDoc("${docPath}");
  `;
  return (
    <>
      <h2>Code</h2>
      <pre>{code}</pre>
      <h2>Response</h2>
      <h3>doc</h3>
      <pre>{JSON.stringify(doc, null, 4)}</pre>
      <h3>loading</h3>
      <pre>{JSON.stringify(loading)}</pre>
      <h3>error</h3>
      <pre>{JSON.stringify(error)}</pre>
      <button onClick={unsubscribeFn}>
        <code>unsubscribeFn()</code>
      </button>
    </>
  );
}

export default View;
