import * as pathlib from "path";
import { SetCollectionSchemaObject, StaticSetFql } from ".";
import { getContext } from "./provider";
import { Actions } from "./reducer";
import { createData, isDocPath, saveDoc } from "./utils";

type Fields = { [field: string]: any };
type SubCollection = {
  [name: string]: SetCollectionSchemaObject;
};

// 書き込み完了時のCallback
const setDocCallback = (
  dispatch: React.Dispatch<Actions>,
  onSet: () => void,
  onError: (error: any) => void,
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
      .catch(err => {
        console.error(err);
        onError(err);
      });
  }
};

export function addDoc(
  path: string,
  query: StaticSetFql,
  onSet: () => void,
  onError: (error: any) => void,
) {
  const { firestoreDB, dispatch } = getContext();
  const { id, subCollection } = query;
  const fields = query.fields !== undefined ? query.fields : {};

  const isDoc = isDocPath(path);
  const idExists = id !== undefined;

  try {
    if (isDoc) {
      // doc path が渡された時
      const ref = firestoreDB.doc(path);
      ref
        .set(fields)
        .then(() => setDocCallback(dispatch, onSet, onError, path, fields, subCollection))
        .catch(err => {
          console.error(err);
          onError(err);
        });
    } else if (idExists) {
      // collection path と id が渡された時
      const docPath = pathlib.resolve(path, id!);
      const ref = firestoreDB.doc(docPath);
      ref
        .set(fields)
        .then(() => setDocCallback(dispatch, onSet, onError, path, fields, subCollection))
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

export function setDoc(
  docPath: string,
  query: StaticSetFql,
  onSet: () => void,
  onError: (error: any) => void,
  options?: {
    merge?: boolean;
    mergeFields?: string[];
  },
) {
  const { firestoreDB, dispatch } = getContext();
  const { subCollection } = query;

  const fields = query.fields !== undefined ? query.fields : {};

  try {
    const promise =
      options !== undefined
        ? firestoreDB.doc(docPath).set(fields, options)
        : firestoreDB.doc(docPath).set(fields);
    promise
      .then(() => {
        setDocCallback(dispatch, onSet, onError, docPath, fields, subCollection);
      })
      .catch(err => {
        console.error(err);
        onError(err);
      });
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
) {
  const { firestoreDB, dispatch } = getContext();
  const fields = query.fields !== undefined ? query.fields : {};

  try {
    const ref = firestoreDB.doc(docPath);
    ref
      .update(fields)
      .then(() => {
        setDocCallback(dispatch, onUpdate, onError, docPath, fields);
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
  queries: SetCollectionSchemaObject,
  onSet: () => void,
  onError: (error: any) => void,
  options?: {
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
            setDoc(docPath, query, resolve, reject, options);
          } else {
            addDoc(collectionPath, query, resolve, reject);
          }
        }),
    ),
  )
    .then(onSet)
    .catch(err => {
      console.error(err);
      onError(err);
    });
}
