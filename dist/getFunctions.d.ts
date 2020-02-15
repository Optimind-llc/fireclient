import { firestore } from "firebase";
import { CollectionData, DocData, HooksId, QueryOptions } from ".";
/**
 * DocのSnapshotを取得する
 * saveToState == true の場合
 * 取得時にproviderContext内のstateに取得内容を保存する
 * @param path 取得対象のFirestore上のPath
 * @param onGet 取得した際のCallback
 * @param onError Errorが発生した際のCallback
 * @param saveToState 取得した内容をStateに保存するかを決める
 */
export declare function getDocSnapshot(path: string, onGet: (doc: firestore.DocumentSnapshot) => void, onError: (err: Error) => void, saveToState?: boolean): void;
/**
 * DocをDocDataの形で取得する
 * saveToState == true の場合
 * 取得時にproviderContext内のstateに取得内容を保存する
 * @param path 取得対象のFirestore上のPath
 * @param onGet 取得した際のCallback
 * @param onError Errorが発生した際のCallback
 * @param saveToState 取得した内容をStateに保存するかを決める
 * @param acceptOutdated 取得対象のCacheが残っていた場合それを使用する
 */
export declare function getDoc(path: string, onGet: (doc: DocData) => void, onError: (err: Error) => void, saveToState?: boolean, acceptOutdated?: boolean): void;
/**
 * DocのSnapshotをSubscribeする
 * saveToState == true の場合
 * 取得時にproviderContext内のstateに取得内容を保存する
 * @param hooksId どこからSubscribeされているかを表す
 * @param path 対象のDocのFireclient上でのPath
 * @param onChange データを取得した際のCallback
 * @param onError Errorが発生した際のCallback
 * @param onListen データを取得する直前に実行されるCallback
 * @param saveToState 取得した内容をStateに保存するかを決める
 */
export declare function subscribeDocSnapshot(hooksId: HooksId, path: string, onChange: (doc: firestore.DocumentSnapshot) => void, onError: (err: Error) => void, onListen?: () => void, saveToState?: boolean): () => void;
/**
 * DocをDocDataの形でSubscribeする
 * saveToState == true の場合
 * 取得時にproviderContext内のstateに取得内容を保存する
 * @param hooksId どこからSubscribeされているかを表す
 * @param path 対象のDocのFireclient上でのPath
 * @param onChange データを取得した際のCallback
 * @param onError Errorが発生した際のCallback
 * @param onListen データを取得する直前に実行されるCallback
 * @param saveToState 取得した内容をStateに保存するかを決める
 */
export declare function subscribeDoc(hooksId: HooksId, path: string, onChange: (doc: DocData) => void, onError: (err: Error) => void, onListen?: () => void, saveToState?: boolean): () => void;
/**
 * CollectionのSnapshotを取得する
 * saveToState == true の場合
 * 取得時にproviderContext内のstateに取得内容を保存する
 * @param path 取得対象のFirestore上のPath
 * @param onGet 取得した際のCallback
 * @param onError Errorが発生した際のCallback
 * @param options Collectionを取得する際のOption. Where Limit Order Cursor などを含む
 * @param saveToState 取得した内容をStateに保存するかを決める
 */
export declare function getCollectionSnapshot(path: string, onGet: (collection: firestore.DocumentSnapshot[]) => void, onError: (err: Error) => void, options?: QueryOptions, saveToState?: boolean): void;
/**
 * CollectionをCollectionDataの形で取得する
 * saveToState == true の場合
 * 取得時にproviderContext内のstateに取得内容を保存する
 * @param path 取得対象のFirestore上のPath
 * @param onGet 取得した際のCallback
 * @param onError Errorが発生した際のCallback
 * @param options Collectionを取得する際のOption. Where Limit Order Cursor などを含む
 * @param saveToState 取得した内容をStateに保存するかを決める
 * @param acceptOutdated 取得対象のCacheが残っていた場合それを使用する
 */
export declare function getCollection(path: string, onGet: (collection: CollectionData) => void, onError: (err: Error) => void, options?: QueryOptions, saveToState?: boolean, acceptOutdated?: boolean): void;
/**
 * CollectionのSnapshotをSubscribeする
 * saveToState == true の場合
 * 取得時にproviderContext内のstateに取得内容を保存する
 * @param hooksId どこからSubscribeされているかを表す
 * @param path 対象のDocのFireclient上でのPath
 * @param onChange データを取得した際のCallback
 * @param onError Errorが発生した際のCallback
 * @param onListen データを取得する直前に実行されるCallback
 * @param options Collectionを取得する際のOption. Where Limit Order Cursor などを含む
 * @param saveToState 取得した内容をStateに保存するかを決める
 */
export declare function subscribeCollectionSnapshot(hooksId: HooksId, path: string, onChange: (collection: firestore.DocumentSnapshot[]) => void, onError: (err: Error) => void, onListen?: () => void, options?: QueryOptions, saveToState?: boolean): () => void;
/**
 * CollectionをCollectionDataの形でSubscribeする
 * saveToState == true の場合
 * 取得時にproviderContext内のstateに取得内容を保存する
 * @param hooksId どこからSubscribeされているかを表す
 * @param path 対象のDocのFireclient上でのPath
 * @param onChange データを取得した際のCallback
 * @param onError Errorが発生した際のCallback
 * @param onListen データを取得する直前に実行されるCallback
 * @param options Collectionを取得する際のOption. Where Limit Order Cursor などを含む
 * @param saveToState 取得した内容をStateに保存するかを決める
 */
export declare function subscribeCollection(hooksId: HooksId, path: string, onChange: (collection: CollectionData) => void, onError: (err: Error) => void, onListen?: () => void, options?: QueryOptions, saveToState?: boolean): () => void;
