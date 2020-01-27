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
import { getHashCode } from "./utils";
import * as validation from "./validation";
import { assertRule, matches } from "./validation";

export function generateHooksId(): HooksId {
  return Math.random()
    .toString(32)
    .substring(2);
}
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
  option?: {
    callback?: (snapshot: State) => void;
    acceptOutdated?: boolean;
  },
): [State | InitialState, boolean, any, () => void] {
  // Arg validation
  assertRule([
    { key: "path", fn: validation.isString },
    {
      key: "option",
      optional: true,
      fn: validation.matches(validation.callbackRule.concat(validation.acceptOutdatedRule)),
    },
  ])({ path, option }, "Argument");

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
        if (option?.callback !== undefined) option.callback(data);
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
  option?: {
    callback?: (snapshot: State) => void;
  },
): [State | InitialState, boolean, any, () => void] {
  // Arg validation
  assertRule([
    { key: "path", fn: validation.isString },
    {
      key: "option",
      optional: true,
      fn: matches(validation.callbackRule),
    },
  ])({ path, option }, "Argument");

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
        if (option?.callback !== undefined) option.callback(data);
      },
      err => {
        setError(err);
        setLoading(false);
      },
      () => setLoading(true),
    );
    setUnsubscribe({ fn: unsub });
  }, [path]);
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
    option?: QueryOptions,
    acceptOutdated?: boolean,
  ) => void,
  option?: {
    callback?: (data: State) => void;
    acceptOutdated?: boolean;
  } & QueryOptions,
): [State | InitialState, boolean, any, () => void] {
  // Arg validation
  assertRule([
    { key: "path", fn: validation.isString },
    {
      key: "option",
      fn: matches(
        validation.queryOptionRule.concat(validation.callbackRule, validation.acceptOutdatedRule),
      ),
    },
  ])({ path, option }, "Argument");

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
        if (option?.callback !== undefined) option.callback(data);
      },
      err => {
        setError(err);
        setLoading(false);
      },
      option,
      option?.acceptOutdated,
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
    option?: QueryOptions,
  ) => () => void,
  option?: {
    callback?: (data: State) => void;
  } & QueryOptions,
): [State | InitialState, boolean, any, () => void] {
  assertRule([
    { key: "path", fn: validation.isString },
    {
      key: "option",
      fn: matches(validation.queryOptionRule.concat(validation.acceptOutdatedRule)),
    },
  ])({ path, option }, "Argument");

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
        if (option?.callback !== undefined) option.callback(snapshot);
      },
      err => {
        setError(err);
        setLoading(false);
      },
      () => setLoading(true),
      option,
    );
    setUnsubscribe({ fn: unsub });
  }, [path, getHashCode(option)]);
  return [collection, loading, error, unsubscribe.fn];
}

// ------------------------------------------
//  Get Doc Snapshot Hooks
// ------------------------------------------

export function useLazyGetDocSnapshot(
  path: string,
  option?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
    acceptOutdated?: boolean;
  },
): [firestore.DocumentSnapshot | null, boolean, any, () => void] {
  return useLazyGetDocBase<firestore.DocumentSnapshot, null>(path, null, getDocSnapshot, option);
}

export function useGetDocSnapshot(
  path: string,
  option?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
    acceptOutdated?: boolean;
  },
): [firestore.DocumentSnapshot | null, boolean, any, () => void] {
  const [doc, loading, error, reloadDoc] = useLazyGetDocSnapshot(path, option);
  useEffect(() => reloadDoc(), [path, getHashCode(option)]);
  return [doc, loading, error, reloadDoc];
}

export function useSubscribeDocSnapshot(
  path: string,
  option?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
  },
): [firestore.DocumentSnapshot | null, boolean, any, () => void] {
  return useSubscribeDocBase(path, null, subscribeDocSnapshot, option);
}

// ------------------------------------------
//  Get Collection Snapshot Hooks
// ------------------------------------------

export function useLazyGetCollectionSnapshot(
  path: string,
  option?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
    acceptOutdated?: boolean;
  } & QueryOptions,
): [firestore.DocumentSnapshot[] | null, boolean, any, () => void] {
  return useLazyGetCollectionBase<firestore.DocumentSnapshot[], null>(
    path,
    null,
    getCollectionSnapshot,
    option,
  );
}

export function useGetCollectionSnapshot(
  path: string,
  option?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
    acceptOutdated?: boolean;
  } & QueryOptions,
): [firestore.DocumentSnapshot[] | null, boolean, any, () => void] {
  const [collection, loading, error, reloadCollection] = useLazyGetCollectionSnapshot(path, option);
  useEffect(() => reloadCollection(), [path, getHashCode(option)]);
  return [collection, loading, error, reloadCollection];
}

export function useSubscribeCollectionSnapshot(
  path: string,
  option?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
  } & QueryOptions,
): [firestore.DocumentSnapshot[] | null, boolean, any, () => void] {
  return useSubscribeCollectionBase(path, [], subscribeCollectionSnapshot, option);
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
  option?: {
    callback?: (data: DocData) => void;
    acceptOutdated?: boolean;
  },
): [DocData, boolean, any, () => void] {
  return useLazyGetDocBase(path, initialDocData, getDoc, option);
}

export function useGetDoc(
  path: string,
  option?: {
    callback?: () => void;
    acceptOutdated?: boolean;
  },
): [DocData, boolean, any, () => void] {
  const [doc, loading, error, reloadDoc] = useLazyGetDoc(path, option);
  useEffect(() => reloadDoc(), [path, getHashCode(option)]);
  return [doc, loading, error, reloadDoc];
}

export function useSubscribeDoc(
  path: string,
  option?: {
    callback?: (data: DocData) => void;
    acceptOutdated?: boolean;
  },
): [DocData, boolean, any, () => void] {
  return useSubscribeDocBase(path, initialDocData, subscribeDoc, option);
}

// ------------------------------------------
//  Get Collection Hooks
// ------------------------------------------

export function useLazyGetCollection(
  path: string,
  option?: {
    callback?: (collection: CollectionData) => void;
    acceptOutdated?: boolean;
  } & QueryOptions,
): [CollectionData, boolean, any, () => void] {
  return useLazyGetCollectionBase(path, initialCollectionData, getCollection, option);
}

export function useGetCollection(
  path: string,
  option?: {
    callback?: (collection: CollectionData) => void;
    acceptOutdated?: boolean;
  } & QueryOptions,
): [CollectionData, boolean, any, () => void] {
  const [collection, loading, error, reloadCollection] = useLazyGetCollection(path, option);
  useEffect(() => reloadCollection(), [path, getHashCode(option)]);
  return [collection, loading, error, reloadCollection];
}

export function useSubscribeCollection(
  path: string,
  option?: {
    callback?: (collection: CollectionData) => void;
  } & QueryOptions,
): [CollectionData, boolean, any, () => void] {
  return useSubscribeCollectionBase(path, initialCollectionData, subscribeCollection, option);
}
