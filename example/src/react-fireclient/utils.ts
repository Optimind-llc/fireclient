import { firestore } from "firebase";
import { List, Seq } from "immutable";
import pathlib from "path";
import { CollectionId, Cursor, DocId, HooksId, Limit, Order, QueryOption, Where } from ".";
import { CollectionData, DocData } from "./";
import { Actions } from "./reducer";
import { assert } from "./validation";

function orderedFromJS(object: any): any {
  // CursorでOriginにSnapshotを指定することがある
  if (object instanceof firestore.DocumentSnapshot) {
    return object.ref.path;
  }
  // callbackなど、FunctionをOptionに渡すことがある
  if (object instanceof Function) {
    return object.toString();
  }
  if (typeof object !== "object" || object === null) {
    return object;
  } else {
    return Array.isArray(object)
      ? Seq(object)
          .map(orderedFromJS)
          .filter((v: any) => v !== undefined)
          .toList()
      : Seq(object)
          .map(orderedFromJS)
          .filter((v: any) => v !== undefined)
          .toOrderedMap();
  }
}

export function getHashCode(obj: any): number {
  if (obj === undefined) {
    return orderedFromJS({}).hashCode();
  } else {
    return orderedFromJS(obj).hashCode();
  }
}

export function getQueryId(path: string, option: QueryOption): CollectionId {
  return getHashCode({
    path: pathlib.resolve(path),
    option,
  });
}

export function isDocPath(path: string): boolean {
  const p = pathlib.resolve(path);
  return p.split("/").length % 2 === 1;
}
export function createData(id: string, fields: { [fields: string]: any }): DocData {
  return {
    data: fields,
    id,
  };
}
/**
 * Converts Firestore document snapshot into `DocData`.
 * @param {firestore.DocumentData} doc
 * @example
 * const [snapshot] = useGetDocSnapshot("/path/to/doc");
 * const docData = createDataFromDoc(snapshot);
 */
export function createDataFromDoc(doc: firestore.DocumentData): DocData {
  const { id } = doc;
  const data = doc.data();
  return createData(id, data !== undefined ? data : null);
}
/**
 * Converts Firestore collection snapshot into `CollectionData`.
 * @param {firestore.DocumentData} doc
 * @example
 * const [snapshot] = useGetCollectionSnapshot("/path/to/collection");
 * const collectionData = createDataFromCollection(snapshot);
 */
export function createDataFromCollection(collection: firestore.DocumentSnapshot[]): CollectionData {
  return collection.map(coll => createDataFromDoc(coll));
}

// stateにdocのデータを保存
export function saveDoc(dispatch: React.Dispatch<Actions>, docId: DocId, doc: DocData) {
  dispatch({
    type: "setDoc",
    payload: {
      docId,
      data: doc,
    },
  });
}

// state.collectionに対象のdocのIdを保存, state.docに各データを保存
export function saveCollection(
  dispatch: React.Dispatch<Actions>,
  path: string,
  option: QueryOption,
  collection: CollectionData,
) {
  collection.forEach(doc => {
    if (doc.id === null) {
      return;
    }
    saveDoc(dispatch, pathlib.resolve(path, doc.id), doc);
  });
  const collectionId = getQueryId(path, option);
  const docIds = List(
    collection.filter(doc => doc.id !== null).map(doc => pathlib.resolve(path, doc.id as string)),
  );
  dispatch({
    type: "setCollection",
    payload: {
      collectionId,
      docIds,
    },
  });
}

// state.docにsubscribe元を登録
export function connectDocToState(dispatch: React.Dispatch<Actions>, docId: DocId, uuid: HooksId) {
  dispatch({
    type: "connectDoc",
    payload: {
      docId,
      uuid,
    },
  });
}
// state.collectionと各state.docにsubscribe元を登録
export function connectCollectionToState(
  dispatch: React.Dispatch<Actions>,
  collectionId: CollectionId,
  uuid: HooksId,
  docIds: List<DocId>,
) {
  dispatch({
    type: "connectCollection",
    payload: {
      collectionId,
      uuid,
    },
  });
  docIds.forEach(docId => connectDocToState(dispatch, docId, uuid));
}

// state.docからsubscribe元を削除
export function disconnectDocFromState(
  dispatch: React.Dispatch<Actions>,
  docId: DocId,
  uuid: HooksId,
) {
  dispatch({
    type: "disconnectDoc",
    payload: {
      docId,
      uuid,
    },
  });
}
// state.collectionと各state.docからsubscribe元を削除
export function disconnectCollectionFromState(
  dispatch: React.Dispatch<Actions>,
  collectionId: CollectionId,
  uuid: HooksId,
  docIds: List<DocId>,
) {
  dispatch({
    type: "disconnectCollection",
    payload: {
      collectionId,
      uuid,
    },
  });
  docIds.forEach(docId => disconnectDocFromState(dispatch, docId, uuid));
}

function withWhere(ref: firestore.Query, where: Where | [Where]): firestore.Query {
  if (Array.isArray(where)) {
    return (where as [Where]).reduce((acc, cond) => withWhere(acc, cond), ref);
  }

  if (where === undefined) {
    return ref;
  }

  const { field, operator, value } = where as Where;

  return ref.where(field, operator, value);
}

function withLimit(ref: firestore.Query, limit: Limit): firestore.Query {
  return limit === undefined ? ref : ref.limit(limit);
}

function withOrder(ref: firestore.Query, order: Order | [Order]): firestore.Query {
  if (Array.isArray(order)) {
    return (order as [Order]).reduce((acc, ord) => {
      return withOrder(acc, ord);
    }, ref);
  }

  if (order === undefined) {
    return ref;
  }

  const { by, direction } = order as Order;

  return direction === undefined ? ref.orderBy(by) : ref.orderBy(by, direction);
}

function withCursor(ref: firestore.Query, cursor: Cursor): firestore.Query {
  if (cursor === undefined) {
    return ref;
  }

  const { direction, origin, multipleFields } = cursor;
  const _multipleFields = multipleFields !== undefined ? multipleFields : false;
  assert(
    !_multipleFields || origin instanceof Array,
    '"origin" should be array if "multipleFields" is true.',
  );

  if (!_multipleFields) {
    switch (direction) {
      case "startAt":
        return ref.startAt(origin);
      case "startAfter":
        return ref.startAfter(origin);
      case "endAt":
        return ref.endAt(origin);
      case "endBefore":
        return ref.endBefore(origin);
      default:
        throw new Error(
          'Query cursor.direction should be any of "startAt" / "startAfter" / "endAt" / "endBefore"',
        );
    }
  } else {
    switch (direction) {
      case "startAt":
        return ref.startAt(...origin);
      case "startAfter":
        return ref.startAfter(...origin);
      case "endAt":
        return ref.endAt(...origin);
      case "endBefore":
        return ref.endBefore(...origin);
      default:
        throw new Error(
          'Query cursor.direction should be any of "startAt" / "startAfter" / "endAt" / "endBefore"',
        );
    }
  }
}

export function withOption(
  ref: firestore.CollectionReference,
  { where, limit, order, cursor }: QueryOption,
): firestore.Query {
  const optionFn: {
    fn: (ref: firestore.Query, option: any) => firestore.Query;
    param: Where | Where[] | Limit | Order | Order[] | Cursor | undefined;
  }[] = [
    { fn: withWhere, param: where },
    { fn: withOrder, param: order },
    { fn: withCursor, param: cursor },
    { fn: withLimit, param: limit },
  ];
  return optionFn.reduce((acc, { fn, param }): any => {
    return fn(acc, param);
  }, ref);
}
