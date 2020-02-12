import "firebase/firestore";
import { SetFql } from "..";
export declare function useSetDoc(docPath: string, query: SetFql, options?: {
    merge?: boolean;
    mergeFields?: string[];
    callback?: () => void;
    saveToState?: boolean;
}): [(...args: any) => void, boolean, boolean, any];
export declare function useUpdateDoc(docPath: string, query: SetFql, options?: {
    callback?: () => void;
    saveToState?: boolean;
}): [(...args: any) => void, boolean, boolean, any];
