import { SetCollectionSchemaObject, SetDocSchemaObject } from ".";
export declare function addDoc(path: string, query: SetDocSchemaObject, onSet: () => void, onError: (error: any) => void): void;
export declare function setDoc(docPath: string, query: SetDocSchemaObject, onSet: () => void, onError: (error: any) => void, options?: {
    merge?: boolean;
    mergeFields?: string[];
}): void;
export declare function updateDoc(docPath: string, query: SetDocSchemaObject, onUpdate: () => void, onError: (error: any) => void): void;
/**
 * ```js
 * queries: [
 *  {
 *    id: ...,
 *    fields: { ... },
 *  },
 *  {
 *    fields: { ... },
 *    subCollection: { ... }
 *  }
 * ]
 * ```
 */
export declare function setCollection(collectionPath: string, queries: SetCollectionSchemaObject, onSet: () => void, onError: (error: any) => void, options?: {
    merge?: boolean;
    mergeFields?: string[];
}): void;
