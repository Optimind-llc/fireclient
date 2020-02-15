import { Map } from "immutable";
import { ArrayQuery, CollectionData, DocData, GetFql, ObjectQuery } from "..";
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
export {};
