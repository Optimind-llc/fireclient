import { firestore } from "firebase";
import { CollectionId, HooksId, QueryOption } from ".";
export declare function getHashCode(obj: any): number;
export declare function getQueryId(path: string, option: QueryOption): CollectionId;
export declare function getDoc(path: string, onGet: (doc: firestore.DocumentSnapshot) => void, onError: (err: any) => void, acceptOutdated?: boolean): void;
export declare function subscribeDoc(uuid: HooksId, path: string, onChange: (doc: firestore.DocumentSnapshot) => void, onError: (err: any) => void, onListen?: () => void): () => void;
export declare function getCollection(path: string, option: QueryOption | undefined, onGet: (collection: firestore.DocumentSnapshot[]) => void, onError: (err: any) => void, acceptOutdated?: boolean): void;
export declare function subscribeCollection(uuid: HooksId, path: string, option: QueryOption | undefined, onChange: (collection: firestore.DocumentSnapshot[]) => void, onError: (err: any) => void, onListen?: () => void): () => void;
