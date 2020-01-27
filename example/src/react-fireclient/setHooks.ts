import "firebase/firestore";
import { useState } from "react";
import {
  SetCollectionSchema,
  SetCollectionSchemaObject,
  SetDocSchema,
  SetDocSchemaObject,
} from ".";
import { addDoc, setCollection, setDoc, updateDoc } from "./setFunctions";
import * as validation from "./validation";
import { assertRule, matches, assertSetDocSchemaObject } from "./validation";

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
    option?: {
      merge?: boolean;
      mergeFields?: string[];
      callback?: () => void;
    },
  ) => void,
  option?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
  },
) {
  // Arg validation
  assertRule([
    { key: "path", fn: validation.isString },
    {
      key: "option",
      optional: true,
      fn: matches(validation.mergeRule.concat(validation.callbackRule)),
    },
  ])({ path, option }, "Argument");
  validation.assertSetDocSchema(query);

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
        if (option?.callback !== undefined) option.callback();
      },
      err => {
        setError(err);
        setWriting(false);
      },
      option,
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
    option?: {
      merge?: boolean;
      mergeFields?: string[];
      callback?: () => void;
    },
  ) => void,
  option?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
  },
) {
  // Arg validation
  assertRule([
    {
      key: "option",
      optional: true,
      fn: matches(validation.mergeRule.concat(validation.callbackRule)),
    },
  ])({ option }, "Argument");
  validation.assertSetDocsQuery(queries);

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
            setFunction(path, queryObject, resolve, reject, option);
          }),
      ),
    )
      .then(() => {
        setError(null);
        setWriting(false);
        if (option?.callback !== undefined) option.callback();
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
    option?: {
      merge?: boolean;
      mergeFields?: string[];
      callback?: () => void;
    },
  ) => void,
  option?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
  },
) {
  // Arg validation
  validation.assertSetDocSchema(query);
  matches([
    { key: "path", fn: validation.isString },
    {
      key: "option",
      fn: matches(validation.queryOptionRule.concat(validation.acceptOutdatedRule)),
    },
  ])({ path, option }, "Argument");
  return useSetBase(path, query, setFunction, option);
}

function useSetCollectionBase(
  path: string,
  queries: SetCollectionSchema,
  setFunction: (
    path: string,
    queries: SetCollectionSchemaObject,
    onWrite: () => void,
    onError: (error: any) => void,
    option?: {
      merge?: boolean;
      mergeFields?: string[];
    },
  ) => void,
  option?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
  },
) {
  // Arg validation
  validation.assertSetCollectionSchema(queries);
  matches([
    { key: "path", fn: validation.isString },
    {
      key: "option",
      fn: matches(validation.queryOptionRule.concat(validation.acceptOutdatedRule)),
    },
  ])({ path, option }, "Argument");
  return useSetBase(path, queries, setFunction, option);
}

// ------------------------------------------
//  Set Doc Hooks
// ------------------------------------------

export function useSetDoc(
  docPath: string,
  query: SetDocSchema,
  option?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
  },
) {
  return useSetDocBase(docPath, query, setDoc, option);
}
export function useAddDoc(
  collectionPath: string,
  query: SetDocSchema,
  option?: {
    callback?: () => void;
  },
) {
  return useSetDocBase(collectionPath, query, addDoc, option);
}
export function useUpdateDoc(
  docPath: string,
  query: SetDocSchema,
  option?: {
    callback?: () => void;
  },
) {
  return useSetDocBase(docPath, query, updateDoc, option);
}

// ------------------------------------------
//  Set Docs Hooks
// ------------------------------------------

export function useAddDocs(
  queries: { [key: string]: SetDocSchema },
  option?: {
    callback?: () => void;
  },
) {
  return useSetDocsBase(queries, addDoc, option);
}
export function useSetDocs(
  queries: { [key: string]: SetDocSchema },
  option?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
  },
) {
  return useSetDocsBase(queries, setDoc, option);
}
export function useUpdateDocs(
  queries: { [key: string]: SetDocSchema },
  option?: {
    callback?: () => void;
  },
) {
  return useSetDocsBase(queries, updateDoc, option);
}

// ------------------------------------------
//  Set Collection Hooks
// ------------------------------------------

export function useSetCollection(
  collectionPath: string,
  query: SetCollectionSchema,
  option?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
  },
) {
  return useSetCollectionBase(collectionPath, query, setCollection, option);
}
