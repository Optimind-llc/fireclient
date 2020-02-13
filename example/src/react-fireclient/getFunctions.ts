import { firestore } from "firebase";
import { List } from "immutable";
import * as pathlib from "path";
import { CollectionData, DocData, HooksId, QueryOptions } from ".";
import { getContext } from "./provider";
import {
  connectCollectionToState,
  connectDocToState,
  createDataFromCollection,
  createDataFromDoc,
  disconnectCollectionFromState,
  disconnectDocFromState,
  getQueryId,
  saveCollection,
  saveDoc,
  withOption,
} from "./utils";

export function getDocSnapshot(
  path: string,
  onGet: (doc: firestore.DocumentSnapshot) => void,
  onError: (err: Error) => void,
  saveToState = true,
): void {
  const docId = pathlib.resolve(path);
  const { dispatch, firestoreDB, onAccess } = getContext();

  try {
    onAccess();
    const ref = firestoreDB.doc(path);
    ref
      .get()
      .then(doc => {
        if (saveToState) saveDoc(dispatch, docId, createDataFromDoc(doc));
        onGet(doc);
      })
      .catch(err => {
        console.error(err);
        onError(err);
      });
  } catch (err) {
    console.error(err);
    onError(err);
  }
}

export function getDoc(
  path: string,
  onGet: (doc: DocData) => void,
  onError: (err: Error) => void,
  saveToState?: boolean,
  acceptOutdated = false,
): void {
  const docId = pathlib.resolve(path);
  const { state } = getContext();

  // state内でsubscribeされているかチェック
  const cache = state.get("doc").get(docId);
  if (cache !== undefined && (acceptOutdated || cache?.get("connectedFrom")?.size > 0)) {
    const docCache = cache.get("data");
    onGet(docCache);
    return;
  }

  getDocSnapshot(path, doc => onGet(createDataFromDoc(doc)), onError, saveToState);
}

export function subscribeDocSnapshot(
  uuid: HooksId,
  path: string,
  onChange: (doc: firestore.DocumentSnapshot) => void,
  onError: (err: Error) => void,
  onListen: () => void = (): void => {
    /* do nothing */
  },
  saveToState = true,
): () => void {
  const docId = pathlib.resolve(path);
  const { dispatch, firestoreDB, onAccess } = getContext();

  try {
    onAccess();
    const ref = firestoreDB.doc(path);
    const unsubscribe = ref.onSnapshot(
      doc => {
        onListen();
        if (saveToState) {
          saveDoc(dispatch, docId, createDataFromDoc(doc));
          connectDocToState(dispatch, docId, uuid);
        }
        onChange(doc);
      },
      err => {
        console.log(err);
        onError(err);
      },
    );
    return (): void => {
      unsubscribe();
      disconnectDocFromState(dispatch, docId, uuid);
    };
  } catch (err) {
    console.error(err);
    onError(err);
    return (): void => {
      /* do nothing */
    };
  }
}

export function subscribeDoc(
  uuid: HooksId,
  path: string,
  onChange: (doc: DocData) => void,
  onError: (err: Error) => void,
  onListen: () => void = (): void => {
    /* do nothing */
  },
  saveToState?: boolean,
): () => void {
  return subscribeDocSnapshot(
    uuid,
    path,
    (doc: firestore.DocumentSnapshot) => onChange(createDataFromDoc(doc)),
    onError,
    onListen,
    saveToState,
  );
}

export function getCollectionSnapshot(
  path: string,
  onGet: (collection: firestore.DocumentSnapshot[]) => void,
  onError: (err: Error) => void,
  options: QueryOptions = {},
  saveToState = true,
): void {
  const { dispatch, firestoreDB, onAccess } = getContext();
  try {
    onAccess();
    const ref = withOption(firestoreDB.collection(path), options);
    ref
      .get()
      .then(collection => {
        if (saveToState)
          saveCollection(dispatch, path, options, createDataFromCollection(collection.docs));
        onGet(collection.docs);
      })
      .catch(err => {
        console.error(err);
        onError(err);
      });
  } catch (err) {
    console.error(err);
    onError(err);
  }
}

export function getCollection(
  path: string,
  onGet: (collection: CollectionData) => void,
  onError: (err: Error) => void,
  options: QueryOptions = {},
  saveToState?: boolean,
  acceptOutdated = false,
): void {
  const collectionId = getQueryId(path, options);
  const { state } = getContext();

  // state内でsubscribeされているかチェック
  const cache = state.get("collection").get(collectionId);
  if (cache !== undefined && (acceptOutdated || cache?.get("connectedFrom")?.size > 0)) {
    const docIds = cache.get("docIds").map(id => pathlib.resolve(path, id));
    const collectionCache: CollectionData = docIds
      .map(docId =>
        state
          .get("doc")
          .get(docId)
          .get("data"),
      )
      .toJS();
    onGet(collectionCache);
    return;
  }

  getCollectionSnapshot(
    path,
    collection => onGet(createDataFromCollection(collection)),
    onError,
    options,
    saveToState,
  );
}

export function subscribeCollectionSnapshot(
  uuid: HooksId,
  path: string,
  onChange: (collection: firestore.DocumentSnapshot[]) => void,
  onError: (err: Error) => void,
  onListen: () => void = (): void => {
    /* do nothing */
  },
  options: QueryOptions = {},
  saveToState = true,
): () => void {
  const collectionId = getQueryId(path, options);
  const { dispatch, firestoreDB, onAccess } = getContext();
  let docIds = List<string>();

  try {
    onAccess();
    const ref = withOption(firestoreDB.collection(path), options);
    const unsubscribe = ref.onSnapshot(
      collection => {
        onListen();
        // docIdsを更新
        // 対象から外れたdocをunsubscribeする
        const nextDocIds = List(collection.docs.map(doc => pathlib.resolve(path, doc.id)));
        const decreased = docIds.filter(id => nextDocIds.indexOf(id) === -1);
        decreased.forEach(docId => disconnectDocFromState(dispatch, docId, uuid));
        docIds = nextDocIds;

        if (saveToState) {
          saveCollection(dispatch, path, options, createDataFromCollection(collection.docs));
          connectCollectionToState(dispatch, collectionId, uuid, docIds);
        }
        onChange(collection.docs);
      },
      err => {
        console.error(err);
        onError(err);
      },
    );
    return (): void => {
      unsubscribe();
      disconnectCollectionFromState(dispatch, collectionId, uuid, docIds);
    };
  } catch (err) {
    console.error(err);
    onError(err);
    return (): void => {
      /* do nothing */
    };
  }
}

export function subscribeCollection(
  uuid: HooksId,
  path: string,
  onChange: (collection: CollectionData) => void,
  onError: (err: Error) => void,
  onListen: () => void = (): void => {
    /* do nothing */
  },
  options: QueryOptions = {},
  saveToState?: boolean,
): () => void {
  return subscribeCollectionSnapshot(
    uuid,
    path,
    collection => onChange(createDataFromCollection(collection)),
    onError,
    onListen,
    options,
    saveToState,
  );
}
