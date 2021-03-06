import { useState, useCallback } from "react";
import { SetFql, StaticSetFql } from "..";
import useIsMounted from "../isMounted";
import { setDoc, updateDoc } from "../setFunctions";
import * as typeCheck from "../typeCheck";
import { assertRule, assertStaticSetFql, matches } from "../typeCheck";
import { getHashCode } from "../utils";

type SetFunction<Fql> = (
  path: string,
  query: Fql,
  onWrite: () => void,
  onError: (err: Error) => void,
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

  const isMounted = useIsMounted();
  const [writing, setWriting] = useState(false);
  const [called, setCalled] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const queryEntries = Object.entries(queries);

  const writeFn = useCallback(
    (...args: any[]) => {
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
          if (isMounted.current) {
            setError(null);
            setWriting(false);
          }
          if (options?.callback) options.callback();
        })
        .catch(err => {
          if (isMounted.current) {
            setError(err);
            setWriting(false);
          }
        });
    },
    [getHashCode({ queries, options })],
  );
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
