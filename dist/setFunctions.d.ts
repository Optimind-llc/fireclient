import { firestore } from "firebase";
import { StaticSetCollectionFql, StaticSetFql } from ".";
/**
 * Docにqueryの内容をsetする
 * DocPathが確定していれば db.doc(DocPath).set() を実行する
 * DocPathが確定していなければ db.collection(CollectionPath).add() を実行する
 * @param path 書込対象のDocのFirestore上でのPath
 * @param query Setする内容
 * @param onSet Setする際のCallback
 * @param onError Errorが発生した際のCallback
 * @param options Setする際のOption
 */
export declare function setDoc(path: string, query: StaticSetFql, onSet: (docRef?: firestore.DocumentReference) => void, onError: (err: Error) => void, options?: {
    merge?: boolean;
    mergeFields?: string[];
    saveToState?: boolean;
}): void;
/**
 * Docをqueryの内容でUpdateする
 * @param path 書込対象のDocのFirestore上でのPath
 * @param query Updateする内容
 * @param onUpdate Updateする際のCallback
 * @param onError Errorが発生した際のCallback
 * @param options Updateする際のOption
 */
export declare function updateDoc(path: string, query: StaticSetFql, onUpdate: () => void, onError: (err: Error) => void, options?: {
    saveToState?: boolean;
}): void;
/**
 * Collectionをqueriesの内容でSetする
 * @param path 書込対象のDocのFirestore上でのPath
 * @param queries Setする内容
 * @param onSet Setする際のCallback
 * @param onError Errorが発生した際のCallback
 * @param options Setする際のOption
 */
export declare function setCollection(collectionPath: string, queries: StaticSetCollectionFql, onSet: () => void, onError: (err: Error) => void, options?: {
    merge?: boolean;
    mergeFields?: string[];
    saveToState?: boolean;
}): void;
/**
 * DocをDeleteする
 * @param path 書込対象のDocのFirestore上でのPath
 * @param onDelete Deleteする際のCallback
 * @param onError Errorが発生した際のCallback
 * @param options Setする際のOption
 */
export declare function deleteDoc(path: string, onDelete: () => void, onError: (err: Error) => void, options?: {
    saveToState?: boolean;
}): void;
