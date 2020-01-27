import { SetCollectionQueryObject, SetDocQueryObject } from ".";
export declare function addDoc(path: string, query: SetDocQueryObject, onSet: () => void, onError: (error: any) => void): void;
export declare function setDoc(docPath: string, query: SetDocQueryObject, onSet: () => void, onError: (error: any) => void, option?: {
    merge?: boolean;
    mergeFields?: string[];
}): void;
export declare function updateDoc(docPath: string, query: SetDocQueryObject, onUpdate: () => void, onError: (error: any) => void): void;
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
export declare function setCollection(collectionPath: string, queries: SetCollectionQueryObject, onSet: () => void, onError: (error: any) => void, option?: {
    merge?: boolean;
    mergeFields?: string[];
}): void;
