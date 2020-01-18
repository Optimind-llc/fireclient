import { firestore } from "firebase";
import "firebase/firestore";
import { FireclientDoc, HooksId, QueryOption } from ".";
export declare function generateHooksId(): HooksId;
export declare function useLazyGetDocSnapshot(path: string, option?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
    acceptOutdated?: boolean;
}): [firestore.DocumentSnapshot | null, boolean, any, () => void];
export declare function useGetDocSnapshot(path: string, option?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
    acceptOutdated?: boolean;
}): [firestore.DocumentSnapshot | null, boolean, any, () => void];
export declare function useSubscribeDocSnapshot(path: string, option?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
}): [firestore.DocumentSnapshot | null, boolean, any, () => void];
export declare function useLazyGetCollectionSnapshot(path: string, option?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
    acceptOutdated?: boolean;
} & QueryOption): [firestore.DocumentSnapshot[] | null, boolean, any, () => void];
export declare function useGetCollectionSnapshot(path: string, option?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
    acceptOutdated?: boolean;
} & QueryOption): [firestore.DocumentSnapshot[] | null, boolean, any, () => void];
export declare function useSubscribeCollectionSnapshot(path: string, option?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
} & QueryOption): [firestore.DocumentSnapshot[] | null, boolean, any, () => void];
export declare const initialDocData: FireclientDoc;
export declare const initialCollectionData: FireclientDoc[];
export declare function useLazyGetDoc(path: string, option?: {
    callback?: (data: FireclientDoc) => void;
    acceptOutdated?: boolean;
}): [FireclientDoc, boolean, any, () => void];
export declare function useGetDoc(path: string, option?: {
    callback?: () => void;
    acceptOutdated?: boolean;
}): [FireclientDoc, boolean, any, () => void];
export declare function useSubscribeDoc(path: string, option?: {
    callback?: () => void;
    acceptOutdated?: boolean;
}): [FireclientDoc, boolean, any, () => void];
export declare function useLazyGetCollection(path: string, option?: {
    callback?: () => void;
    acceptOutdated?: boolean;
} & QueryOption): [FireclientDoc[], boolean, any, () => void];
export declare function useGetCollection(path: string, option?: {
    callback?: () => void;
    acceptOutdated?: boolean;
} & QueryOption): [FireclientDoc[], boolean, any, () => void];
export declare function useSubscribeCollection(path: string, option?: {
    callback?: () => void;
    acceptOutdated?: boolean;
} & QueryOption): [FireclientDoc[], boolean, any, () => void];
