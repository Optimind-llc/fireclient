import { firestore } from "firebase";
import { List, Seq } from "immutable";
import pathlib from "path";
import { CollectionId, Cursor, DocId, HooksId, Limit, Order, QueryOptions, Where } from ".";
import { CollectionData, DocData, FireclientState } from "./";
import { Actions } from "./reducer";
import { assert } from "./typeCheck";

function sortedFromJS(object: any): any {
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
          .map(sortedFromJS)
          .filter((v: any) => v !== undefined)
          .toList()
      : Seq(object)
          .map(sortedFromJS)
          .filter((v: any) => v !== undefined)
          .toOrderedMap()
          .sortBy((v: any, k: any) => k);
  }
}

export const generateHooksId = (): HooksId =>
  Math.random()
    .toString(32)
    .substring(2);

export const getHashCode = (obj: any): number =>
  obj === undefined ? sortedFromJS({}).hashCode() : sortedFromJS(obj).hashCode();

export const getQueryId = (path: string, options: QueryOptions = {}): CollectionId => {
  const optionsId = getHashCode(options);
  return path + `:${optionsId}`;
};

const findLastColonIndex = (s: string): number =>
  s.split("").reduce((acc, val, i) => (acc = val === ":" ? i : acc), -1);

export const getCollectionPathFromId = (collectionId: CollectionId): string =>
  collectionId.slice(0, findLastColonIndex(collectionId));

export const searchCollectionId = (
  collectionPath: string,
  state: FireclientState,
): CollectionId[] =>
  Array.from(
    state
      .get("collection")
      .filter((id: CollectionId) => id.startsWith(collectionPath))
      .keys(),
  );

const withoutDot = (s: string): boolean => s !== ".";
const withoutEmpty = (s: string): boolean => s.length > 0;
const computeLevel = (acc: number, s: string): number => (s === ".." ? acc - 1 : acc + 1);

export const isDocPath = (path: string): boolean => {
  const depth = pathlib
    .normalize(path)
    .split(pathlib.sep)
    .filter(withoutDot)
    .filter(withoutEmpty)
    .reduce(computeLevel, 0);
  return depth % 2 === 0;
};

export const createData = (id: string, fields: { [fields: string]: any }): DocData => ({
  data: fields,
  id,
});
/**
 * Converts Firestore document snapshot into `DocData`.
 * @param {firestore.DocumentData} doc
 * @example
 * const [snapshot] = useGetDocSnapshot("/path/to/doc");
 * const docData = createDataFromDoc(snapshot);
 */
export const createDataFromDoc = (doc: firestore.DocumentData): DocData => {
  const { id } = doc;
  const data = doc.data();
  return createData(id, data !== undefined ? data : null);
};
/**
 * Converts Firestore collection snapshot into `CollectionData`.
 * @param {firestore.DocumentData} doc
 * @example
 * const [snapshot] = useGetCollectionSnapshot("/path/to/collection");
 * const collectionData = createDataFromCollection(snapshot);
 */
export const createDataFromCollection = (
  collection: firestore.DocumentSnapshot[],
): CollectionData => collection.map(coll => createDataFromDoc(coll));

// stateにdocのデータを保存
export const saveDoc = (dispatch: React.Dispatch<Actions>, docPath: string, doc: DocData): void =>
  dispatch({
    type: "setDoc",
    payload: {
      docId: pathlib.resolve(docPath),
      data: doc,
    },
  });

// state.collectionに対象のdocのIdを保存, state.docに各データを保存
export const saveCollection = (
  dispatch: React.Dispatch<Actions>,
  collectionPath: string,
  options: QueryOptions,
  collection: CollectionData,
): void => {
  collection.forEach(doc => {
    if (doc.id === null) {
      return;
    }
    saveDoc(dispatch, pathlib.resolve(collectionPath, doc.id), doc);
  });
  const collectionId = getQueryId(collectionPath, options);
  const docIds = List(
    collection
      .filter(doc => doc.id !== null)
      .map(doc => pathlib.resolve(collectionPath, doc.id as string)),
  );
  dispatch({
    type: "setCollection",
    payload: {
      collectionId,
      docIds,
    },
  });
};

export const deleteDocFromState = (dispatch: React.Dispatch<Actions>, docPath: string): void =>
  dispatch({
    type: "deleteDoc",
    payload: {
      docId: pathlib.resolve(docPath),
    },
  });

export const deleteCollectionFromState = (
  dispatch: React.Dispatch<Actions>,
  collectionPath: string,
): void =>
  dispatch({
    type: "deleteCollection",
    payload: {
      collectionId: getQueryId(collectionPath),
    },
  });

// state.docにsubscribe元を登録
export const connectDocToState = (
  dispatch: React.Dispatch<Actions>,
  docId: DocId,
  uuid: HooksId,
): void =>
  dispatch({
    type: "connectDoc",
    payload: {
      docId,
      uuid,
    },
  });

// state.collectionと各state.docにsubscribe元を登録
export const connectCollectionToState = (
  dispatch: React.Dispatch<Actions>,
  collectionId: CollectionId,
  uuid: HooksId,
  docIds: List<DocId>,
): void => {
  dispatch({
    type: "connectCollection",
    payload: {
      collectionId,
      uuid,
    },
  });
  docIds.forEach(docId => connectDocToState(dispatch, docId, uuid));
};

// state.docからsubscribe元を削除
export const disconnectDocFromState = (
  dispatch: React.Dispatch<Actions>,
  docId: DocId,
  uuid: HooksId,
): void =>
  dispatch({
    type: "disconnectDoc",
    payload: {
      docId,
      uuid,
    },
  });

// state.collectionと各state.docからsubscribe元を削除
export const disconnectCollectionFromState = (
  dispatch: React.Dispatch<Actions>,
  collectionId: CollectionId,
  uuid: HooksId,
  docIds: List<DocId>,
): void => {
  dispatch({
    type: "disconnectCollection",
    payload: {
      collectionId,
      uuid,
    },
  });
  docIds.forEach(docId => disconnectDocFromState(dispatch, docId, uuid));
};

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
    !_multipleFields || Array.isArray(origin),
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
  { where, limit, order, cursor }: QueryOptions,
): firestore.Query {
  const optionFn: {
    fn: (ref: firestore.Query, options: any) => firestore.Query;
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
