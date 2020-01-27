import "firebase/firestore";
import { Map } from "immutable";
import { ObjectQuery, ArrayQuery, CollectionData, DocData, QueryOptions, QuerySchema } from ".";
declare type ArrayQueryData = (DocData | CollectionData)[];
export declare function useArrayQuery(querySchema: QuerySchema<ArrayQuery>): [ArrayQueryData, boolean, any, {
    unsubscribeFn: () => void;
    reloadFn: () => void;
}];
declare type QueryData = Map<string, DocData | CollectionData | {}>;
export declare function useQuery(querySchema: QuerySchema<ObjectQuery>): [QueryData, boolean, any, {
    unsubscribeFn: () => void;
    reloadFn: () => void;
}];
export declare function usePaginateCollection(path: string, option: {
    callback?: () => void;
    acceptOutdated?: boolean;
} & QueryOptions): any[];
export declare function useGetSubCollection(path: string, option: {
    field: string;
    collectionPath: string;
    acceptOutdated?: boolean;
}): any[];
export {};
