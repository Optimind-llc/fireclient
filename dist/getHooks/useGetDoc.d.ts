import { firestore } from "firebase";
import "firebase/firestore";
import { DocData } from "..";
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
