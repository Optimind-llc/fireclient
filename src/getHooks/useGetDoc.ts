import { firestore } from "firebase";
import "firebase/firestore";
import { useEffect, useState } from "react";
import { DocData, initialDocData } from "..";
import { getDoc, getDocSnapshot } from "../getFunctions";
import * as typeCheck from "../typeCheck";
import { assertRule } from "../typeCheck";
import { getHashCode } from "../utils";

type GetDocFunction<State> = (
  path: string,
  onGet: (data: State) => void,
  onError: (err: any) => void,
  acceptOutdated?: boolean,
  saveToState?: boolean,
) => void;

function useGetDocBase<State, InitialState = State>(
  path: string,
  initialValue: State | InitialState,
  lazy: boolean,
  getFunction: GetDocFunction<State>,
  options?: {
    callback?: (snapshot: State) => void;
    acceptOutdated?: boolean;
    saveToState?: boolean;
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

  const [error, setError] = useState(null);
  const [doc, setDoc] = useState<State | InitialState>(initialValue);
  const [loading, setLoading] = useState(!lazy);

  const loadDoc = () => {
    setLoading(true);
    getFunction(
      path,
      data => {
        setDoc(data);
        setError(null);
        setLoading(false);
        if (options?.callback !== undefined) options.callback(data);
      },
      err => {
        setError(err);
        setLoading(false);
      },
    );
  };
  if (!lazy) useEffect(() => loadDoc(), [path, getHashCode(options)]);

  return [doc, loading, error, loadDoc];
}

export function useLazyGetDocSnapshot(
  path: string,
  options?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
    acceptOutdated?: boolean;
    saveToState?: boolean;
  },
): [firestore.DocumentSnapshot | null, boolean, any, () => void] {
  return useGetDocBase<firestore.DocumentSnapshot, null>(path, null, true, getDocSnapshot, options);
}

export function useGetDocSnapshot(
  path: string,
  options?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
    acceptOutdated?: boolean;
    saveToState?: boolean;
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
    acceptOutdated?: boolean;
    saveToState?: boolean;
  },
): [DocData, boolean, any, () => void] {
  return useGetDocBase(path, initialDocData, true, getDoc, options);
}

export function useGetDoc(
  path: string,
  options?: {
    callback?: (data: DocData) => void;
    acceptOutdated?: boolean;
    saveToState?: boolean;
  },
): [DocData, boolean, any, () => void] {
  return useGetDocBase(path, initialDocData, false, getDoc, options);
}
