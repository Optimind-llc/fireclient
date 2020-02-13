import { firestore } from "firebase";
import { CollectionData, HooksId, QueryOptions } from "..";
declare type SubscribeCollectionFunction<State> = (hooksId: HooksId, path: string, onChange: (doc: State) => void, onError: (err: Error) => void, onListen?: () => void, options?: QueryOptions, saveToState?: boolean) => () => void;
export declare function useSubscribeCollectionBase<State, InitialState = State>(path: string, initialValue: State | InitialState, subscribeFunction: SubscribeCollectionFunction<State>, options?: {
    callback?: (data: State) => void;
    saveToState?: boolean;
} & QueryOptions): [State | InitialState, boolean, any, () => void];
export declare function useSubscribeCollectionSnapshot(path: string, options?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
    saveToState?: boolean;
} & QueryOptions): [firestore.DocumentSnapshot[] | null, boolean, any, () => void];
export declare function useSubscribeCollection(path: string, options?: {
    callback?: (collection: CollectionData) => void;
    saveToState?: boolean;
} & QueryOptions): [CollectionData, boolean, any, () => void];
export {};
