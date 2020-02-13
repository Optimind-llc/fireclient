import { firestore } from "firebase";
import { CollectionData, QueryOptions } from "..";
declare type GetCollectionFunction<State> = (path: string, onGet: (data: State) => void, onError: (err: any) => void, options?: QueryOptions, saveToState?: boolean, acceptOutdated?: boolean) => void;
export declare function useGetCollectionBase<State, InitialState = State>(path: string, initialValue: State | InitialState, lazy: boolean, getFunction: GetCollectionFunction<State>, options?: {
    callback?: (data: State) => void;
    saveToState?: boolean;
    acceptOutdated?: boolean;
} & QueryOptions): [State | InitialState, boolean, any, () => void];
export declare function useLazyGetCollectionSnapshot(path: string, options?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
    saveToState?: boolean;
    acceptOutdated?: boolean;
} & QueryOptions): [firestore.DocumentSnapshot[] | null, boolean, any, () => void];
export declare function useGetCollectionSnapshot(path: string, options?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
    saveToState?: boolean;
    acceptOutdated?: boolean;
} & QueryOptions): [firestore.DocumentSnapshot[] | null, boolean, any, () => void];
export declare function useLazyGetCollection(path: string, options?: {
    callback?: (collection: CollectionData) => void;
    saveToState?: boolean;
    acceptOutdated?: boolean;
} & QueryOptions): [CollectionData, boolean, any, () => void];
export declare function useGetCollection(path: string, options?: {
    callback?: (collection: CollectionData) => void;
    saveToState?: boolean;
    acceptOutdated?: boolean;
} & QueryOptions): [CollectionData, boolean, any, () => void];
export {};
