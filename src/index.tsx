import { Map, List, Set, fromJS } from "immutable";
import { firestore } from "firebase";
import * as reducer from "./reducer";
import * as provider from "./provider";
import * as hooks from "./hooks";
import * as advancedHooks from "./advancedHooks";
import * as fetchFunctions from "./fetchFunctions";

export type HooksId = string;
export type DocId = string;
export type CollectionId = number;
export type FireclientDoc = {
  data: {
    [field: string]: any;
  } | null;
  id: string | null;
};

interface ImmutableMap<T> extends Map<string, any> {
  get<K extends keyof T>(name: K): T[K];
}

export type FireclientDocState = ImmutableMap<{
  snapshot: firestore.DocumentSnapshot;
  connectedFrom: Set<HooksId>;
}>;

export type FireclientCollectionState = ImmutableMap<{
  docIds: List<string>;
  connectedFrom: Set<HooksId>;
}>;

export type FireclientState = ImmutableMap<{
  doc: ImmutableMap<{
    [docId: string]: FireclientDocState;
  }>;
  collection: ImmutableMap<{
    [collectionId: string]: FireclientCollectionState;
  }>;
}>;
/**
 * @example
 * where: {
 *    field: "population",
 *    operator: ">",
 *    value: 15000000
 * }
 */
export type Where = {
  field: string;
  operator: firestore.WhereFilterOp;
  value: string;
};
/**
 * @example
 * limit: 150
 */
export type Limit = number;

export type OrderDirection = "asc" | "desc";
/**
 * @example
 * cursor: {
 *    origin: "population",
 *    direction: "startAt"
 * }
 */
export type Order = {
  by: string;
  direction?: OrderDirection;
};
export type CursorDirection = "startAt" | "startAfter" | "endAt" | "endBefore";
/**
 * @example
 * cursor: {
 *    origin: "population",
 *    direction: "startAt"
 * }
 */
export type Cursor = {
  origin: any;
  direction: CursorDirection;
  multipleFields?: boolean;
};
/**
 * @example
 * {
 *    where: { ... },
 *    limit: 10,
 *    order: { ... },
 *    cursor: { ... },
 * }
 * @property {Where?}  where   - Filters collection by doc's field.
 * @property {Limit?}  limit   - Limits the number of fetching docs.
 * @property {Order?}  order   - Defines the order of docs.
 * @property {Cursor?} cursor  - Defines the start and end point.
 */
export type QueryOption = {
  /**
   * @example
   * where: {
   *    field: "population",
   *    operator: ">",
   *    value: 15000000
   * }
   */
  where?: Where | [Where];
  /**
   * @example
   * limit: 150
   */
  limit?: Limit;
  /**
   * @example
   * order: {
   *    by: "population",
   *    direction: "desc" // optional
   * }
   */
  order?: Order | [Order];
  /**
   * @example
   * cursor: {
   *    origin: "population",
   *    direction: "startAt"
   * }
   */
  cursor?: Cursor;
};

/**
 * @example
 * {
 *    location: /doc/path/in/firestore,
 *    connects: true,
 *    where: { ... },
 *    limit: 15,
 *    order: { ... },
 *    cursor: { ... },
 * }
 * @property {string} location  - Where doc or collection is in firestore.
 * @property {string?} connects - Whether doc or collection is to be subscribed.
 * @property {Where?}  where    - Filters collection by doc's field.
 * @property {Limit?}  limit    - Limits the number of fetching docs.
 * @property {Order?}  order    - Defines the order of docs.
 * @property {Cursor?} cursor   - Defines the start and end point.
 */
