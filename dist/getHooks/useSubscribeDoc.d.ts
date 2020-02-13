import { firestore } from "firebase";
import { DocData, HooksId } from "..";
declare type SubscribeDocFunction<State> = (hooksId: HooksId, path: string, onChange: (doc: State) => void, onError: (err: Error) => void, onListen?: () => void, saveToState?: boolean) => () => void;
export declare function useSubscribeDocBase<State, InitialState = State>(path: string, initialValue: State | InitialState, subscribeFunction: SubscribeDocFunction<State>, options?: {
    callback?: (snapshot: State) => void;
    saveToState?: boolean;
}): [State | InitialState, boolean, any, () => void];
export declare function useSubscribeDocSnapshot(path: string, options?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
    saveToState?: boolean;
}): [firestore.DocumentSnapshot | null, boolean, any, () => void];
export declare function useSubscribeDoc(path: string, options?: {
    callback?: (data: DocData) => void;
    acceptOutdated?: boolean;
    saveToState?: boolean;
}): [DocData, boolean, any, () => void];
export {};
