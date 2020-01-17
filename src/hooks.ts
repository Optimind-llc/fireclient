import { useState, useEffect } from "react";
import "firebase/firestore";
import { firestore } from "firebase";

import {
  FireclientDoc,
  QueryOption,
  HooksId,
  createDataFromDoc,
  createDataFromCollection
} from ".";
import {
  getHashCode,
  getDoc,
  getCollection,
  subscribeDoc,
  subscribeCollection
} from "./fetchFunctions";
import {
  assertQueryOption,
  assertPath,
  assertCallbackOption,
  assertAcceptOutdatedOption
} from "./validation";

export function generateHooksId(): HooksId {
  return Math.random()
    .toString(32)
    .substring(2);
}

// ----------
//  Snapshot
// ----------

export function useLazyGetDocSnapshot(
  path: string,
  option?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
    acceptOutdated?: boolean;
  }
): [firestore.DocumentSnapshot | null, boolean, any, () => void] {
  assertPath(path);
  assertCallbackOption(option);
  assertAcceptOutdatedOption(option);
  const [error, setError] = useState(null);
  const [doc, setDoc] = useState<firestore.DocumentSnapshot | null>(null);
  const [loading, setLoading] = useState(false);

  const loadDoc = () => {
    setLoading(true);
    getDoc(
      path,
      snapshot => {
        setDoc(snapshot);
        setLoading(false);
        if (option?.callback !== undefined) option.callback(snapshot);
      },
      err => {
        setError(err);
        setLoading(false);
      },
      option?.acceptOutdated
    );
  };
  return [doc, loading, error, loadDoc];
}

export function useGetDocSnapshot(
  path: string,
  option?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
    acceptOutdated?: boolean;
  }
): [firestore.DocumentSnapshot | null, boolean, any, () => void] {
  const [doc, loading, error, reloadDoc] = useLazyGetDocSnapshot(path, option);
  useEffect(() => {
    reloadDoc();
  }, [path]);
  return [doc, loading, error, reloadDoc];
}

export function useSubscribeDocSnapshot(
  path: string,
  option?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
  }
): [firestore.DocumentSnapshot | null, boolean, any, () => void] {
  assertPath(path);
  assertCallbackOption(option);
  const [hooksId] = useState(generateHooksId());
  const [error, setError] = useState(null);
  const [doc, setDoc] = useState<firestore.DocumentSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [unsubscribe, setUnsubscribe] = useState<{
    fn: () => void;
  }>({ fn: () => {} });

  useEffect(() => {
    const unsub = subscribeDoc(
      hooksId,
      path,
      snapshot => {
        setDoc(snapshot);
        setLoading(false);
        if (option?.callback !== undefined) option.callback(snapshot);
      },
      err => {
        setError(err);
        setLoading(false);
      },
      () => setLoading(true)
    );
    setUnsubscribe({ fn: unsub });
  }, [path]);
  return [doc, loading, error, unsubscribe.fn];
}

export function useLazyGetCollectionSnapshot(
  path: string,
  option?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
    acceptOutdated?: boolean;
  } & QueryOption
): [firestore.DocumentSnapshot[] | null, boolean, any, () => void] {
  assertPath(path);
  assertQueryOption(option);
  assertCallbackOption(option);
  assertAcceptOutdatedOption(option);
  const [error, setError] = useState(null);
  const [collection, setCollection] = useState<
    firestore.DocumentSnapshot[] | null
  >(null);
  const [loading, setLoading] = useState(false);

  const loadCollection = () => {
    setLoading(true);
    getCollection(
      path,
      option,
      (snapshot: firestore.DocumentSnapshot[]) => {
        setCollection(snapshot);
        setLoading(false);
        if (option?.callback !== undefined) option.callback(snapshot);
      },
      (err: any) => {
        setError(err);
        setLoading(false);
      },
      option?.acceptOutdated
    );
  };
  return [collection, loading, error, loadCollection];
}

export function useGetCollectionSnapshot(
  path: string,
  option?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
    acceptOutdated?: boolean;
  } & QueryOption
): [firestore.DocumentSnapshot[] | null, boolean, any, () => void] {
  const [
    collection,
    loading,
    error,
    reloadCollection
  ] = useLazyGetCollectionSnapshot(path, option);
  useEffect(() => {
    reloadCollection();
  }, [path, getHashCode(option)]);
  return [collection, loading, error, reloadCollection];
}

