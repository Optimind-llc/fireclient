import * as pathlib from "path";
import { StaticSetCollectionFql, StaticSetFql } from ".";
import { getContext } from "./provider";
import { Actions } from "./reducer";
import { createData, isDocPath, saveDoc } from "./utils";

type Fields = { [field: string]: any };
type SubCollection = {
  [name: string]: StaticSetCollectionFql;
};

// 書き込み完了時のCallback
const setDocCallback = (
  dispatch: React.Dispatch<Actions>,
  onSet: () => void,
  onError: (error: any) => void,
  docPath: string,
  fields: Fields,
  options?: {
    merge?: boolean;
    mergeFields?: string[];
    saveToState?: boolean;
  },
  subCollection?: SubCollection,
) => {
  // 書き込んだ内容をStateに保存する
  // options.saveToState can be undefined
  if (options?.saveToState !== false) {
    const docId = pathlib.basename(docPath);
    const data = createData(docId, fields);
    saveDoc(dispatch, docPath, data);
  }

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
              options,
            );
          }),
      ),
    )
      .then(onSet)
      .catch(err => {
        console.error(err);
        onError(err);
      });
  }
};

export function setDoc(
  path: string,
  query: StaticSetFql,
  onSet: () => void,
  onError: (error: any) => void,
  options: {
    merge?: boolean;
    mergeFields?: string[];
    saveToState?: boolean;
  } = {},
) {
  const { firestoreDB, dispatch, onAccess } = getContext();
  const { id, subCollection } = query;
  const { merge, mergeFields } = options;

  const fields = query.fields !== undefined ? query.fields : {};

  const isDoc = isDocPath(path);
  const idExists = id !== undefined;

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
    } else if (idExists) {
      // collection path と id が渡された時
      const docPath = pathlib.resolve(path, id!);
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
          ),
        )
        .catch(err => {
          console.error(err);
          onError(err);
        });
    }
  } catch (err) {
    onError(err);
  }
}
// subCollectionを扱わない
export function updateDoc(
  docPath: string,
  query: StaticSetFql,
  onUpdate: () => void,
  onError: (error: any) => void,
  options?: {
    saveToState?: boolean;
  },
) {
  const { firestoreDB, dispatch, onAccess } = getContext();
  const fields = query.fields !== undefined ? query.fields : {};

  try {
    onAccess();
    const ref = firestoreDB.doc(docPath);
    ref
      .update(fields)
      .then(() => {
        setDocCallback(dispatch, onUpdate, onError, docPath, fields, options);
      })
      .catch(err => {
        console.error(err);
        onError(err);
      });
  } catch (err) {
    onError(err);
  }
}
/**
 * ```js
 * [
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
  queries: StaticSetCollectionFql,
  onSet: () => void,
  onError: (error: any) => void,
  options?: {
    merge?: boolean;
    mergeFields?: string[];
    saveToState?: boolean;
  },
) {
  Promise.all(
    queries.map(
      query =>
        new Promise((resolve, reject) => {
          const { id } = query;
          const path = id !== undefined ? pathlib.resolve(collectionPath, id) : collectionPath;
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
