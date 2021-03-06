import { firestore } from "firebase";
import { useEffect, useState, useCallback } from "react";
import { DocData, initialDocData } from "..";
import { getDoc, getDocSnapshot } from "../getFunctions";
import useIsMounted from "../isMounted";
import * as typeCheck from "../typeCheck";
import { assertRule } from "../typeCheck";
import { getHashCode } from "../utils";

type GetDocFunction<State> = (
  path: string,
  onGet: (data: State) => void,
  onError: (err: Error) => void,
  saveToState?: boolean,
  acceptOutdated?: boolean,
) => void;

function useGetDocBase<State, InitialState = State>(
  path: string,
  initialValue: State | InitialState,
  lazy: boolean,
  getFunction: GetDocFunction<State>,
  options?: {
    callback?: (snapshot: State) => void;
    saveToState?: boolean;
    acceptOutdated?: boolean;
  },
): [State | InitialState, boolean, any, () => void] {
  // Argument typeCheck
  assertRule([
    { key: "path", fn: typeCheck.isString },
    {
      key: "options",
      optional: true,
      fn: typeCheck.matches(
        typeCheck.concatRule(
          typeCheck.callbackRule,
          typeCheck.acceptOutdatedRule,
          typeCheck.saveToStateRule,
        ),
      ),
    },
  ])({ path, options }, "Argument");

  const isMounted = useIsMounted();
  const [error, setError] = useState<Error | null>(null);
  const [doc, setDoc] = useState<State | InitialState>(initialValue);
  const [loading, setLoading] = useState(!lazy);

  const optionsHash = getHashCode(options);

  const loadDoc = useCallback(() => {
    setLoading(true);
    getFunction(
      path,
      data => {
        if (isMounted.current) {
          setDoc(data);
          setError(null);
          setLoading(false);
        }
        if (options?.callback) options.callback(data);
      },
      err => {
        if (isMounted.current) {
          setError(err);
          setLoading(false);
        }
      },
      options?.saveToState,
      options?.acceptOutdated,
    );
  }, [path, optionsHash, isMounted.current]);
  // Automatically excecute loadDoc() if lazy
  useEffect(() => {
    if (!lazy) loadDoc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, optionsHash]);

  return [doc, loading, error, loadDoc];
}

export function useLazyGetDocSnapshot(
  path: string,
  options?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
    saveToState?: boolean;
    acceptOutdated?: boolean;
  },
): [firestore.DocumentSnapshot | null, boolean, any, () => void] {
  return useGetDocBase<firestore.DocumentSnapshot, null>(path, null, true, getDocSnapshot, options);
}

export function useGetDocSnapshot(
  path: string,
  options?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
    saveToState?: boolean;
    acceptOutdated?: boolean;
  },
): [firestore.DocumentSnapshot | null, boolean, any, () => void] {
  return useGetDocBase<firestore.DocumentSnapshot, null>(
    path,
    null,
    false,
    getDocSnapshot,
    options,
  );
}

export function useLazyGetDoc(
  path: string,
  options?: {
    callback?: (data: DocData) => void;
    saveToState?: boolean;
    acceptOutdated?: boolean;
  },
): [DocData, boolean, any, () => void] {
  return useGetDocBase(path, initialDocData, true, getDoc, options);
}

export function useGetDoc(
  path: string,
  options?: {
    callback?: (data: DocData) => void;
    saveToState?: boolean;
    acceptOutdated?: boolean;
  },
): [DocData, boolean, any, () => void] {
  return useGetDocBase(path, initialDocData, false, getDoc, options);
}
