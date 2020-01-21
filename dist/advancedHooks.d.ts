import "firebase/firestore";
import { Map } from "immutable";
import { ArrayQuerySchema, FireclientDoc, QueryOption, QuerySchema } from ".";
declare type ArrayQueryData = (FireclientDoc | FireclientDoc[])[];
export declare function useArrayQuery(querySchema: ArrayQuerySchema): [ArrayQueryData, boolean, any, {
    unsubscribe: () => void;
    reload: () => void;
}];
declare type QueryData = Map<string, FireclientDoc | FireclientDoc[] | {}>;
export declare function useQuery(querySchema: QuerySchema): [QueryData, boolean, any, {
    unsubscribe: () => void;
    reload: () => void;
}];
export declare function usePaginateCollection(path: string, option: {
    callback?: () => void;
    acceptOutdated?: boolean;
} & QueryOption): any[];
export declare function useGetSubCollection(path: string, option: {
    subCollectionName: string;
    acceptOutdated?: boolean;
}): (boolean | any[] | (() => void))[];
export {};
