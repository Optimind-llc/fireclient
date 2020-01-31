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
  onError: (err: any) => void,
) {
  const docId = pathlib.resolve(path);
  const { dispatch, firestoreDB, onAccess } = getContext();

  try {
    onAccess();
    const ref = firestoreDB.doc(path);
    ref
      .get()
      .then(doc => {
        saveDoc(dispatch, docId, createDataFromDoc(doc));
        onGet(doc);
      })
      .catch(err => {
        console.error(err);
        onError(err);
      });
  } catch (err) {
    onError(err);
  }
}

export function getDoc(
  path: string,
  onGet: (doc: DocData) => void,
  onError: (err: any) => void,
  acceptOutdated = false,
) {
  const docId = pathlib.resolve(path);
  const { state } = getContext();

  // state内でsubscribeされているかチェック
  const cache = state.get("doc").get(docId);
  if (cache !== undefined && (acceptOutdated || cache?.get("connectedFrom")?.size > 0)) {
    const docCache = cache.get("data");
    onGet(docCache);
    return;
  }

  getDocSnapshot(path, doc => onGet(createDataFromDoc(doc)), onError);
}

export function subscribeDocSnapshot(
  uuid: HooksId,
  path: string,
  onChange: (doc: firestore.DocumentSnapshot) => void,
  onError: (err: any) => void,
  onListen: () => void = () => {},
): () => void {
  const docId = pathlib.resolve(path);
  const { dispatch, firestoreDB, onAccess } = getContext();

  try {
    onAccess();
    const ref = firestoreDB.doc(path);
    const unsubscribe = ref.onSnapshot(doc => {
      onListen();
      saveDoc(dispatch, docId, createDataFromDoc(doc));
      connectDocToState(dispatch, docId, uuid);
      onChange(doc);
    }, onError);
    return () => {
      unsubscribe();
      disconnectDocFromState(dispatch, docId, uuid);
    };
  } catch (err) {
    onError(err);
    return () => {};
  }
}

export function subscribeDoc(
  uuid: HooksId,
  path: string,
  onChange: (doc: DocData) => void,
  onError: (err: any) => void,
  onListen: () => void = () => {},
): () => void {
  return subscribeDocSnapshot(
    uuid,
    path,
    (doc: firestore.DocumentSnapshot) => onChange(createDataFromDoc(doc)),
    onError,
    onListen,
  );
}

export function getCollectionSnapshot(
  path: string,
  onGet: (collection: firestore.DocumentSnapshot[]) => void,
  onError: (err: any) => void,
  options: QueryOptions = {},
  acceptOutdated = false,
): void {
  const { dispatch, firestoreDB, onAccess } = getContext();

  try {
    onAccess();
    const ref = withOption(firestoreDB.collection(path), options);
    ref
      .get()
      .then(collection => {
        saveCollection(dispatch, path, options, createDataFromCollection(collection.docs));
        onGet(collection.docs);
      })
      .catch(err => {
        console.error(err);
        onError(err);
      });
  } catch (err) {
    onError(err);
  }
}

export function getCollection(
  path: string,
  onGet: (collection: CollectionData) => void,
  onError: (err: any) => void,
  options: QueryOptions = {},
  acceptOutdated = false,
): void {
  const collectionId = getQueryId(path, options);
  const { state } = getContext();

  // state内でsubscribeされているかチェック
  const cache = state.get("collection").get(collectionId);
  if (cache !== undefined && (acceptOutdated || cache?.get("connectedFrom")?.size > 0)) {
    const docIds = cache.get("docIds").map(id => pathlib.resolve(path, id!));
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
  );
}

export function subscribeCollectionSnapshot(
  uuid: HooksId,
  path: string,
  onChange: (collection: firestore.DocumentSnapshot[]) => void,
  onError: (err: any) => void,
  onListen: () => void = () => {},
  options: QueryOptions = {},
): () => void {
  const collectionId = getQueryId(path, options);
  const { dispatch, firestoreDB, onAccess } = getContext();
  let docIds = List<string>();

  try {
    onAccess();
    const ref = withOption(firestoreDB.collection(path), options);
    const unsubscribe = ref.onSnapshot(collection => {
      onListen();
      // docIdsを更新
      // 対象から外れたdocをunsubscribeする
      const nextDocIds = List(collection.docs.map(doc => pathlib.resolve(path, doc.id)));
      const decreased = docIds.filter(id => nextDocIds.indexOf(id) === -1);
      decreased.forEach(docId => disconnectDocFromState(dispatch, docId, uuid));
      docIds = nextDocIds;

      saveCollection(dispatch, path, options, createDataFromCollection(collection.docs));
      connectCollectionToState(dispatch, collectionId, uuid, docIds);
      onChange(collection.docs);
    }, onError);
    return () => {
      unsubscribe();
      disconnectCollectionFromState(dispatch, collectionId, uuid, docIds);
    };
  } catch (err) {
    onError(err);
    return () => {};
  }
}

export function subscribeCollection(
  uuid: HooksId,
  path: string,
  onChange: (collection: CollectionData) => void,
  onError: (err: any) => void,
  onListen: () => void = () => {},
  options: QueryOptions = {},
): () => void {
  return subscribeCollectionSnapshot(
    uuid,
    path,
    collection => onChange(createDataFromCollection(collection)),
    onError,
    onListen,
    options,
  );
}
