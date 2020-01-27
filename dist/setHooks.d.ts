import "firebase/firestore";
import { SetCollectionSchema, SetDocSchema } from ".";
export declare function useSetDoc(docPath: string, query: SetDocSchema, options?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
}): (boolean | ((...args: any) => void) | null)[];
export declare function useAddDoc(collectionPath: string, query: SetDocSchema, options?: {
    callback?: () => void;
}): (boolean | ((...args: any) => void) | null)[];
export declare function useUpdateDoc(docPath: string, query: SetDocSchema, options?: {
    callback?: () => void;
}): (boolean | ((...args: any) => void) | null)[];
export declare function useAddDocs(queries: {
    [key: string]: SetDocSchema;
}, options?: {
    callback?: () => void;
}): (boolean | ((...args: any) => void) | null)[];
export declare function useSetDocs(queries: {
    [key: string]: SetDocSchema;
}, options?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
}): (boolean | ((...args: any) => void) | null)[];
export declare function useUpdateDocs(queries: {
    [key: string]: SetDocSchema;
}, options?: {
    callback?: () => void;
}): (boolean | ((...args: any) => void) | null)[];
export declare function useSetCollection(collectionPath: string, query: SetCollectionSchema, options?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
}): (boolean | ((...args: any) => void) | null)[];
