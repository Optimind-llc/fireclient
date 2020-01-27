import { firestore } from "firebase";
import { List, Map, Set } from "immutable";
import * as advancedHooks from "./advancedHooks";
import * as getHooks from "./getHooks";
import * as setHooks from "./setHooks";
import * as provider from "./provider";
import * as reducer from "./reducer";
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

export type DocDataState = ImmutableMap<{
  data: DocData;
  connectedFrom: Set<HooksId>;
}>;

export type FireclientCollectionState = ImmutableMap<{
  docIds: List<string>;
  connectedFrom: Set<HooksId>;
}>;

export type FireclientState = ImmutableMap<{
  doc: ImmutableMap<{
    [docId: string]: DocDataState;
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

export type SetDocQueryObject = {
  id?: string;
  fields?: {
    [field: string]: any;
  };
  subCollection?: {
    [name: string]: SetCollectionQueryObject;
  };
};
export type SetDocQueryGenerator = (...args: any) => SetDocQueryObject;
export type SetDocQuery = SetDocQueryObject | SetDocQueryGenerator;

export type SetCollectionQueryObject = SetDocQueryObject[];
export type SetCollectionQueryGenerator = (...args: any) => SetCollectionQueryObject;
export type SetCollectionQuery = SetCollectionQueryObject | SetCollectionQueryGenerator;

export type ProviderContext = {
  state: FireclientState | null;
  dispatch: React.Dispatch<reducer.Actions> | null;
  firestoreDB: firestore.Firestore | null;
};

export const deleteField = firestore.FieldValue.delete();

export const convertStateToJson = provider.convertStateToJson;
export const Provider = provider.default;
export const Context = provider.Context;

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
export const useAddDoc = setHooks.useAddDoc;
export const useUpdateDoc = setHooks.useUpdateDoc;
export const useSetDocs = setHooks.useSetDocs;
export const useAddDocs = setHooks.useAddDocs;
export const useUpdateDocs = setHooks.useUpdateDocs;
export const useSetCollection = setHooks.useSetCollection;

export const useArrayQuery = advancedHooks.useArrayQuery;
export const useQuery = advancedHooks.useQuery;
export const usePaginateCollection = advancedHooks.usePaginateCollection;
export const useGetSubCollection = advancedHooks.useGetSubCollection;
