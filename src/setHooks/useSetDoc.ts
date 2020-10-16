import { firestore } from "firebase";
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
  onWrite: (docRef?: firestore.DocumentReference) => void,
  onError: (err: Error) => void,
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
    callback?: (docRef?: firestore.DocumentReference) => void;
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

  const isMounted = useIsMounted();
  const [writing, setWriting] = useState(false);
  const [called, setCalled] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // ObjectでQueryを指定していた場合Functionに変換する
  const queryGenerator = query instanceof Function ? query : () => query;

  const writeFn = useCallback(
    (...args: any[]) => {
      const queryObject = queryGenerator(...args);
      assertStaticSetFql(queryObject);
      setWriting(true);
      setCalled(true);
      setFunction(
        path,
        queryObject,
        (docRef) => {
          if (isMounted.current) {
            setError(null);
            setWriting(false);
          }
          if (options?.callback) options.callback(docRef);
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
    [path, getHashCode({ options, queryGenerator })],
  );
  return [writeFn, writing, called, error];
}

export function useSetDoc(
  docPath: string,
  query: SetFql,
  options?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: (docRef?: firestore.DocumentReference) => void;
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
