import "firebase/firestore";
import { SetCollectionFql, SetFql } from ".";
export declare function useSetDoc(docPath: string, query: SetFql, options?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
}): (boolean | ((...args: any[]) => void) | null)[];
export declare function useUpdateDoc(docPath: string, query: SetFql, options?: {
    callback?: () => void;
}): (boolean | ((...args: any[]) => void) | null)[];
export declare function useSetDocs(queries: {
    [key: string]: SetFql;
}, options?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
}): (boolean | ((...args: any[]) => void) | null)[];
export declare function useUpdateDocs(queries: {
    [key: string]: SetFql;
}, options?: {
    callback?: () => void;
}): (boolean | ((...args: any[]) => void) | null)[];
export declare function useSetCollection(collectionPath: string, query: SetCollectionFql, options?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
}): (boolean | ((...args: any[]) => void) | null)[];