export type Query = {
  location: string;
  connects?: boolean;
} & QueryOption;
/**
 * @example
 * {
 *    connects: true,
 *    queries: {
 *      foo: {
 *        location: 'doc/path/in/firestore',
 *        connects: false
 *      },
 *      bar: {
 *        location: 'collection/path/in/firestore',
 *        where: { ... }
 *      }
 *    }
 * }
 *
 * @property {string?} connects               - Whether doc or collection is to be subscribed.
 *                                              This is applied to all queries unless query has `connects` property.
 * @property { { [string]: Query } } queries  - Query property with arbitrary name.
 * @property {boolean}  acceptOutdated        - Whether if non-subscribed cache is used.
 * @property {()=>void} callback              - This is excecuted after fetching from Firestore or getting cache.
 */
export type QuerySchema = {
  connects?: boolean;
  queries: { [field: string]: Query };
  acceptOutdated?: boolean;
  callback?: () => void;
};
/**
 * @example
 * {
 *    connects: true,
 *    queries: [
 *      {
 *        location: 'doc/path/in/firestore',
 *        connects: false
 *      },
 *      {
 *        location: 'collection/path/in/firestore',
 *        where: { ... }
 *      }
 *    ]
 * }
 *
 * @property {string?}  connects        - Whether doc or collection is to be subscribed.
 *                                        This is applied to all queries unless query has `connects` property.
 * @property {Query[]}  queries         - Query array.
 * @property {boolean}  acceptOutdated  - Whether if non-subscribed cache is used.
 * @property {()=>void} callback        - This is excecuted after fetching from Firestore or getting cache.
 */
export type ArrayQuerySchema = {
  connects?: boolean;
  queries: Query[];
  acceptOutdated?: boolean;
  callback?: () => void;
};

export type ProviderContext = {
  state: FireclientState | null;
  dispatch: React.Dispatch<reducer.Actions> | null;
  firestoreDB: firestore.Firestore | null;
};
/**
 * Converts Firestore document snapshot into `FireclientDoc`.
 * @param {firestore.DocumentData} doc
 * @example
 * const [snapshot] = useGetDocSnapshot("/path/to/doc");
 * const docData = createDataFromDoc(snapshot);
 */
export function createDataFromDoc(doc: firestore.DocumentData): FireclientDoc {
  return {
    data: doc.data(),
    id: doc.id
  };
}
/**
 * Converts Firestore collection snapshot into `FireclientDoc[]`.
 * @param {firestore.DocumentData} doc
 * @example
 * const [snapshot] = useGetCollectionSnapshot("/path/to/collection");
 * const collectionData = createDataFromCollection(snapshot);
 */
export function createDataFromCollection(
  collection: firestore.DocumentSnapshot[]
): FireclientDoc[] {
  return collection.map(coll => createDataFromDoc(coll));
}

export const convertStateToJson = provider.convertStateToJson;
export const Provider = provider.default;
export const Context = provider.Context;

export const getQueryId = fetchFunctions.getQueryId;

export const useLazyGetDocSnapshot = hooks.useLazyGetDocSnapshot;
export const useGetDocSnapshot = hooks.useGetDocSnapshot;
export const useSubscribeDocSnapshot = hooks.useSubscribeDocSnapshot;

export const useLazyGetCollectionSnapshot = hooks.useLazyGetCollectionSnapshot;
export const useGetCollectionSnapshot = hooks.useGetCollectionSnapshot;
export const useSubscribeCollectionSnapshot =
  hooks.useSubscribeCollectionSnapshot;

export const useLazyGetDoc = hooks.useLazyGetDoc;
export const useGetDoc = hooks.useGetDoc;
export const useSubscribeDoc = hooks.useSubscribeDoc;

export const useLazyGetCollection = hooks.useLazyGetCollection;
export const useGetCollection = hooks.useGetCollection;
export const useSubscribeCollection = hooks.useSubscribeCollection;

export const useArrayQuery = advancedHooks.useArrayQuery;
export const useQuery = advancedHooks.useQuery;
export const usePaginateCollection = advancedHooks.usePaginateCollection;
export const useGetSubCollection = advancedHooks.useGetSubCollection;
