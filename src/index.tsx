import { firestore } from "firebase";
import { List, Map, Set } from "immutable";
import * as advancedHooks from "./advancedHooks";
import * as hooks from "./hooks";
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

export type SetDocQueryObject = {
  id?: string;
  fields: {
    [field: string]: any;
  };
  subCollection: {
    [name: string]: SetDocQueryObject;
  };
};
export type SetDocQueryGenerator = (...args: any) => SetDocQueryObject;
export type SetDocQuery = SetDocQueryObject | SetDocQueryGenerator;

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

export const useLazyGetDocSnapshot = hooks.useLazyGetDocSnapshot;
export const useGetDocSnapshot = hooks.useGetDocSnapshot;
export const useSubscribeDocSnapshot = hooks.useSubscribeDocSnapshot;

export const useLazyGetCollectionSnapshot = hooks.useLazyGetCollectionSnapshot;
export const useGetCollectionSnapshot = hooks.useGetCollectionSnapshot;
export const useSubscribeCollectionSnapshot = hooks.useSubscribeCollectionSnapshot;

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

export const useSetDoc = hooks.useSetDoc;
export const useAddDoc = hooks.useAddDoc;
export const useUpdateDoc = hooks.useUpdateDoc;
