import { firestore } from "firebase";
import { CollectionId, HooksId, QueryOptions } from ".";
export declare function getHashCode(obj: any): number;
export declare function getQueryId(path: string, option: QueryOptions): CollectionId;
export declare function getDoc(
  path: string,
  onGet: (doc: firestore.DocumentSnapshot) => void,
  onError: (err: any) => void,
  acceptOutdated?: boolean,
): void;
export declare function subscribeDoc(
  uuid: HooksId,
  path: string,
  onChange: (doc: firestore.DocumentSnapshot) => void,
  onError: (err: any) => void,
  onListen?: () => void,
): () => void;
export declare function getCollection(
  path: string,
  option: QueryOptions | undefined,
  onGet: (collection: firestore.DocumentSnapshot[]) => void,
  onError: (err: any) => void,
  acceptOutdated?: boolean,
): void;
export declare function subscribeCollection(
  uuid: HooksId,
  path: string,
  option: QueryOptions | undefined,
  onChange: (collection: firestore.DocumentSnapshot[]) => void,
  onError: (err: any) => void,
  onListen?: () => void,
): () => void;
