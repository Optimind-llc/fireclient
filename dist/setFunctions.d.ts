import { DocData, SetDocQueryObject } from ".";
export declare function addDoc(path: string, query: SetDocQueryObject, onSet: (data: DocData) => void, onError: (error: any) => void): void;
export declare function setDoc(path: string, query: SetDocQueryObject, onSet: () => void, onError: (error: any) => void): void;
export declare function updateDoc(path: string, query: SetDocQueryObject, onUpdate: () => void, onError: (error: any) => void): void;