export function useSubscribeCollectionSnapshot(
  path: string,
  option?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
  } & QueryOption
): [firestore.DocumentSnapshot[] | null, boolean, any, () => void] {
  assertPath(path);
  assertQueryOption(option);
  assertCallbackOption(option);
  assertAcceptOutdatedOption(option);
  const [hooksId] = useState(generateHooksId());
  const [error, setError] = useState(null);
  const [collection, setCollection] = useState<firestore.DocumentSnapshot[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [unsubscribe, setUnsubscribe] = useState<{
    fn: () => void;
  }>({ fn: () => {} });
  useEffect(() => {
    const unsub = subscribeCollection(
      hooksId,
      path,
      option,
      snapshot => {
        setCollection(snapshot);
        setLoading(false);
        if (option?.callback !== undefined) option.callback(snapshot);
      },
      err => {
        setError(err);
        setLoading(false);
      },
      () => setLoading(true)
    );
    setUnsubscribe({ fn: unsub });
  }, [path, getHashCode(option)]);
  return [collection, loading, error, unsubscribe.fn];
}

// ----------
//  Data
// ----------

export const initialDocData: FireclientDoc = {
  data: null,
  id: null
};
export const initialCollectionData: FireclientDoc[] = [];

function convertDocCallback(option?: {
  callback?: (data: FireclientDoc) => void;
  acceptOutdated?: boolean;
}) {
  return option?.callback !== undefined
    ? {
        ...option,
        callback: (snapshot: firestore.DocumentSnapshot) =>
          option.callback!(createDataFromDoc(snapshot))
      }
    : option;
}
function convertCollectionCallback(option?: {
  callback?: (data: FireclientDoc[]) => void;
  acceptOutdated?: boolean;
}) {
  return option?.callback !== undefined
    ? {
        ...option,
        callback: (snapshot: firestore.DocumentSnapshot[]) =>
          option.callback!(createDataFromCollection(snapshot))
      }
    : option;
}
export function useLazyGetDoc(
  path: string,
  option?: {
    callback?: (data: FireclientDoc) => void;
    acceptOutdated?: boolean;
  }
): [FireclientDoc, boolean, any, () => void] {
  const [doc, loading, error, loadDoc] = useLazyGetDocSnapshot(
    path,
    convertDocCallback(option)
  );
  return [
    doc !== null ? createDataFromDoc(doc) : initialDocData,
    loading,
    error,
    loadDoc
  ];
}

export function useGetDoc(
  path: string,
  option?: {
    callback?: () => void;
    acceptOutdated?: boolean;
  }
): [FireclientDoc, boolean, any, () => void] {
  const [doc, loading, error, reloadDoc] = useGetDocSnapshot(
    path,
    convertDocCallback(option)
  );
  return [
    doc !== null ? createDataFromDoc(doc) : initialDocData,
    loading,
    error,
    reloadDoc
  ];
}

export function useSubscribeDoc(
  path: string,
  option?: {
    callback?: () => void;
    acceptOutdated?: boolean;
  }
): [FireclientDoc, boolean, any, () => void] {
  const [doc, loading, error, unsubscribe] = useSubscribeDocSnapshot(
    path,
    convertDocCallback(option)
  );
  return [
    doc !== null ? createDataFromDoc(doc) : initialDocData,
    loading,
    error,
    unsubscribe
  ];
}

export function useLazyGetCollection(
  path: string,
  option?: {
    callback?: () => void;
    acceptOutdated?: boolean;
  } & QueryOption
): [FireclientDoc[], boolean, any, () => void] {
  const [
    collection,
    loading,
    error,
    loadCollection
  ] = useLazyGetCollectionSnapshot(path, convertCollectionCallback(option));
  return [
    collection !== null
      ? createDataFromCollection(collection)
      : initialCollectionData,
    loading,
    error,
    loadCollection
  ];
}

export function useGetCollection(
  path: string,
  option?: {
    callback?: () => void;
    acceptOutdated?: boolean;
  } & QueryOption
): [FireclientDoc[], boolean, any, () => void] {
  const [
    collection,
    loading,
    error,
    reloadCollection
  ] = useGetCollectionSnapshot(path, convertCollectionCallback(option));
  return [
    collection !== null
      ? createDataFromCollection(collection)
      : initialCollectionData,
    loading,
    error,
    reloadCollection
  ];
}

export function useSubscribeCollection(
  path: string,
  option?: {
    callback?: () => void;
    acceptOutdated?: boolean;
  } & QueryOption
): [FireclientDoc[], boolean, any, () => void] {
  const [
    collection,
    loading,
    error,
    unsubscribe
  ] = useSubscribeCollectionSnapshot(path, convertCollectionCallback(option));
  return [
    collection !== null
      ? createDataFromCollection(collection)
      : initialCollectionData,
    loading,
    error,
    unsubscribe
  ];
}
