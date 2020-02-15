import { SetFql } from "..";
export declare function useSetDocs(queries: {
    [key: string]: SetFql;
}, options?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
    saveToState?: boolean;
}): [(...args: any) => void, boolean, boolean, any];
export declare function useUpdateDocs(queries: {
    [key: string]: SetFql;
}, options?: {
    callback?: () => void;
    saveToState?: boolean;
}): [(...args: any) => void, boolean, boolean, any];
