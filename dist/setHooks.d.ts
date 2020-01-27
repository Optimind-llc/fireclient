import "firebase/firestore";
import { SetCollectionQuery, SetDocQuery } from ".";
export declare function useSetDoc(docPath: string, query: SetDocQuery, option?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
}): (boolean | ((...args: any) => void) | null)[];
export declare function useAddDoc(collectionPath: string, query: SetDocQuery, option?: {
    callback?: () => void;
}): (boolean | ((...args: any) => void) | null)[];
export declare function useUpdateDoc(docPath: string, query: SetDocQuery, option?: {
    callback?: () => void;
}): (boolean | ((...args: any) => void) | null)[];
export declare function useAddDocs(queries: {
    [key: string]: SetDocQuery;
}, option?: {
    callback?: () => void;
}): (boolean | ((...args: any) => void) | null)[];
export declare function useSetDocs(queries: {
    [key: string]: SetDocQuery;
}, option?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
}): (boolean | ((...args: any) => void) | null)[];
export declare function useUpdateDocs(queries: {
    [key: string]: SetDocQuery;
}, option?: {
    callback?: () => void;
}): (boolean | ((...args: any) => void) | null)[];
export declare function useSetCollection(collectionPath: string, query: SetCollectionQuery, option?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
}): (boolean | ((...args: any) => void) | null)[];
