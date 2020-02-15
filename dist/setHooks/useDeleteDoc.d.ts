import { SetFql } from "..";
export declare function useDeleteDoc(docPath: string, options?: {
    callback?: () => void;
    saveToState?: boolean;
}): [() => void, boolean, boolean, any];
export declare function useDeleteDocs(docPaths: string[], query: SetFql, options?: {
    callback?: () => void;
    saveToState?: boolean;
}): [() => void, boolean, boolean, any];
