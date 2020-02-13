import "firebase/firestore";
import { CollectionData, QueryOptions } from "..";
declare type PageHandler = {
    fn: () => void;
    enabled: boolean;
};
export declare function usePaginateCollection(path: string, options: {
    callback?: () => void;
    acceptOutdated?: boolean;
} & QueryOptions): [CollectionData, boolean, any, PageHandler, PageHandler];
export {};
