import { firestore } from "firebase";
import "firebase/firestore";
import { useEffect, useState } from "react";
import { CollectionData, initialCollectionData, QueryOptions } from "..";
import { getCollection, getCollectionSnapshot } from "../getFunctions";
import * as typeCheck from "../typeCheck";
import { assertRule, matches } from "../typeCheck";
import { getHashCode } from "../utils";

type GetCollectionFunction<State> = (
  path: string,
  onGet: (data: State) => void,
  onError: (err: any) => void,
  options?: QueryOptions,
  acceptOutdated?: boolean,
  saveToState?: boolean,
) => void;

export function useGetCollectionBase<State, InitialState = State>(
  path: string,
  initialValue: State | InitialState,
  lazy: boolean,
  getFunction: GetCollectionFunction<State>,
  options?: {
    callback?: (data: State) => void;
    acceptOutdated?: boolean;
    saveToState?: boolean;
  } & QueryOptions,
): [State | InitialState, boolean, any, () => void] {
  // Argument typeCheck
  assertRule([
    { key: "path", fn: typeCheck.isString },
    {
      key: "options",
      optional: true,
      fn: matches(
        typeCheck.concatRule(
          typeCheck.queryOptionRule,
          typeCheck.callbackRule,
          typeCheck.acceptOutdatedRule,
          typeCheck.saveToStateRule,
        ),
      ),
    },
  ])({ path, options }, "Argument");

  const [error, setError] = useState(null);
  const [collection, setCollection] = useState<State | InitialState>(initialValue);
  const [loading, setLoading] = useState(!lazy);
  const loadCollection = () => {
    setLoading(true);
    getFunction(
      path,
      data => {
        setCollection(data);
        setError(null);
        setLoading(false);
        if (options?.callback !== undefined) options.callback(data);
      },
      err => {
        setError(err);
        setLoading(false);
      },
      options,
      options?.acceptOutdated,
    );
  };
  if (!lazy) useEffect(() => loadCollection(), [path, getHashCode(options)]);

  return [collection, loading, error, loadCollection];
}

export function useLazyGetCollectionSnapshot(
  path: string,
  options?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
    acceptOutdated?: boolean;
    saveToState?: boolean;
  } & QueryOptions,
): [firestore.DocumentSnapshot[] | null, boolean, any, () => void] {
  return useGetCollectionBase<firestore.DocumentSnapshot[], null>(
    path,
    null,
    true,
    getCollectionSnapshot,
    options,
  );
}

export function useGetCollectionSnapshot(
  path: string,
  options?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
    acceptOutdated?: boolean;
    saveToState?: boolean;
  } & QueryOptions,
): [firestore.DocumentSnapshot[] | null, boolean, any, () => void] {
  return useGetCollectionBase<firestore.DocumentSnapshot[], null>(
    path,
    null,
    false,
    getCollectionSnapshot,
    options,
  );
}

export function useLazyGetCollection(
  path: string,
  options?: {
    callback?: (collection: CollectionData) => void;
    acceptOutdated?: boolean;
    saveToState?: boolean;
  } & QueryOptions,
): [CollectionData, boolean, any, () => void] {
  return useGetCollectionBase(path, initialCollectionData, true, getCollection, options);
}

export function useGetCollection(
  path: string,
  options?: {
    callback?: (collection: CollectionData) => void;
    acceptOutdated?: boolean;
    saveToState?: boolean;
  } & QueryOptions,
): [CollectionData, boolean, any, () => void] {
  return useGetCollectionBase(path, initialCollectionData, false, getCollection, options);
}
