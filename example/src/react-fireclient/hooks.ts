import { firestore } from "firebase";
import "firebase/firestore";
import { useEffect, useState } from "react";
import {
  CollectionData,
  DocData,
  HooksId,
  QueryOption,
  SetCollectionQuery,
  SetCollectionQueryObject,
  SetDocQuery,
  SetDocQueryObject,
} from ".";
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
import { addDoc, setCollection, setDoc, updateDoc } from "./setFunctions";
import { getHashCode } from "./utils";
import {
  assertAcceptOutdatedOption,
  assertCallbackOption,
  assertPath,
  assertQueryOption,
} from "./validation";

export function generateHooksId(): HooksId {
  return Math.random()
    .toString(32)
    .substring(2);
}
// ------------------------------------------
//  Get Base
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
  assertPath(path);
  assertCallbackOption(option);
  assertAcceptOutdatedOption(option);

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
  assertPath(path);
  assertCallbackOption(option);

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

export function useLazyGetCollectionBase<State, InitialState = State>(
  path: string,
  initialValue: State | InitialState,
  getFunction: (
    path: string,
    onGet: (data: State) => void,
    onError: (err: any) => void,
    option?: QueryOption,
    acceptOutdated?: boolean,
  ) => void,
  option?: {
    callback?: (data: State) => void;
    acceptOutdated?: boolean;
  } & QueryOption,
): [State | InitialState, boolean, any, () => void] {
  assertPath(path);
  assertQueryOption(option);
  assertCallbackOption(option);
  assertAcceptOutdatedOption(option);

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
    option?: QueryOption,
  ) => () => void,
  option?: {
    callback?: (data: State) => void;
  } & QueryOption,
): [State | InitialState, boolean, any, () => void] {
  assertPath(path);
  assertQueryOption(option);
  assertCallbackOption(option);

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
//  Get Snapshot
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

export function useLazyGetCollectionSnapshot(
  path: string,
  option?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
    acceptOutdated?: boolean;
  } & QueryOption,
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
  } & QueryOption,
): [firestore.DocumentSnapshot[] | null, boolean, any, () => void] {
  const [collection, loading, error, reloadCollection] = useLazyGetCollectionSnapshot(path, option);
  useEffect(() => reloadCollection(), [path, getHashCode(option)]);
  return [collection, loading, error, reloadCollection];
}

export function useSubscribeCollectionSnapshot(
  path: string,
  option?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
  } & QueryOption,
): [firestore.DocumentSnapshot[] | null, boolean, any, () => void] {
  return useSubscribeCollectionBase(path, [], subscribeCollectionSnapshot, option);
}

// ------------------------------------------
//  Get Data
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

export function useLazyGetCollection(
  path: string,
  option?: {
    callback?: (collection: CollectionData) => void;
    acceptOutdated?: boolean;
  } & QueryOption,
): [CollectionData, boolean, any, () => void] {
  return useLazyGetCollectionBase(path, initialCollectionData, getCollection, option);
}

export function useGetCollection(
  path: string,
  option?: {
    callback?: (collection: CollectionData) => void;
    acceptOutdated?: boolean;
  } & QueryOption,
): [CollectionData, boolean, any, () => void] {
  const [collection, loading, error, reloadCollection] = useLazyGetCollection(path, option);
  useEffect(() => reloadCollection(), [path, getHashCode(option)]);
  return [collection, loading, error, reloadCollection];
}

export function useSubscribeCollection(
  path: string,
  option?: {
    callback?: (collection: CollectionData) => void;
  } & QueryOption,
): [CollectionData, boolean, any, () => void] {
  return useSubscribeCollectionBase(path, initialCollectionData, subscribeCollection, option);
}

// ------------------------------------------
//  Set Base
// ------------------------------------------

function useSetDocBase(
  path: string,
  query: SetDocQuery,
  setFunction: (
    path: string,
    query: SetDocQueryObject,
    onWrite: () => void,
    onError: (error: any) => void,
    option?: {
      merge?: boolean;
      mergeFields?: string[];
      callback?: () => void;
    },
  ) => void,
  option?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
  },
) {
  const [writing, setWriting] = useState(false);
  const [called, setCalled] = useState(false);
  const [error, setError] = useState(null);

  // ObjectでQueryを指定していた場合Functionに変換する
  const queryGenerator = query instanceof Function ? query : () => query;

  const writeFn = (...args: any) => {
    setWriting(true);
    setCalled(true);
    setFunction(
      path,
      queryGenerator(...args),
      () => {
        setError(null);
        setWriting(false);
        if (option?.callback !== undefined) option.callback();
      },
      err => {
        setError(err);
        setWriting(false);
      },
      option,
    );
  };
  return [writeFn, writing, called, error];
}

function useSetCollectionBase(
  path: string,
  queries: SetCollectionQuery,
  setFunction: (
    path: string,
    queries: SetCollectionQueryObject,
    onWrite: () => void,
    onError: (error: any) => void,
    option?: {
      merge?: boolean;
      mergeFields?: string[];
    },
  ) => void,
  option?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
  },
) {
  const [writing, setWriting] = useState(false);
  const [called, setCalled] = useState(false);
  const [error, setError] = useState(null);

  // ObjectでQueryを指定していた場合Functionに変換する
  const queryGenerator = queries instanceof Function ? queries : () => queries;

  const writeFn = (...args: any) => {
    setWriting(true);
    setCalled(true);
    setFunction(
      path,
      queryGenerator(...args),
      () => {
        setError(null);
        setWriting(false);
        if (option?.callback !== undefined) option.callback();
      },
      err => {
        setError(err);
        setWriting(false);
      },
      option,
    );
  };
  return [writeFn, writing, called, error];
}

// ------------------------------------------
//  Set Data
// ------------------------------------------

export function useSetDoc(
  path: string,
  query: SetDocQuery,
  option?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
  },
) {
  return useSetDocBase(path, query, setDoc, option);
}

export function useAddDoc(
  path: string,
  query: SetDocQuery,
  option?: {
    callback?: () => void;
  },
) {
  return useSetDocBase(path, query, addDoc, option);
}

export function useUpdateDoc(
  path: string,
  query: SetDocQuery,
  option?: {
    callback?: () => void;
  },
) {
  return useSetDocBase(path, query, updateDoc, option);
}

export function useSetCollection(
  path: string,
  query: SetCollectionQuery,
  option?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
  },
) {
  return useSetCollectionBase(path, query, setCollection, option);
}
