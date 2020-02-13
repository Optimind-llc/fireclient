import { CollectionData } from "..";
export declare function useGetSubCollection(path: string, subCollectionName: string, options?: {
    acceptOutdated?: boolean;
    callback?: () => void;
}): [CollectionData, boolean, any, () => void];
