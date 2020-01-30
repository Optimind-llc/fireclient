import React, { useState } from "react";
import styled from "styled-components";
import { BrowserRouter, Route, Link } from "react-router-dom";

import GetDoc from "./container/GetDoc";
import GetCollection from "./container/GetCollection";
import SubscribeDoc from "./container/SubscribeDoc";
import LazyGetDoc from "./container/LazyGetDoc";
import SetDoc from "./container/SetDoc";
import AddDoc from "./container/AddDoc";
import UpdateDoc from "./container/UpdateDoc";
import SetCollection from "./container/SetCollection";
import AddDocWithSubCollection from "./container/AddDocWithSubCollection";

import Playground from "./container/Playground";

const PageContainer = styled.div`
  padding: 20px;
`;
const StyledInput = styled.input`
  padding: 5px;
`;
const StyledTextArea = styled.textarea`
  padding: 5px;
  width: 300px;
  height: 80px;
  resize: none;
`;
const StyledButton = styled.button`
  margin: 10px;
`;

const firebaseConfigCode = `
const firebaseConfig = {
  apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "xxxxxxxxxxxxxxxxxxxxxxx.firebaseapp.com",
  databaseURL: "https://xxxxxxxxxxxxxxxxxxxxxxx.firebaseio.com",
  projectId: "xxxxxxxxxxxxxxxxxxxxxxx",
  storageBucket: "xxxxxxxxxxxxxxxxxxxxxxx.appspot.com",
  messagingSenderId: "xxxxxxxxxxxx",
  appId: "x:xxxxxxxxxxxx:web:xxxxxxxxxxxxxxxxxxxxxx",
};
`;

const pagesTemplate = (docPath, collectionPath, query) => [
  {
    title: "useGetDoc",
    path: "/",
    component: docPath.length > 0 ? <GetDoc docPath={docPath} /> : <h2>Doc path is required.</h2>,
  },
  {
    title: "useGetCollection",
    component:
      collectionPath.length > 0 ? (
        <GetCollection collectionPath={collectionPath} />
      ) : (
        <h2>Collection path is required.</h2>
      ),
  },
  {
    title: "useSubscribeDoc",
    component:
      docPath.length > 0 ? <SubscribeDoc docPath={docPath} /> : <h2>Doc path is required.</h2>,
  },
  {
    title: "useLazyGetDoc",
    component:
      docPath.length > 0 ? <LazyGetDoc docPath={docPath} /> : <h2>Doc path is required.</h2>,
  },
  {
    title: "useSetDoc",
    component:
      docPath.length > 0 && query !== null ? (
        <SetDoc docPath={docPath} query={query} />
      ) : (
        <h2>Doc path and query is required.</h2>
      ),
  },
  {
    title: "useAddDoc",
    component:
      collectionPath.length > 0 && query !== null ? (
        <AddDoc collectionPath={collectionPath} query={query} />
      ) : (
        <h2>Collection path and query is required.</h2>
      ),
  },
  {
    title: "useUpdateDoc",
    component:
      docPath.length > 0 && query !== null ? (
        <UpdateDoc docPath={docPath} query={query} />
      ) : (
        <h2>Doc path and query is required.</h2>
      ),
  },
  // {
  //   title: "Playground",
  //   component: <Playground />,
  // },
];

const App = () => {
  const [docPathCache, setDocPathCache] = useState("");
  const [collectionPathCache, setCollectionPathCache] = useState("");
  const [queryCache, setQueryCache] = useState("");
  const [docPath, setDocPath] = useState("");
  const [collectionPath, setCollectionPath] = useState("");
  const [query, setQuery] = useState({
    foo: "Hello",
    bar: "Fireclient",
  });
  const [parseError, setParseError] = useState(false);

  const queryExample = `
  {
    foo: "Hello",
    bar: "Fireclient"
  }
  `;

  const pages = pagesTemplate(docPath, collectionPath, query);

  return (
    <>
      <BrowserRouter>
        <h1>0. Change firebaseConfig in index.js into your Firebase config</h1>
        <pre>{firebaseConfigCode}</pre>
        <h1>1. Enter your firestore Doc or Collection Path.</h1>
        <h2>Doc Path</h2>
        <StyledInput
          type="text"
          placeholder="Doc path"
          onChange={e => setDocPathCache(e.target.value)}
        />
        <StyledButton onClick={() => setDocPath(docPathCache)}>Apply</StyledButton>
        <pre>Doc Path : {docPath}</pre>

        <h2>Collection Path</h2>
        <StyledInput
          type="text"
          placeholder="Collection path"
          onChange={e => setCollectionPathCache(e.target.value)}
        />
        <StyledButton onClick={() => setCollectionPath(collectionPathCache)}>Apply</StyledButton>
        <pre>Collection Path : {collectionPath}</pre>

        <h2>Query Object</h2>
        <StyledTextArea
          type="text"
          placeholder={queryExample}
          onChange={e => setQueryCache(e.target.value)}
        />
        <StyledButton
          onClick={() => {
            try {
              const obj = new Function("return " + queryCache)();
              if (obj === undefined) {
                return;
              }
              setQuery(obj);
              setParseError(false);
            } catch (err) {
              setParseError(true);
            }
          }}
        >
          Apply
        </StyledButton>
        <pre>
          Query Object : <br />
          {!parseError ? JSON.stringify(query) : "Object parsing fails."}
        </pre>

        <h1>2. Select Hooks and check results 🥳</h1>

        {pages.map(page => (
          <Link to={`/${page.title}`}>
            <button>{page.title}</button>{" "}
          </Link>
        ))}

        <PageContainer>
          {pages.map(page => (
            <Route exact path={`/${page.title}`} render={() => page.component} />
          ))}
        </PageContainer>
      </BrowserRouter>
    </>
  );
};

export default App;
