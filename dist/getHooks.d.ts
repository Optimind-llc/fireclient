import { firestore } from "firebase";
import "firebase/firestore";
import { CollectionData, DocData, HooksId, QueryOptions } from ".";
declare type GetCollectionFunction<State> = (path: string, onGet: (data: State) => void, onError: (err: any) => void, options?: QueryOptions, acceptOutdated?: boolean, saveToState?: boolean) => void;
declare type SubscribeDocFunction<State> = (hooksId: HooksId, path: string, onChange: (doc: State) => void, onError: (err: any) => void, onListen?: () => void, saveToState?: boolean) => () => void;
declare type SubscribeCollectionFunction<State> = (hooksId: HooksId, path: string, onChange: (doc: State) => void, onError: (err: any) => void, onListen?: () => void, options?: QueryOptions, saveToState?: boolean) => () => void;
export declare function useSubscribeDocBase<State, InitialState = State>(path: string, initialValue: State | InitialState, subscribeFunction: SubscribeDocFunction<State>, options?: {
    callback?: (snapshot: State) => void;
    saveToState?: boolean;
}): [State | InitialState, boolean, any, () => void];
export declare function useGetCollectionBase<State, InitialState = State>(path: string, initialValue: State | InitialState, lazy: boolean, getFunction: GetCollectionFunction<State>, options?: {
    callback?: (data: State) => void;
    acceptOutdated?: boolean;
    saveToState?: boolean;
} & QueryOptions): [State | InitialState, boolean, any, () => void];
export declare function useSubscribeCollectionBase<State, InitialState = State>(path: string, initialValue: State | InitialState, subscribeFunction: SubscribeCollectionFunction<State>, options?: {
    callback?: (data: State) => void;
    saveToState?: boolean;
} & QueryOptions): [State | InitialState, boolean, any, () => void];
export declare function useLazyGetDocSnapshot(path: string, options?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
    acceptOutdated?: boolean;
    saveToState?: boolean;
}): [firestore.DocumentSnapshot | null, boolean, any, () => void];
export declare function useGetDocSnapshot(path: string, options?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
    acceptOutdated?: boolean;
    saveToState?: boolean;
}): [firestore.DocumentSnapshot | null, boolean, any, () => void];
export declare function useSubscribeDocSnapshot(path: string, options?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
    saveToState?: boolean;
}): [firestore.DocumentSnapshot | null, boolean, any, () => void];
export declare function useLazyGetCollectionSnapshot(path: string, options?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
    acceptOutdated?: boolean;
    saveToState?: boolean;
} & QueryOptions): [firestore.DocumentSnapshot[] | null, boolean, any, () => void];
export declare function useGetCollectionSnapshot(path: string, options?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
    acceptOutdated?: boolean;
    saveToState?: boolean;
} & QueryOptions): [firestore.DocumentSnapshot[] | null, boolean, any, () => void];
export declare function useSubscribeCollectionSnapshot(path: string, options?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
    saveToState?: boolean;
} & QueryOptions): [firestore.DocumentSnapshot[] | null, boolean, any, () => void];
export declare const initialDocData: DocData;
export declare const initialCollectionData: CollectionData;
export declare function useLazyGetDoc(path: string, options?: {
    callback?: (data: DocData) => void;
    acceptOutdated?: boolean;
    saveToState?: boolean;
}): [DocData, boolean, any, () => void];
export declare function useGetDoc(path: string, options?: {
    callback?: (data: DocData) => void;
    acceptOutdated?: boolean;
    saveToState?: boolean;
}): [DocData, boolean, any, () => void];
export declare function useSubscribeDoc(path: string, options?: {
    callback?: (data: DocData) => void;
    acceptOutdated?: boolean;
    saveToState?: boolean;
}): [DocData, boolean, any, () => void];
export declare function useLazyGetCollection(path: string, options?: {
    callback?: (collection: CollectionData) => void;
    acceptOutdated?: boolean;
    saveToState?: boolean;
} & QueryOptions): [CollectionData, boolean, any, () => void];
export declare function useGetCollection(path: string, options?: {
    callback?: (collection: CollectionData) => void;
    acceptOutdated?: boolean;
    saveToState?: boolean;
} & QueryOptions): [CollectionData, boolean, any, () => void];
export declare function useSubscribeCollection(path: string, options?: {
    callback?: (collection: CollectionData) => void;
    saveToState?: boolean;
} & QueryOptions): [CollectionData, boolean, any, () => void];
export {};
