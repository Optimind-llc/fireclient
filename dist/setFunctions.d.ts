import { StaticSetCollectionFql, StaticSetFql } from ".";
export declare function setDoc(path: string, query: StaticSetFql, onSet: () => void, onError: (err: Error) => void, options?: {
    merge?: boolean;
    mergeFields?: string[];
    saveToState?: boolean;
}): void;
export declare function updateDoc(docPath: string, query: StaticSetFql, onUpdate: () => void, onError: (err: Error) => void, options?: {
    saveToState?: boolean;
}): void;
export declare function setCollection(collectionPath: string, queries: StaticSetCollectionFql, onSet: () => void, onError: (err: Error) => void, options?: {
    merge?: boolean;
    mergeFields?: string[];
    saveToState?: boolean;
}): void;
export declare function deleteDoc(path: string, onDelete: () => void, onError: (err: Error) => void, options?: {
    saveToState?: boolean;
}): void;
