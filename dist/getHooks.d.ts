import { firestore } from "firebase";
import "firebase/firestore";
import { CollectionData, DocData, HooksId, QueryOptions } from ".";
export declare function generateHooksId(): HooksId;
export declare function useSubscribeDocBase<State, InitialState = State>(path: string, initialValue: State | InitialState, subscribeFunction: (hooksId: HooksId, path: string, onChange: (doc: State) => void, onError: (err: any) => void, onListen?: () => void) => () => void, options?: {
    callback?: (snapshot: State) => void;
}): [State | InitialState, boolean, any, () => void];
export declare function useLazyGetCollectionBase<State, InitialState = State>(path: string, initialValue: State | InitialState, getFunction: (path: string, onGet: (data: State) => void, onError: (err: any) => void, options?: QueryOptions, acceptOutdated?: boolean) => void, options?: {
    callback?: (data: State) => void;
    acceptOutdated?: boolean;
} & QueryOptions): [State | InitialState, boolean, any, () => void];
export declare function useSubscribeCollectionBase<State, InitialState = State>(path: string, initialValue: State | InitialState, subscribeFunction: (hooksId: HooksId, path: string, onChange: (doc: State) => void, onError: (err: any) => void, onListen?: () => void, options?: QueryOptions) => () => void, options?: {
    callback?: (data: State) => void;
} & QueryOptions): [State | InitialState, boolean, any, () => void];
export declare function useLazyGetDocSnapshot(path: string, options?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
    acceptOutdated?: boolean;
}): [firestore.DocumentSnapshot | null, boolean, any, () => void];
export declare function useGetDocSnapshot(path: string, options?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
    acceptOutdated?: boolean;
}): [firestore.DocumentSnapshot | null, boolean, any, () => void];
export declare function useSubscribeDocSnapshot(path: string, options?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
}): [firestore.DocumentSnapshot | null, boolean, any, () => void];
export declare function useLazyGetCollectionSnapshot(path: string, options?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
    acceptOutdated?: boolean;
} & QueryOptions): [firestore.DocumentSnapshot[] | null, boolean, any, () => void];
export declare function useGetCollectionSnapshot(path: string, options?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
    acceptOutdated?: boolean;
} & QueryOptions): [firestore.DocumentSnapshot[] | null, boolean, any, () => void];
export declare function useSubscribeCollectionSnapshot(path: string, options?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
} & QueryOptions): [firestore.DocumentSnapshot[] | null, boolean, any, () => void];
export declare const initialDocData: DocData;
export declare const initialCollectionData: CollectionData;
export declare function useLazyGetDoc(path: string, options?: {
    callback?: (data: DocData) => void;
    acceptOutdated?: boolean;
}): [DocData, boolean, any, () => void];
export declare function useGetDoc(path: string, options?: {
    callback?: () => void;
    acceptOutdated?: boolean;
}): [DocData, boolean, any, () => void];
export declare function useSubscribeDoc(path: string, options?: {
    callback?: (data: DocData) => void;
    acceptOutdated?: boolean;
}): [DocData, boolean, any, () => void];
export declare function useLazyGetCollection(path: string, options?: {
    callback?: (collection: CollectionData) => void;
    acceptOutdated?: boolean;
} & QueryOptions): [CollectionData, boolean, any, () => void];
export declare function useGetCollection(path: string, options?: {
    callback?: (collection: CollectionData) => void;
    acceptOutdated?: boolean;
} & QueryOptions): [CollectionData, boolean, any, () => void];
export declare function useSubscribeCollection(path: string, options?: {
    callback?: (collection: CollectionData) => void;
} & QueryOptions): [CollectionData, boolean, any, () => void];
