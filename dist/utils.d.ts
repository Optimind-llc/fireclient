/// <reference types="react" />
import { firestore } from "firebase";
import { List } from "immutable";
import { QueryOptions } from ".";
import { CollectionData, DocData, FireclientState } from "./";
import { Actions } from "./reducer";
/**
 * 受け取ったobjのHashCodeを返す
 * objが持つkeyとvalueが一致していれば全く同じ値を返す全単射な関数
 * @param obj
 */
export declare const getHashCode: (obj: any) => number;
/**
 * CollectionのQueryに対するQueryIdを返す
 * CollectionPathとoptionsの内容が一致していれば全く同じ値を返す全単射な関数
 * @param collectionPath Fireclient上のCollectionのPath
 * @param options
 */
export declare const getQueryId: (collectionPath: string, options?: QueryOptions) => string;
/**
 * HooksIdを生成する
 * ランダムな値を返す
 */
export declare const generateHooksId: () => string;
/**
 * CollectionIdからPathの部分のみを抽出する
 * @param collectionId
 */
export declare const getCollectionPathFromId: (collectionId: string) => string;
export declare const searchCollectionId: (collectionPath: string, state: FireclientState) => string[];
/**
 * pathがDocのPathであるかどうかを判定する
 * @param path
 */
export declare const isDocPath: (path: string) => boolean;
/**
 * 取得したDocをDocDataに変換する
 * @param id DocId
 * @param fields Docの内容
 */
export declare const createData: (id: string, fields: {
    [fields: string]: any;
}) => DocData;
/**
 * Converts Firestore document snapshot into `DocData`.
 * @param {firestore.DocumentData} doc
 * @example
 * const [snapshot] = useGetDocSnapshot("/path/to/doc");
 * const docData = createDataFromDoc(snapshot);
 */
export declare const createDataFromDoc: (doc: firestore.DocumentData) => DocData;
/**
 * Converts Firestore collection snapshot into `CollectionData`.
 * @param {firestore.DocumentData} doc
 * @example
 * const [snapshot] = useGetCollectionSnapshot("/path/to/collection");
 * const collectionData = createDataFromCollection(snapshot);
 */
export declare const createDataFromCollection: (collection: firestore.DocumentSnapshot<firestore.DocumentData>[]) => CollectionData;
/**
 * DocDataをproviderContext内のstateに保存する
 * @param dispatch
 * @param docPath
 * @param doc
 */
export declare const saveDoc: (dispatch: import("react").Dispatch<Actions>, docPath: string, doc: DocData) => void;
/**
 * CollectionDataをproviderContext内のstateに保存する
 * @param dispatch
 * @param collectionPath
 * @param options Collectionを取得した際のQueryOptions QueryIdの取得に使用する
 * @param collection
 */
export declare const saveCollection: (dispatch: import("react").Dispatch<Actions>, collectionPath: string, options: QueryOptions, collection: CollectionData) => void;
/**
 * docPathの内容をproviderContext内のstateから削除する
 * @param dispatch
 * @param docPath
 */
export declare const deleteDocFromState: (dispatch: import("react").Dispatch<Actions>, docPath: string) => void;
/**
 * collectionPathの内容をproviderContext内のstateから削除する
 * @param dispatch
 * @param collectionPath
 */
export declare const deleteCollectionFromState: (dispatch: import("react").Dispatch<Actions>, collectionPath: string) => void;
/**
 * providerContext内のstate上で
 * docIdがhooksIdからsubscribeされていることを記憶する
 *
 * state.doc.(docId).connectedFromにhooksIdを追加する
 * @param dispatch
 * @param docId
 * @param hooksId
 */
export declare const connectDocToState: (dispatch: import("react").Dispatch<Actions>, docId: string, hooksId: string) => void;
/**
 * providerContext内のstate上で
 * 各docIdとcollectionIdがhooksIdからsubscribeされていることを記憶する
 *
 * state.doc.(各docId).connectedFromと
 * state.collection.(collectionId).connectedFromにhooksIdを追加する
 * @param dispatch
 * @param collectionId
 * @param hooksId
 * @param docIds
 */
export declare const connectCollectionToState: (dispatch: import("react").Dispatch<Actions>, collectionId: string, hooksId: string, docIds: List<string>) => void;
/**
 * state.doc.(docId).connectedFromからhooksIdを削除する
 * @param dispatch
 * @param docId
 * @param hooksId
 */
export declare const disconnectDocFromState: (dispatch: import("react").Dispatch<Actions>, docId: string, hooksId: string) => void;
/**
 * state.doc.(各docId).connectedFromと
 * state.collection.(collectionId).connectedFromからhooksIdを削除する
 * @param dispatch
 * @param collectionId
 * @param hooksId
 * @param docIds
 */
export declare const disconnectCollectionFromState: (dispatch: import("react").Dispatch<Actions>, collectionId: string, hooksId: string, docIds: List<string>) => void;
export declare function withOption(ref: firestore.CollectionReference, { where, limit, order, cursor }: QueryOptions): firestore.Query;
