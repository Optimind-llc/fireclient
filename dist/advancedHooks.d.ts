import "firebase/firestore";
import { Map } from "immutable";
import { ObjectQuery, ArrayQuery, CollectionData, DocData, QueryOptions, GetFql } from ".";
declare type ArrayQueryData = (DocData | CollectionData)[];
export declare function useArrayQuery(getFql: GetFql<ArrayQuery>): [ArrayQueryData, boolean, any, {
    unsubscribe: () => void;
    reload: () => void;
}];
declare type QueryData = Map<string, DocData | CollectionData | {}>;
export declare function useQuery(getFql: GetFql<ObjectQuery>): [QueryData, boolean, any, {
    unsubscribe: () => void;
    reload: () => void;
}];
export declare function usePaginateCollection(path: string, options: {
    callback?: () => void;
    acceptOutdated?: boolean;
} & QueryOptions): any[];
export declare function useGetSubCollection(path: string, option: {
    subCollectionName: string;
    acceptOutdated?: boolean;
}): (boolean | any[] | (() => void))[];
export {};
