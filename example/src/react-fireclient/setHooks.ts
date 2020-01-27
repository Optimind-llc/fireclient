import "firebase/firestore";
import { useState } from "react";
import {
  SetCollectionSchema,
  SetCollectionSchemaObject,
  SetDocSchema,
  SetDocSchemaObject,
} from ".";
import { addDoc, setCollection, setDoc, updateDoc } from "./setFunctions";
import * as typeCheck from "./typeCheck";
import { assertRule, matches, assertSetDocSchemaObject } from "./typeCheck";

// ------------------------------------------
//  Set Hooks Base
// ------------------------------------------

function useSetBase<SetQueryObject>(
  path: string,
  query: SetQueryObject | ((...args: any) => SetQueryObject),
  setFunction: (
    path: string,
    query: SetQueryObject,
    onWrite: () => void,
    onError: (error: any) => void,
    options?: {
      merge?: boolean;
      mergeFields?: string[];
      callback?: () => void;
    },
  ) => void,
  options?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
  },
) {
  // Arg typeCheck
  assertRule([
    { key: "path", fn: typeCheck.isString },
    {
      key: "options",
      optional: true,
      fn: matches(typeCheck.mergeRule.concat(typeCheck.callbackRule)),
    },
  ])({ path, options }, "Argument");
  typeCheck.assertSetDocSchema(query);

  const [writing, setWriting] = useState(false);
  const [called, setCalled] = useState(false);
  const [error, setError] = useState(null);

  // ObjectでQueryを指定していた場合Functionに変換する
  const queryGenerator = query instanceof Function ? query : () => query;

  const writeFn = (...args: any) => {
    const queryObject = queryGenerator(...args);
    assertSetDocSchemaObject(queryObject);
    setWriting(true);
    setCalled(true);
    setFunction(
      path,
      queryGenerator(...args),
      () => {
        setError(null);
        setWriting(false);
        if (options?.callback !== undefined) options.callback();
      },
      err => {
        setError(err);
        setWriting(false);
      },
      options,
    );
  };
  return [writeFn, writing, called, error];
}

function useSetDocsBase(
  queries: { [key: string]: SetDocSchema },
  setFunction: (
    path: string,
    query: SetDocSchemaObject,
    onWrite: () => void,
    onError: (error: any) => void,
    options?: {
      merge?: boolean;
      mergeFields?: string[];
      callback?: () => void;
    },
  ) => void,
  options?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
  },
) {
  // Arg typeCheck
  assertRule([
    {
      key: "options",
      optional: true,
      fn: matches(typeCheck.mergeRule.concat(typeCheck.callbackRule)),
    },
  ])({ options }, "Argument");
  typeCheck.assertSetDocsSchema(queries);

  const [writing, setWriting] = useState(false);
  const [called, setCalled] = useState(false);
  const [error, setError] = useState(null);

  const queryEntries = Object.entries(queries);

  const writeFn = (...args: any) => {
    setWriting(true);
    setCalled(true);

    Promise.all(
      queryEntries.map(
        ([path, query]) =>
          new Promise((resolve, reject) => {
            const queryGenerator = query instanceof Function ? query : () => query;
            const queryObject = queryGenerator(...args);
            assertSetDocSchemaObject(queryObject);
            setFunction(path, queryObject, resolve, reject, options);
          }),
      ),
    )
      .then(() => {
        setError(null);
        setWriting(false);
        if (options?.callback !== undefined) options.callback();
      })
      .catch(err => {
        setError(err);
        setWriting(false);
      });
  };
  return [writeFn, writing, called, error];
}

function useSetDocBase(
  path: string,
  query: SetDocSchema,
  setFunction: (
    path: string,
    query: SetDocSchemaObject,
    onWrite: () => void,
    onError: (error: any) => void,
    options?: {
      merge?: boolean;
      mergeFields?: string[];
      callback?: () => void;
    },
  ) => void,
  options?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
  },
) {
  // Arg typeCheck
  typeCheck.assertSetDocSchema(query);
  matches([
    { key: "path", fn: typeCheck.isString },
    {
      key: "options",
      fn: matches(typeCheck.queryOptionRule.concat(typeCheck.acceptOutdatedRule)),
    },
  ])({ path, options }, "Argument");
  return useSetBase(path, query, setFunction, options);
}

function useSetCollectionBase(
  path: string,
  queries: SetCollectionSchema,
  setFunction: (
    path: string,
    queries: SetCollectionSchemaObject,
    onWrite: () => void,
    onError: (error: any) => void,
    options?: {
      merge?: boolean;
      mergeFields?: string[];
    },
  ) => void,
  options?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
  },
) {
  // Arg typeCheck
  typeCheck.assertSetCollectionSchema(queries);
  matches([
    { key: "path", fn: typeCheck.isString },
    {
      key: "options",
      fn: matches(typeCheck.queryOptionRule.concat(typeCheck.acceptOutdatedRule)),
    },
  ])({ path, options }, "Argument");
  return useSetBase(path, queries, setFunction, options);
}

// ------------------------------------------
//  Set Doc Hooks
// ------------------------------------------

export function useSetDoc(
  docPath: string,
  query: SetDocSchema,
  options?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
  },
) {
  return useSetDocBase(docPath, query, setDoc, options);
}
export function useAddDoc(
  collectionPath: string,
  query: SetDocSchema,
  options?: {
    callback?: () => void;
  },
) {
  return useSetDocBase(collectionPath, query, addDoc, options);
}
export function useUpdateDoc(
  docPath: string,
  query: SetDocSchema,
  options?: {
    callback?: () => void;
  },
) {
  return useSetDocBase(docPath, query, updateDoc, options);
}

// ------------------------------------------
//  Set Docs Hooks
// ------------------------------------------

export function useAddDocs(
  queries: { [key: string]: SetDocSchema },
  options?: {
    callback?: () => void;
  },
) {
  return useSetDocsBase(queries, addDoc, options);
}
export function useSetDocs(
  queries: { [key: string]: SetDocSchema },
  options?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
  },
) {
  return useSetDocsBase(queries, setDoc, options);
}
export function useUpdateDocs(
  queries: { [key: string]: SetDocSchema },
  options?: {
    callback?: () => void;
  },
) {
  return useSetDocsBase(queries, updateDoc, options);
}

// ------------------------------------------
//  Set Collection Hooks
// ------------------------------------------

export function useSetCollection(
  collectionPath: string,
  query: SetCollectionSchema,
  options?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
  },
) {
  return useSetCollectionBase(collectionPath, query, setCollection, options);
}
