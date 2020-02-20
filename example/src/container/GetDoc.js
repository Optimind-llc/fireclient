import React from "react";
import { useGetDoc } from "react-fireclient";

function View(props) {
  const { docPath } = props;
  const [doc, loading, error, reloadFn] = useGetDoc(docPath);
  const code = `
  const [doc, loading, error, reloadFn] = useGetDoc("${docPath}");
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
      <button onClick={reloadFn}>
        <code>reloadFn()</code>
      </button>
    </>
  );
}

export default View;
