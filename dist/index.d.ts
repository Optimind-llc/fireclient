/// <reference types="react" />
import { firestore } from "firebase";
import { List, Map, Set } from "immutable";
import * as advancedHooks from "./advancedHooks";
import * as hooks from "./hooks";
import * as provider from "./provider";
import * as reducer from "./reducer";
import * as utils from "./utils";
export declare type HooksId = string;
export declare type DocId = string;
export declare type CollectionId = number;
export declare type DocData = {
    data: {
        [field: string]: any;
    } | null;
    id: string | null;
};
export declare type CollectionData = DocData[];
interface ImmutableMap<T> extends Map<string, any> {
    get<K extends keyof T>(name: K): T[K];
}
export declare type DocDataState = ImmutableMap<{
    data: DocData;
    connectedFrom: Set<HooksId>;
}>;
export declare type FireclientCollectionState = ImmutableMap<{
    docIds: List<string>;
    connectedFrom: Set<HooksId>;
}>;
export declare type FireclientState = ImmutableMap<{
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
export declare type Where = {
    field: string;
    operator: firestore.WhereFilterOp;
    value: string;
};
/**
 * @example
 * limit: 150
 */
export declare type Limit = number;
export declare type OrderDirection = "asc" | "desc";
/**
 * @example
 * cursor: {
 *    origin: "population",
 *    direction: "startAt"
 * }
 */
export declare type Order = {
    by: string;
    direction?: OrderDirection;
};
export declare type CursorDirection = "startAt" | "startAfter" | "endAt" | "endBefore";
/**
 * @example
 * cursor: {
 *    origin: "population",
 *    direction: "startAt"
 * }
 */
export declare type Cursor = {
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
export declare type QueryOption = {
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
export declare type Query = {
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
export declare type QuerySchema = {
    connects?: boolean;
    queries: {
        [field: string]: Query;
    };
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
export declare type ArrayQuerySchema = {
    connects?: boolean;
    queries: Query[];
    acceptOutdated?: boolean;
    callback?: () => void;
};
export declare type SetDocQueryObject = {
    id?: string;
    fields: {
        [field: string]: any;
    };
    subCollection: {
        [name: string]: SetDocQueryObject;
    };
};
export declare type SetDocQueryGenerator = (...args: any) => SetDocQueryObject;
export declare type SetDocQuery = SetDocQueryObject | SetDocQueryGenerator;
export declare type ProviderContext = {
    state: FireclientState | null;
    dispatch: React.Dispatch<reducer.Actions> | null;
    firestoreDB: firestore.Firestore | null;
};
export declare const deleteField: firestore.FieldValue;
export declare const convertStateToJson: typeof provider.convertStateToJson;
export declare const Provider: typeof provider.default;
export declare const Context: import("react").Context<any>;
export declare const getHashCode: typeof utils.getHashCode;
export declare const createDataFromDoc: typeof utils.createDataFromDoc;
export declare const createDataFromCollection: typeof utils.createDataFromCollection;
export declare const getQueryId: typeof utils.getQueryId;
export declare const useLazyGetDocSnapshot: typeof hooks.useLazyGetDocSnapshot;
export declare const useGetDocSnapshot: typeof hooks.useGetDocSnapshot;
export declare const useSubscribeDocSnapshot: typeof hooks.useSubscribeDocSnapshot;
export declare const useLazyGetCollectionSnapshot: typeof hooks.useLazyGetCollectionSnapshot;
export declare const useGetCollectionSnapshot: typeof hooks.useGetCollectionSnapshot;
export declare const useSubscribeCollectionSnapshot: typeof hooks.useSubscribeCollectionSnapshot;
export declare const useLazyGetDoc: typeof hooks.useLazyGetDoc;
export declare const useGetDoc: typeof hooks.useGetDoc;
export declare const useSubscribeDoc: typeof hooks.useSubscribeDoc;
export declare const useLazyGetCollection: typeof hooks.useLazyGetCollection;
export declare const useGetCollection: typeof hooks.useGetCollection;
export declare const useSubscribeCollection: typeof hooks.useSubscribeCollection;
export declare const useArrayQuery: typeof advancedHooks.useArrayQuery;
export declare const useQuery: typeof advancedHooks.useQuery;
export declare const usePaginateCollection: typeof advancedHooks.usePaginateCollection;
export declare const useGetSubCollection: typeof advancedHooks.useGetSubCollection;
export declare const useSetDoc: typeof hooks.useSetDoc;
export declare const useAddDoc: typeof hooks.useAddDoc;
export declare const useUpdateDoc: typeof hooks.useUpdateDoc;
export {};
