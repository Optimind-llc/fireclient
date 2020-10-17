import { firestore } from "firebase";
import * as pathlib from "path";
import { StaticSetCollectionFql, StaticSetFql } from ".";
import { getContext } from "./provider";
import { Actions } from "./reducer";
import { createData, deleteDocFromState, isDocPath, saveDoc } from "./utils";

type Fields = { [field: string]: any };
type SubCollection = {
  [name: string]: StaticSetCollectionFql;
};

/**
 * 書き込み完了時のCallback
 * @param dispatch
 * @param onSet Setする際のCallback
 * @param onError エラーが発生した際のCallback
 * @param docPath Set対象のDocのFirestore上でのPath
 * @param fields Setする内容
 * @param options Setする際のOption
 * @param subCollection Docに持たせるsubCollectionの内容
 */
const setDocCallback = (
  dispatch: React.Dispatch<Actions>,
  onSet: (docRef?: firestore.DocumentReference) => void,
  onError: (err: Error) => void,
  docPath: string,
  fields: Fields,
  options?: {
    merge?: boolean;
    mergeFields?: string[];
    saveToState?: boolean;
  },
  subCollection?: SubCollection,
  docRef?: firestore.DocumentReference,
): void => {
  const saveToState = options?.saveToState !== false; // default true
  // 書き込んだ内容をStateに保存する
  if (saveToState) {
    const docId = pathlib.basename(docPath);
    const data = createData(docId, fields);
    saveDoc(dispatch, docPath, data);
  }

  if (!subCollection) {
    // subCollectionがなければ終了
    onSet(docRef);
  } else {
    // subCollectionがあればそれぞれを書き込み
    const subCollectionQueries = Object.entries(subCollection);
    Promise.all(
      subCollectionQueries.map(
        ([subCollectionId, collectionQuery]) =>
          new Promise((resolve, reject) => {
            setCollection(
              pathlib.resolve(docPath, subCollectionId),
              collectionQuery,
              resolve,
              reject,
              options,
            );
          }),
      ),
    )
      .then(() => onSet(docRef))
      .catch(err => {
        console.error(err);
        onError(err);
      });
  }
};

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
export function setDoc(
  path: string,
  query: StaticSetFql,
  onSet: (docRef?: firestore.DocumentReference) => void,
  onError: (err: Error) => void,
  options: {
    merge?: boolean;
    mergeFields?: string[];
    saveToState?: boolean;
  } = {},
): void {
  const { firestoreDB, dispatch, onAccess } = getContext();
  const { id, subCollection } = query;
  const { merge, mergeFields } = options;
  const fields = query.fields ? query.fields : {};
  const isDoc = isDocPath(path);

  try {
    onAccess();
    if (isDoc) {
      // doc path が渡された時
      const ref = firestoreDB.doc(path);
      ref
        .set(fields, { merge, mergeFields })
        .then(() => setDocCallback(dispatch, onSet, onError, path, fields, options, subCollection))
        .catch(err => {
          console.error(err);
          onError(err);
        });
    } else if (id) {
      // collection path と id が渡された時
      const docPath = pathlib.resolve(path, id);
      const ref = firestoreDB.doc(docPath);
      ref
        .set(fields, { merge, mergeFields })
        .then(() => setDocCallback(dispatch, onSet, onError, path, fields, options, subCollection))
        .catch(err => {
          console.error(err);
          onError(err);
        });
    } else {
      // collection path のみ渡された時（ランダムな doc id が割り振られる）
      const ref = firestoreDB.collection(path);
      ref
        .add(fields)
        .then(doc =>
          setDocCallback(
            dispatch,
            onSet,
            onError,
            pathlib.resolve(path, doc.id),
            fields,
            options,
            subCollection,
            doc
          ),
        )
        .catch(err => {
          console.error(err);
          onError(err);
        });
    }
  } catch (err) {
    console.error(err);
    onError(err);
  }
}
/**
 * Docをqueryの内容でUpdateする
 * @param path 書込対象のDocのFirestore上でのPath
 * @param query Updateする内容
 * @param onUpdate Updateする際のCallback
 * @param onError Errorが発生した際のCallback
 * @param options Updateする際のOption
 */
export function updateDoc(
  path: string,
  query: StaticSetFql,
  onUpdate: () => void,
  onError: (err: Error) => void,
  options?: {
    saveToState?: boolean;
  },
): void {
  const { firestoreDB, dispatch, onAccess } = getContext();
  const { id } = query;
  const fields = query.fields ? query.fields : {};
  const isDoc = isDocPath(path);

  if (!isDoc && !id) {
    throw new Error("Given path is collection path and doc id is not specified in query.");
  }
  const docPath = isDoc ? path : pathlib.resolve(path, id as string);

  try {
    onAccess();
    const ref = firestoreDB.doc(docPath);
    ref
      .update(fields)
      .then(() => setDocCallback(dispatch, onUpdate, onError, docPath, fields, options))
      .catch(err => {
        console.error(err);
        onError(err);
      });
  } catch (err) {
    console.error(err);
    onError(err);
  }
}
/**
 * Collectionをqueriesの内容でSetする
 * @param path 書込対象のDocのFirestore上でのPath
 * @param queries Setする内容
 * @param onSet Setする際のCallback
 * @param onError Errorが発生した際のCallback
 * @param options Setする際のOption
 */
export function setCollection(
  collectionPath: string,
  queries: StaticSetCollectionFql,
  onSet: () => void,
  onError: (err: Error) => void,
  options?: {
    merge?: boolean;
    mergeFields?: string[];
    saveToState?: boolean;
  },
): void {
  Promise.all(
    queries.map(
      query =>
        new Promise((resolve, reject) => {
          const { id } = query;
          const path = id ? pathlib.resolve(collectionPath, id) : collectionPath;
          setDoc(path, query, resolve, reject, options);
        }),
    ),
  )
    .then(onSet)
    .catch(err => {
      console.error(err);
      onError(err);
    });
}

/**
 * DocをDeleteする
 * @param path 書込対象のDocのFirestore上でのPath
 * @param onDelete Deleteする際のCallback
 * @param onError Errorが発生した際のCallback
 * @param options Setする際のOption
 */
export function deleteDoc(
  path: string,
  onDelete: () => void,
  onError: (err: Error) => void,
  options: {
    saveToState?: boolean;
  } = {},
): void {
  const { firestoreDB, dispatch, onAccess } = getContext();
  const saveToState = options.saveToState !== false; // default true
  try {
    onAccess();
    firestoreDB
      .doc(path)
      .delete()
      .then(() => {
        if (saveToState) deleteDocFromState(dispatch, path);
        onDelete();
      })
      .catch(err => {
        console.error(err);
        onError(err);
      });
  } catch (err) {
    console.error(err);
  }
}
