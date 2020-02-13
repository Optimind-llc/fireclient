import { useState } from "react";
import { SetFql, StaticSetFql } from "..";
import { setDoc, updateDoc } from "../setFunctions";
import * as typeCheck from "../typeCheck";
import { assertRule, assertStaticSetFql, matches } from "../typeCheck";

type SetFunction<Fql> = (
  path: string,
  query: Fql,
  onWrite: () => void,
  onError: (error: any) => void,
  options?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
    saveToState?: boolean;
  },
) => void;

function useSetDocBase(
  path: string,
  query: SetFql,
  setFunction: SetFunction<StaticSetFql>,
  options?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
    saveToState?: boolean;
  },
): [(...args: any) => void, boolean, boolean, any] {
  // Argument typeCheck
  typeCheck.assertSetFql(query);
  assertRule([
    { key: "path", fn: typeCheck.isString },
    {
      key: "options",
      optional: true,
      fn: matches(
        typeCheck.concatRule(
          typeCheck.mergeRule,
          typeCheck.callbackRule,
          typeCheck.saveToStateRule,
        ),
      ),
    },
  ])({ path, options }, "Argument");

  const [writing, setWriting] = useState(false);
  const [called, setCalled] = useState(false);
  const [error, setError] = useState(null);

  // ObjectでQueryを指定していた場合Functionに変換する
  const queryGenerator = query instanceof Function ? query : () => query;

  const writeFn = (...args: any[]) => {
    const queryObject = queryGenerator(...args);
    assertStaticSetFql(queryObject);
    setWriting(true);
    setCalled(true);
    setFunction(
      path,
      queryObject,
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

export function useSetDoc(
  docPath: string,
  query: SetFql,
  options?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
    saveToState?: boolean;
  },
): [(...args: any) => void, boolean, boolean, any] {
  return useSetDocBase(docPath, query, setDoc, options);
}

export function useUpdateDoc(
  docPath: string,
  query: SetFql,
  options?: {
    callback?: () => void;
    saveToState?: boolean;
  },
): [(...args: any) => void, boolean, boolean, any] {
  return useSetDocBase(docPath, query, updateDoc, options);
}
