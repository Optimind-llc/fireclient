import "firebase/firestore";
import { Map } from "immutable";
import { ObjectQuery, ArrayQuery, CollectionData, DocData, QueryOptions, GetFql } from ".";
declare type ArrayQueryData = (DocData | CollectionData)[];
export declare function useArrayQuery(getFql: GetFql<ArrayQuery>): [ArrayQueryData, boolean, any, {
    unsubscribeFn: () => void;
    reloadFn: () => void;
}];
declare type QueryData = Map<string, DocData | CollectionData | {}>;
export declare function useQuery(getFql: GetFql<ObjectQuery>): [QueryData, boolean, any, {
    unsubscribeFn: () => void;
    reloadFn: () => void;
}];
export declare function usePaginateCollection(path: string, options: {
    callback?: () => void;
    acceptOutdated?: boolean;
} & QueryOptions): any[];
export declare function useGetSubCollection(path: string, options: {
    field: string;
    collectionPath: string;
    acceptOutdated?: boolean;
}): any[];
export {};
