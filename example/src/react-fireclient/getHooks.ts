import { firestore } from "firebase";
import "firebase/firestore";
import { useEffect, useState } from "react";
import { CollectionData, DocData, HooksId, QueryOptions } from ".";
import {
  getCollection,
  getCollectionSnapshot,
  getDoc,
  getDocSnapshot,
  subscribeCollection,
  subscribeCollectionSnapshot,
  subscribeDoc,
  subscribeDocSnapshot,
} from "./getFunctions";
import { getHashCode, generateHooksId } from "./utils";
import * as typeCheck from "./typeCheck";
import { assertRule, matches } from "./typeCheck";

// ------------------------------------------
//  Get Doc Hooks Base
// ------------------------------------------

function useLazyGetDocBase<State, InitialState = State>(
  path: string,
  initialValue: State | InitialState,
  getFunction: (
    path: string,
    onGet: (data: State) => void,
    onError: (err: any) => void,
    acceptOutdated?: boolean,
  ) => void,
  options?: {
    callback?: (snapshot: State) => void;
    acceptOutdated?: boolean;
  },
): [State | InitialState, boolean, any, () => void] {
  // Arg typeCheck
  assertRule([
    { key: "path", fn: typeCheck.isString },
    {
      key: "options",
      optional: true,
      fn: typeCheck.matches(typeCheck.callbackRule.concat(typeCheck.acceptOutdatedRule)),
    },
  ])({ path, options }, "Argument");

  const [error, setError] = useState(null);
  const [doc, setDoc] = useState<State | InitialState>(initialValue);
  const [loading, setLoading] = useState(false);

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
  return [doc, loading, error, loadDoc];
}

export function useSubscribeDocBase<State, InitialState = State>(
  path: string,
  initialValue: State | InitialState,
  subscribeFunction: (
    hooksId: HooksId,
    path: string,
    onChange: (doc: State) => void,
    onError: (err: any) => void,
    onListen?: () => void,
  ) => () => void,
  options?: {
    callback?: (snapshot: State) => void;
  },
): [State | InitialState, boolean, any, () => void] {
  // Arg typeCheck
  assertRule([
    { key: "path", fn: typeCheck.isString },
    {
      key: "options",
      optional: true,
      fn: matches(typeCheck.callbackRule),
    },
  ])({ path, options }, "Argument");

  const [hooksId] = useState(generateHooksId());
  const [error, setError] = useState(null);
  const [doc, setDoc] = useState<State | InitialState>(initialValue);
  const [loading, setLoading] = useState(false);
  const [unsubscribe, setUnsubscribe] = useState<{
    fn: () => void;
  }>({ fn: () => {} });

  useEffect(() => {
    const unsub = subscribeFunction(
      hooksId,
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
      () => setLoading(true),
    );
    setUnsubscribe({ fn: unsub });
    // subscribeFunctionを除去
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, hooksId, getHashCode(options)]);
  return [doc, loading, error, unsubscribe.fn];
}

// ------------------------------------------
//  Get Collection Hooks Base
// ------------------------------------------

export function useLazyGetCollectionBase<State, InitialState = State>(
  path: string,
  initialValue: State | InitialState,
  getFunction: (
    path: string,
    onGet: (data: State) => void,
    onError: (err: any) => void,
    options?: QueryOptions,
    acceptOutdated?: boolean,
  ) => void,
  options?: {
    callback?: (data: State) => void;
    acceptOutdated?: boolean;
  } & QueryOptions,
): [State | InitialState, boolean, any, () => void] {
  // Arg typeCheck
  assertRule([
    { key: "path", fn: typeCheck.isString },
    {
      key: "options",
      optional: true,
      fn: matches(
        typeCheck.queryOptionRule.concat(typeCheck.callbackRule, typeCheck.acceptOutdatedRule),
      ),
    },
  ])({ path, options }, "Argument");

  const [error, setError] = useState(null);
  const [collection, setCollection] = useState<State | InitialState>(initialValue);
  const [loading, setLoading] = useState(false);
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
  return [collection, loading, error, loadCollection];
}

export function useSubscribeCollectionBase<State, InitialState = State>(
  path: string,
  initialValue: State | InitialState,
  subscribeFunction: (
    hooksId: HooksId,
    path: string,
    onChange: (doc: State) => void,
    onError: (err: any) => void,
    onListen?: () => void,
    options?: QueryOptions,
  ) => () => void,
  options?: {
    callback?: (data: State) => void;
  } & QueryOptions,
): [State | InitialState, boolean, any, () => void] {
  assertRule([
    { key: "path", fn: typeCheck.isString },
    {
      key: "options",
      fn: matches(typeCheck.queryOptionRule.concat(typeCheck.callbackRule)),
    },
  ])({ path, options }, "Argument");

  const [hooksId] = useState(generateHooksId());
  const [error, setError] = useState(null);
  const [collection, setCollection] = useState<State | InitialState>(initialValue);
  const [loading, setLoading] = useState(false);
  const [unsubscribe, setUnsubscribe] = useState<{
    fn: () => void;
  }>({ fn: () => {} });

  useEffect(() => {
    const unsub = subscribeFunction(
      hooksId,
      path,
      snapshot => {
        setCollection(snapshot);
        setError(null);
        setLoading(false);
        if (options?.callback !== undefined) options.callback(snapshot);
      },
      err => {
        setError(err);
        setLoading(false);
      },
      () => setLoading(true),
      options,
    );
    setUnsubscribe({ fn: unsub });
    // subscribeFunctionを除去
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, hooksId, getHashCode(options)]);
  return [collection, loading, error, unsubscribe.fn];
}

