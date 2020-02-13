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

function useSetDocsBase(
  queries: { [key: string]: SetFql },
  setFunction: SetFunction<StaticSetFql>,
  options?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
    saveToState?: boolean;
  },
): [(...args: any) => void, boolean, boolean, any] {
  // Argument typeCheck
  assertRule([
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
  ])({ options }, "Argument");
  typeCheck.assertSetDocsFql(queries);

  const [writing, setWriting] = useState(false);
  const [called, setCalled] = useState(false);
  const [error, setError] = useState(null);

  const queryEntries = Object.entries(queries);

  const writeFn = (...args: any[]) => {
    setWriting(true);
    setCalled(true);

    Promise.all(
      queryEntries.map(
        ([path, query]) =>
          new Promise((resolve, reject) => {
            const queryGenerator = query instanceof Function ? query : () => query;
            const queryObject = queryGenerator(...args);
            assertStaticSetFql(queryObject);
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

export function useSetDocs(
  queries: { [key: string]: SetFql },
  options?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
    saveToState?: boolean;
  },
): [(...args: any) => void, boolean, boolean, any] {
  return useSetDocsBase(queries, setDoc, options);
}
export function useUpdateDocs(
  queries: { [key: string]: SetFql },
  options?: {
    callback?: () => void;
    saveToState?: boolean;
  },
): [(...args: any) => void, boolean, boolean, any] {
  return useSetDocsBase(queries, updateDoc, options);
}
