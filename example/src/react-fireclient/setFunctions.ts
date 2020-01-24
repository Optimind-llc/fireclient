import * as pathlib from "path";
import { SetCollectionQueryObject, SetDocQueryObject } from ".";
import { getContext } from "./provider";
import { Actions } from "./reducer";
import { createData, saveDoc } from "./utils";

type Fields = { [field: string]: any };
type SubCollection = {
  [name: string]: SetCollectionQueryObject;
};

// 書き込み完了時のCallback
const setDocCallback = (
  dispatch: React.Dispatch<Actions>,
  onSet: () => void,
  onError: (error: any) => void,
  // collectionPath: string,
  // docId: string,
  docPath: string,
  fields: Fields,
  subCollection?: SubCollection,
) => {
  // 書き込んだ内容をStateに保存する
  const docId = pathlib.basename(docPath);
  const data = createData(docId, fields);
  saveDoc(dispatch, docPath, data);

  if (subCollection === undefined) {
    // subCollectionがなければ終了
    onSet();
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
            );
          }),
      ),
    )
      .then(onSet)
      .catch(onError);
  }
};

export function addDoc(
  collectionPath: string,
  query: SetDocQueryObject,
  onSet: () => void,
  onError: (error: any) => void,
) {
  const { firestoreDB, dispatch } = getContext();
  const { fields, id, subCollection } = query;

  try {
    const ref = firestoreDB.collection(collectionPath);
    if (id !== undefined) {
      ref
        .doc(id)
        .set(fields)
        .then(() =>
          setDocCallback(
            dispatch,
            onSet,
            onError,
            pathlib.resolve(collectionPath, id),
            fields,
            subCollection,
          ),
        )
        .catch(err => onError(err));
    } else {
      ref
        .add(fields)
        .then(doc =>
          setDocCallback(
            dispatch,
            onSet,
            onError,
            pathlib.resolve(collectionPath, doc.id),
            fields,
            subCollection,
          ),
        )
        .catch(err => onError(err));
    }
  } catch (err) {
    onError(err);
  }
}

export function setDoc(
  docPath: string,
  query: SetDocQueryObject,
  onSet: () => void,
  onError: (error: any) => void,
  option?: {
    merge?: boolean;
    mergeFields?: string[];
  },
) {
  const { firestoreDB, dispatch } = getContext();
  const { fields, subCollection } = query;

  try {
    const promise =
      option !== undefined
        ? firestoreDB.doc(docPath).set(fields, option)
        : firestoreDB.doc(docPath).set(fields);
    promise
      .then(() => {
        setDocCallback(dispatch, onSet, onError, docPath, fields, subCollection);
      })
      .catch(onError);
  } catch (err) {
    onError(err);
  }
}
// subCollectionを扱わない
export function updateDoc(
  docPath: string,
  query: SetDocQueryObject,
  onUpdate: () => void,
  onError: (error: any) => void,
) {
  const { firestoreDB, dispatch } = getContext();
  const { fields } = query;

  try {
    const ref = firestoreDB.doc(docPath);
    ref
      .update(fields)
      .then(() => {
        setDocCallback(dispatch, onUpdate, onError, docPath, fields);
      })
      .catch(err => onError(err));
  } catch (err) {
    onError(err);
  }
}
/**
 * ```js
 * queries: [
 *  {
 *    id: ...,
 *    fields: { ... },
 *  },
 *  {
 *    fields: { ... },
 *    subCollection: { ... }
 *  }
 * ]
 * ```
 */
export function setCollection(
  collectionPath: string,
  queries: SetCollectionQueryObject,
  onSet: () => void,
  onError: (error: any) => void,
  option?: {
    merge?: boolean;
    mergeFields?: string[];
  },
) {
  Promise.all(
    queries.map(
      query =>
        new Promise((resolve, reject) => {
          const { id } = query;
          if (id !== undefined) {
            const docPath = pathlib.resolve(collectionPath, id);
            setDoc(docPath, query, resolve, reject, option);
          } else {
            addDoc(collectionPath, query, resolve, reject);
          }
        }),
    ),
  )
    .then(onSet)
    .catch(onError);
}
