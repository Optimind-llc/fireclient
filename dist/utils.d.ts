/// <reference types="react" />
import { firestore } from "firebase";
import { List } from "immutable";
import { CollectionId, DocId, HooksId, QueryOption } from ".";
import { CollectionData, DocData } from "./";
import { Actions } from "./reducer";
export declare function getHashCode(obj: any): number;
export declare function getQueryId(path: string, option: QueryOption): CollectionId;
export declare function isDocPath(path: string): boolean;
export declare function createData(id: string, fields: {
    [fields: string]: any;
}): DocData;
/**
 * Converts Firestore document snapshot into `DocData`.
 * @param {firestore.DocumentData} doc
 * @example
 * const [snapshot] = useGetDocSnapshot("/path/to/doc");
 * const docData = createDataFromDoc(snapshot);
 */
export declare function createDataFromDoc(doc: firestore.DocumentData): DocData;
/**
 * Converts Firestore collection snapshot into `CollectionData`.
 * @param {firestore.DocumentData} doc
 * @example
 * const [snapshot] = useGetCollectionSnapshot("/path/to/collection");
 * const collectionData = createDataFromCollection(snapshot);
 */
export declare function createDataFromCollection(collection: firestore.DocumentSnapshot[]): CollectionData;
export declare function saveDoc(dispatch: React.Dispatch<Actions>, docPath: string, doc: DocData): void;
export declare function saveCollection(dispatch: React.Dispatch<Actions>, path: string, option: QueryOption, collection: CollectionData): void;
export declare function connectDocToState(dispatch: React.Dispatch<Actions>, docId: DocId, uuid: HooksId): void;
export declare function connectCollectionToState(dispatch: React.Dispatch<Actions>, collectionId: CollectionId, uuid: HooksId, docIds: List<DocId>): void;
export declare function disconnectDocFromState(dispatch: React.Dispatch<Actions>, docId: DocId, uuid: HooksId): void;
export declare function disconnectCollectionFromState(dispatch: React.Dispatch<Actions>, collectionId: CollectionId, uuid: HooksId, docIds: List<DocId>): void;
export declare function withOption(ref: firestore.CollectionReference, { where, limit, order, cursor }: QueryOption): firestore.Query;
