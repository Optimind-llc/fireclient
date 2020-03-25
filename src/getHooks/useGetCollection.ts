import useIsMounted from "ismounted";
import { firestore } from "firebase";
import { useEffect, useState } from "react";
import { CollectionData, initialCollectionData, QueryOptions } from "..";
import { getCollection, getCollectionSnapshot } from "../getFunctions";
import * as typeCheck from "../typeCheck";
import { assertRule, matches } from "../typeCheck";
import { getHashCode } from "../utils";

type GetCollectionFunction<State> = (
  path: string,
  onGet: (data: State) => void,
  onError: (err: Error) => void,
  options?: QueryOptions,
  saveToState?: boolean,
  acceptOutdated?: boolean,
) => void;

export function useGetCollectionBase<State, InitialState = State>(
  path: string,
  initialValue: State | InitialState,
  lazy: boolean,
  getFunction: GetCollectionFunction<State>,
  options?: {
    callback?: (data: State) => void;
    saveToState?: boolean;
    acceptOutdated?: boolean;
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

  const isMounted = useIsMounted();
  const [error, setError] = useState<Error | null>(null);
  const [collection, setCollection] = useState<State | InitialState>(initialValue);
  const [loading, setLoading] = useState(!lazy);
  const loadCollection = () => {
    setLoading(true);
    getFunction(
      path,
      data => {
        if (isMounted.current) {
          setCollection(data);
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
      options,
      options?.saveToState,
      options?.acceptOutdated,
    );
  };
  // Automatically excecute loadCollection() if lazy\
  useEffect(() => {
    if (!lazy) loadCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, getHashCode(options)]);

  return [collection, loading, error, loadCollection];
}

export function useLazyGetCollectionSnapshot(
  path: string,
  options?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
    saveToState?: boolean;
    acceptOutdated?: boolean;
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
    saveToState?: boolean;
    acceptOutdated?: boolean;
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
    saveToState?: boolean;
    acceptOutdated?: boolean;
  } & QueryOptions,
): [CollectionData, boolean, any, () => void] {
  return useGetCollectionBase(path, initialCollectionData, true, getCollection, options);
}

export function useGetCollection(
  path: string,
  options?: {
    callback?: (collection: CollectionData) => void;
    saveToState?: boolean;
    acceptOutdated?: boolean;
  } & QueryOptions,
): [CollectionData, boolean, any, () => void] {
  return useGetCollectionBase(path, initialCollectionData, false, getCollection, options);
}
