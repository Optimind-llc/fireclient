import { firestore } from "firebase";
import { List, Map, Set } from "immutable";
import * as advancedHooks from "./advancedHooks";
import * as getHooks from "./getHooks";
import * as provider from "./provider";
import * as reducer from "./reducer";
import * as setHooks from "./setHooks";
import * as utils from "./utils";

export type HooksId = string;
export type DocId = string;
export type CollectionId = number;
export type DocData = {
  data: {
    [field: string]: any;
  } | null;
  id: string | null;
};
export type CollectionData = DocData[];

interface ImmutableMap<T> extends Map<string, any> {
  get<K extends keyof T>(name: K): T[K];
}

export type DocState = ImmutableMap<{
  data: DocData;
  connectedFrom: Set<HooksId>;
}>;

export type CollectionState = ImmutableMap<{
  docIds: List<string>;
  connectedFrom: Set<HooksId>;
}>;

export type FireclientState = ImmutableMap<{
  doc: ImmutableMap<{
    [docId: string]: DocState;
  }>;
  collection: ImmutableMap<{
    [collectionId: string]: CollectionState;
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
export type QueryOptions = {
  /**
   * @example
   * where: {
   *    field: "population",
   *    operator: ">",
   *    value: 15000000
   * }
   */
  where?: Where | Where[];
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
  order?: Order | Order[];
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
 * @property {string} location                              - Where doc or collection is in firestore.
 * @property {string?} connects                             - Whether doc or collection is to be subscribed.
 * @property {boolean} acceptOutdated                       - Whether un-connected cache is to be used.
 * @property {(DocData | CollectionData) => void} callback  - This is excecuted after fetching from Firestore or getting cache.
 * @property {Where?}  where                                - Filters collection by doc's field.
 * @property {Limit?}  limit                                - Limits the number of fetching docs.
 * @property {Order?}  order                                - Defines the order of docs.
 * @property {Cursor?} cursor                               - Defines the start and end point.
 */
export type Query = {
  location: string;
  connects?: boolean;
  acceptOutdated?: boolean;
  callback?: (data: DocData | CollectionData) => void;
} & QueryOptions;
/**
 * @example
 * {
 *    foo: {
 *      location: 'doc/path/in/firestore',
 *      limit: 15,
 *      connects: true
 *    },
 *    bar: {
 *      location: 'collection/path/in/firestore',
 *      where: { ... },
 *      order: { ... },
 *    }
 * }
 * @property {string} location        - Where doc or collection is in firestore.
 * @property {string?} connects       - Whether doc or collection is to be subscribed.
 * @property {boolean} acceptOutdated - Whether un-connected cache is to be used.
 * @property {Where?}  where          - Filters collection by doc's field.
 * @property {Limit?}  limit          - Limits the number of fetching docs.
 * @property {Order?}  order          - Defines the order of docs.
 * @property {Cursor?} cursor         - Defines the start and end point.
 */
export type ObjectQuery = {
  [field: string]: Query;
};
/**
 * @example
 * [
 *    {
 *      location: 'doc/path/in/firestore',
 *      limit: 15,
 *      connects: true
 *    },
 *    {
 *      location: 'collection/path/in/firestore',
 *      where: { ... },
 *      order: { ... },
 *    }
 * ]
 * @property {string} location        - Where doc or collection is in firestore.
 * @property {string?} connects       - Whether doc or collection is to be subscribed.
 * @property {boolean} acceptOutdated - Whether un-connected cache is to be used.
 * @property {Where?}  where          - Filters collection by doc's field.
 * @property {Limit?}  limit          - Limits the number of fetching docs.
 * @property {Order?}  order          - Defines the order of docs.
 * @property {Cursor?} cursor         - Defines the start and end point.
 */
export type ArrayQuery = Query[];
/**
 * @example
 * {
 *    connects: true,
 *    queries:
 * }
 *
 * @property {string?} connects                                 - Whether doc or collection is to be subscribed.
 *                                                                This is applied to all queries unless query has `connects` property.
 * @property { { [string]: Query } } queries                    - Query property with arbitrary name.
 * @property {boolean}  acceptOutdated                          - Whether if non-subscribed cache is used.
 * @property {(data: DocData | CollectionData)=>void} callback  - This is excecuted after fetching from Firestore or getting cache.
 */
export type GetFql<QueryType> = {
  connects?: boolean;
  queries: QueryType;
  acceptOutdated?: boolean;
  callback?: (data: DocData | CollectionData) => void;
};
export type StaticSetFql = {
  id?: string;
  fields?: {
    [field: string]: any;
  };
  subCollection?: {
    [name: string]: StaticSetCollectionFql;
  };
};
export type DynamicSetFql = (...args: any[]) => StaticSetFql;
export type SetFql = StaticSetFql | DynamicSetFql;

export type StaticSetCollectionFql = StaticSetFql[];
export type SetCollectionFql = SetFql[];

export type ProviderContext = {
  state: FireclientState | null;
  dispatch: React.Dispatch<reducer.Actions> | null;
  firestoreDB: firestore.Firestore | null;
  onAccess: () => void;
};

export const deleteField = firestore.FieldValue.delete();

export const convertStateToJson = provider.convertStateToJson;
export const Provider = provider.default;
export const Context = provider.Context;
export const getContext = provider.getContext;

export const getHashCode = utils.getHashCode;
export const createDataFromDoc = utils.createDataFromDoc;
export const createDataFromCollection = utils.createDataFromCollection;

export const getQueryId = utils.getQueryId;

export const useLazyGetDocSnapshot = getHooks.useLazyGetDocSnapshot;
export const useGetDocSnapshot = getHooks.useGetDocSnapshot;
export const useSubscribeDocSnapshot = getHooks.useSubscribeDocSnapshot;
export const useLazyGetCollectionSnapshot = getHooks.useLazyGetCollectionSnapshot;
export const useGetCollectionSnapshot = getHooks.useGetCollectionSnapshot;
export const useSubscribeCollectionSnapshot = getHooks.useSubscribeCollectionSnapshot;
export const useLazyGetDoc = getHooks.useLazyGetDoc;
export const useGetDoc = getHooks.useGetDoc;
export const useSubscribeDoc = getHooks.useSubscribeDoc;
export const useLazyGetCollection = getHooks.useLazyGetCollection;
export const useGetCollection = getHooks.useGetCollection;
export const useSubscribeCollection = getHooks.useSubscribeCollection;

export const useSetDoc = setHooks.useSetDoc;
export const useUpdateDoc = setHooks.useUpdateDoc;
export const useSetDocs = setHooks.useSetDocs;
export const useUpdateDocs = setHooks.useUpdateDocs;
export const useSetCollection = setHooks.useSetCollection;

export const useArrayQuery = advancedHooks.useArrayQuery;
export const useQuery = advancedHooks.useQuery;
export const usePaginateCollection = advancedHooks.usePaginateCollection;
export const useGetSubCollection = advancedHooks.useGetSubCollection;