// ------------------------------------------
//  Get Doc Snapshot Hooks
// ------------------------------------------

export function useLazyGetDocSnapshot(
  path: string,
  options?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
    acceptOutdated?: boolean;
  },
): [firestore.DocumentSnapshot | null, boolean, any, () => void] {
  return useLazyGetDocBase<firestore.DocumentSnapshot, null>(path, null, getDocSnapshot, options);
}

export function useGetDocSnapshot(
  path: string,
  options?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
    acceptOutdated?: boolean;
  },
): [firestore.DocumentSnapshot | null, boolean, any, () => void] {
  const [doc, loading, error, reloadDoc] = useLazyGetDocSnapshot(path, options);
  // reloadDocを除去
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => reloadDoc(), [path, getHashCode(options)]);
  return [doc, loading, error, reloadDoc];
}

export function useSubscribeDocSnapshot(
  path: string,
  options?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
  },
): [firestore.DocumentSnapshot | null, boolean, any, () => void] {
  return useSubscribeDocBase(path, null, subscribeDocSnapshot, options);
}

// ------------------------------------------
//  Get Collection Snapshot Hooks
// ------------------------------------------

export function useLazyGetCollectionSnapshot(
  path: string,
  options?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
    acceptOutdated?: boolean;
  } & QueryOptions,
): [firestore.DocumentSnapshot[] | null, boolean, any, () => void] {
  return useLazyGetCollectionBase<firestore.DocumentSnapshot[], null>(
    path,
    null,
    getCollectionSnapshot,
    options,
  );
}

export function useGetCollectionSnapshot(
  path: string,
  options?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
    acceptOutdated?: boolean;
  } & QueryOptions,
): [firestore.DocumentSnapshot[] | null, boolean, any, () => void] {
  const [collection, loading, error, reloadCollection] = useLazyGetCollectionSnapshot(
    path,
    options,
  );
  // reloadCollectionを除去
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => reloadCollection(), [path, getHashCode(options)]);
  return [collection, loading, error, reloadCollection];
}

export function useSubscribeCollectionSnapshot(
  path: string,
  options?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
  } & QueryOptions,
): [firestore.DocumentSnapshot[] | null, boolean, any, () => void] {
  return useSubscribeCollectionBase(path, [], subscribeCollectionSnapshot, options);
}

// ------------------------------------------
//  Get Doc Hooks
// ------------------------------------------

export const initialDocData: DocData = {
  data: null,
  id: null,
};
export const initialCollectionData: CollectionData = [];

export function useLazyGetDoc(
  path: string,
  options?: {
    callback?: (data: DocData) => void;
    acceptOutdated?: boolean;
  },
): [DocData, boolean, any, () => void] {
  return useLazyGetDocBase(path, initialDocData, getDoc, options);
}

export function useGetDoc(
  path: string,
  options?: {
    callback?: (data: DocData) => void;
    acceptOutdated?: boolean;
  },
): [DocData, boolean, any, () => void] {
  const [doc, loading, error, reloadDoc] = useLazyGetDoc(path, options);
  // reloadDocを除去
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => reloadDoc(), [path, getHashCode(options)]);
  return [doc, loading, error, reloadDoc];
}

export function useSubscribeDoc(
  path: string,
  options?: {
    callback?: (data: DocData) => void;
    acceptOutdated?: boolean;
  },
): [DocData, boolean, any, () => void] {
  return useSubscribeDocBase(path, initialDocData, subscribeDoc, options);
}

// ------------------------------------------
//  Get Collection Hooks
// ------------------------------------------

export function useLazyGetCollection(
  path: string,
  options?: {
    callback?: (collection: CollectionData) => void;
    acceptOutdated?: boolean;
  } & QueryOptions,
): [CollectionData, boolean, any, () => void] {
  return useLazyGetCollectionBase(path, initialCollectionData, getCollection, options);
}

export function useGetCollection(
  path: string,
  options?: {
    callback?: (collection: CollectionData) => void;
    acceptOutdated?: boolean;
  } & QueryOptions,
): [CollectionData, boolean, any, () => void] {
  const [collection, loading, error, reloadCollection] = useLazyGetCollection(path, options);
  // reloadCollectionを除去
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => reloadCollection(), [path, getHashCode(options)]);
  return [collection, loading, error, reloadCollection];
}

export function useSubscribeCollection(
  path: string,
  options?: {
    callback?: (collection: CollectionData) => void;
  } & QueryOptions,
): [CollectionData, boolean, any, () => void] {
  return useSubscribeCollectionBase(path, initialCollectionData, subscribeCollection, options);
}
