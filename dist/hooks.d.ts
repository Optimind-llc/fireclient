import { firestore } from "firebase";
import "firebase/firestore";
import { CollectionData, DocData, HooksId, QueryOptions, SetFql } from ".";
export declare function generateHooksId(): HooksId;
export declare function useSubscribeDocBase<State, InitialState = State>(
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
): [State | InitialState, boolean, any, () => void];
export declare function useLazyGetCollectionBase<State, InitialState = State>(
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
): [State | InitialState, boolean, any, () => void];
export declare function useSubscribeCollectionBase<State, InitialState = State>(
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
): [State | InitialState, boolean, any, () => void];
export declare function useLazyGetDocSnapshot(
  path: string,
  option?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
    acceptOutdated?: boolean;
  },
): [firestore.DocumentSnapshot | null, boolean, any, () => void];
export declare function useGetDocSnapshot(
  path: string,
  option?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
    acceptOutdated?: boolean;
  },
): [firestore.DocumentSnapshot | null, boolean, any, () => void];
export declare function useSubscribeDocSnapshot(
  path: string,
  option?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
  },
): [firestore.DocumentSnapshot | null, boolean, any, () => void];
export declare function useLazyGetCollectionSnapshot(
  path: string,
  option?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
    acceptOutdated?: boolean;
  } & QueryOptions,
): [firestore.DocumentSnapshot[] | null, boolean, any, () => void];
export declare function useGetCollectionSnapshot(
  path: string,
  option?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
    acceptOutdated?: boolean;
  } & QueryOptions,
): [firestore.DocumentSnapshot[] | null, boolean, any, () => void];
export declare function useSubscribeCollectionSnapshot(
  path: string,
  option?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
  } & QueryOptions,
): [firestore.DocumentSnapshot[] | null, boolean, any, () => void];
export declare const initialDocData: DocData;
export declare const initialCollectionData: CollectionData;
export declare function useLazyGetDoc(
  path: string,
  option?: {
    callback?: (data: DocData) => void;
    acceptOutdated?: boolean;
  },
): [DocData, boolean, any, () => void];
export declare function useGetDoc(
  path: string,
  option?: {
    callback?: () => void;
    acceptOutdated?: boolean;
  },
): [DocData, boolean, any, () => void];
export declare function useSubscribeDoc(
  path: string,
  option?: {
    callback?: (data: DocData) => void;
    acceptOutdated?: boolean;
  },
): [DocData, boolean, any, () => void];
export declare function useLazyGetCollection(
  path: string,
  option?: {
    callback?: (collection: CollectionData) => void;
    acceptOutdated?: boolean;
  } & QueryOptions,
): [CollectionData, boolean, any, () => void];
export declare function useGetCollection(
  path: string,
  option?: {
    callback?: (collection: CollectionData) => void;
    acceptOutdated?: boolean;
  } & QueryOptions,
): [CollectionData, boolean, any, () => void];
export declare function useSubscribeCollection(
  path: string,
  option?: {
    callback?: (collection: CollectionData) => void;
  } & QueryOptions,
): [CollectionData, boolean, any, () => void];
export declare function useSetDoc(
  path: string,
  query: SetFql,
  option: any,
): (boolean | ((...args: any[]) => void) | null)[];
export declare function useAddDoc(
  path: string,
  query: SetFql,
  option: any,
): (boolean | ((...args: any[]) => void) | null)[];
export declare function useUpdateDoc(
  path: string,
  query: SetFql,
  option: any,
): (boolean | ((...args: any[]) => void) | null)[];
