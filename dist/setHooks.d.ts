import "firebase/firestore";
import { SetCollectionSchema, SetDocSchema } from ".";
export declare function useSetDoc(docPath: string, query: SetDocSchema, option?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
}): (boolean | ((...args: any) => void) | null)[];
export declare function useAddDoc(collectionPath: string, query: SetDocSchema, option?: {
    callback?: () => void;
}): (boolean | ((...args: any) => void) | null)[];
export declare function useUpdateDoc(docPath: string, query: SetDocSchema, option?: {
    callback?: () => void;
}): (boolean | ((...args: any) => void) | null)[];
export declare function useAddDocs(queries: {
    [key: string]: SetDocSchema;
}, option?: {
    callback?: () => void;
}): (boolean | ((...args: any) => void) | null)[];
export declare function useSetDocs(queries: {
    [key: string]: SetDocSchema;
}, option?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
}): (boolean | ((...args: any) => void) | null)[];
export declare function useUpdateDocs(queries: {
    [key: string]: SetDocSchema;
}, option?: {
    callback?: () => void;
}): (boolean | ((...args: any) => void) | null)[];
export declare function useSetCollection(collectionPath: string, query: SetCollectionSchema, option?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
}): (boolean | ((...args: any) => void) | null)[];
