import { firestore } from "firebase";
import { DocData } from "..";
export declare function useLazyGetDocSnapshot(path: string, options?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
    saveToState?: boolean;
    acceptOutdated?: boolean;
}): [firestore.DocumentSnapshot | null, boolean, any, () => void];
export declare function useGetDocSnapshot(path: string, options?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
    saveToState?: boolean;
    acceptOutdated?: boolean;
}): [firestore.DocumentSnapshot | null, boolean, any, () => void];
export declare function useLazyGetDoc(path: string, options?: {
    callback?: (data: DocData) => void;
    saveToState?: boolean;
    acceptOutdated?: boolean;
}): [DocData, boolean, any, () => void];
export declare function useGetDoc(path: string, options?: {
    callback?: (data: DocData) => void;
    saveToState?: boolean;
    acceptOutdated?: boolean;
}): [DocData, boolean, any, () => void];
