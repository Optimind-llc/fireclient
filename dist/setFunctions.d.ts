import { StaticSetCollectionFql, StaticSetFql } from ".";
export declare function setDoc(path: string, query: StaticSetFql, onSet: () => void, onError: (error: any) => void, options?: {
    merge?: boolean;
    mergeFields?: string[];
}): void;
export declare function updateDoc(docPath: string, query: StaticSetFql, onUpdate: () => void, onError: (error: any) => void): void;
/**
 * ```js
 * [
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
export declare function setCollection(collectionPath: string, queries: StaticSetCollectionFql, onSet: () => void, onError: (error: any) => void, options?: {
    merge?: boolean;
    mergeFields?: string[];
}): void;
