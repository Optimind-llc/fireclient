import { useState, useCallback } from "react";
import { SetCollectionFql, StaticSetCollectionFql } from "..";
import useIsMounted from "../isMounted";
import { setCollection } from "../setFunctions";
import * as typeCheck from "../typeCheck";
import { assertStaticSetFql, matches } from "../typeCheck";
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

function useSetCollectionBase(
  path: string,
  queries: SetCollectionFql,
  setFunction: SetFunction<StaticSetCollectionFql>,
  options?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
    saveToState?: boolean;
  },
): [(...args: any) => void, boolean, boolean, any] {
  // Argument typeCheck
  typeCheck.assertSetCollectionFql(queries);
  matches([
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

  const isMounted = useIsMounted();
  const [writing, setWriting] = useState(false);
  const [called, setCalled] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // ObjectでQueryを指定していた場合Functionに変換する
  const queryGenerators = queries.map(query => (query instanceof Function ? query : () => query));

  const writeFn = useCallback(
    (...args: any[]) => {
      const queryObject = queryGenerators.map(queryGenerator => queryGenerator(...args));
      assertStaticSetFql(queryObject);
      setWriting(true);
      setCalled(true);
      setFunction(
        path,
        queryObject,
        () => {
          if (isMounted.current) {
            setError(null);
            setWriting(false);
          }
          if (options?.callback) options.callback();
        },
        err => {
          if (isMounted.current) {
            setError(err);
            setWriting(false);
          }
        },
        options,
      );
    },
    [path, getHashCode({ options, queryGenerators }), isMounted.current],
  );
  return [writeFn, writing, called, error];
}

export function useSetCollection(
  collectionPath: string,
  query: SetCollectionFql,
  options?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
    saveToState?: boolean;
  },
): [(...args: any) => void, boolean, boolean, any] {
  return useSetCollectionBase(collectionPath, query, setCollection, options);
}
