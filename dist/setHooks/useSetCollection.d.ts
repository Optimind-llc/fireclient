import { SetCollectionFql } from "..";
export declare function useSetCollection(collectionPath: string, query: SetCollectionFql, options?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
    saveToState?: boolean;
}): [(...args: any) => void, boolean, boolean, any];
