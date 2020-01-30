/// <reference types="react" />
import { firestore } from "firebase";
import { List, Map, Set } from "immutable";
import * as advancedHooks from "./advancedHooks";
import * as getHooks from "./getHooks";
import * as setHooks from "./setHooks";
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
export declare type DocState = ImmutableMap<{
    data: DocData;
    connectedFrom: Set<HooksId>;
}>;
export declare type CollectionState = ImmutableMap<{
    docIds: List<string>;
    connectedFrom: Set<HooksId>;
}>;
export declare type FireclientState = ImmutableMap<{
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
export declare type QueryOptions = {
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
export declare type Query = {
    location: string;
    connects?: boolean;
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
 * @property {string} location  - Where doc or collection is in firestore.
 * @property {string?} connects - Whether doc or collection is to be subscribed.
 * @property {Where?}  where    - Filters collection by doc's field.
 * @property {Limit?}  limit    - Limits the number of fetching docs.
 * @property {Order?}  order    - Defines the order of docs.
 * @property {Cursor?} cursor   - Defines the start and end point.
 */
export declare type ObjectQuery = {
    [field: string]: {
        location: string;
        connects?: boolean;
    } & QueryOptions;
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
 * @property {string} location  - Where doc or collection is in firestore.
 * @property {string?} connects - Whether doc or collection is to be subscribed.
 * @property {Where?}  where    - Filters collection by doc's field.
 * @property {Limit?}  limit    - Limits the number of fetching docs.
 * @property {Order?}  order    - Defines the order of docs.
 * @property {Cursor?} cursor   - Defines the start and end point.
 */
export declare type ArrayQuery = ({
    location: string;
    connects?: boolean;
} & QueryOptions)[];
/**
 * @example
 * {
 *    connects: true,
 *    queries:
 * }
 *
 * @property {string?} connects               - Whether doc or collection is to be subscribed.
 *                                              This is applied to all queries unless query has `connects` property.
 * @property { { [string]: Query } } queries  - Query property with arbitrary name.
 * @property {boolean}  acceptOutdated        - Whether if non-subscribed cache is used.
 * @property {()=>void} callback              - This is excecuted after fetching from Firestore or getting cache.
 */
export declare type GetFql<QueryType> = {
    connects?: boolean;
    queries: QueryType;
    acceptOutdated?: boolean;
    callback?: () => void;
};
export declare type StaticSetFql = {
    id?: string;
    fields?: {
        [field: string]: any;
    };
    subCollection?: {
        [name: string]: SetCollectionSchemaObject;
    };
};
export declare type DynamicSetFql = (...args: any) => StaticSetFql;
export declare type SetFql = StaticSetFql | DynamicSetFql;
export declare type SetCollectionSchemaObject = StaticSetFql[];
export declare type SetCollectionSchemaGenerator = (...args: any) => SetCollectionSchemaObject;
export declare type SetCollectionSchema = SetCollectionSchemaObject | SetCollectionSchemaGenerator;
export declare type ProviderContext = {
    state: FireclientState | null;
    dispatch: React.Dispatch<reducer.Actions> | null;
    firestoreDB: firestore.Firestore | null;
    onAccess: () => void;
};
export declare const deleteField: firestore.FieldValue;
export declare const convertStateToJson: typeof provider.convertStateToJson;
export declare const Provider: typeof provider.default;
export declare const Context: import("react").Context<any>;
export declare const getHashCode: typeof utils.getHashCode;
export declare const createDataFromDoc: typeof utils.createDataFromDoc;
export declare const createDataFromCollection: typeof utils.createDataFromCollection;
export declare const getQueryId: typeof utils.getQueryId;
export declare const useLazyGetDocSnapshot: typeof getHooks.useLazyGetDocSnapshot;
export declare const useGetDocSnapshot: typeof getHooks.useGetDocSnapshot;
export declare const useSubscribeDocSnapshot: typeof getHooks.useSubscribeDocSnapshot;
export declare const useLazyGetCollectionSnapshot: typeof getHooks.useLazyGetCollectionSnapshot;
export declare const useGetCollectionSnapshot: typeof getHooks.useGetCollectionSnapshot;
export declare const useSubscribeCollectionSnapshot: typeof getHooks.useSubscribeCollectionSnapshot;
export declare const useLazyGetDoc: typeof getHooks.useLazyGetDoc;
export declare const useGetDoc: typeof getHooks.useGetDoc;
export declare const useSubscribeDoc: typeof getHooks.useSubscribeDoc;
export declare const useLazyGetCollection: typeof getHooks.useLazyGetCollection;
export declare const useGetCollection: typeof getHooks.useGetCollection;
export declare const useSubscribeCollection: typeof getHooks.useSubscribeCollection;
export declare const useSetDoc: typeof setHooks.useSetDoc;
export declare const useAddDoc: typeof setHooks.useAddDoc;
export declare const useUpdateDoc: typeof setHooks.useUpdateDoc;
export declare const useSetDocs: typeof setHooks.useSetDocs;
export declare const useAddDocs: typeof setHooks.useAddDocs;
export declare const useUpdateDocs: typeof setHooks.useUpdateDocs;
export declare const useSetCollection: typeof setHooks.useSetCollection;
export declare const useArrayQuery: typeof advancedHooks.useArrayQuery;
export declare const useQuery: typeof advancedHooks.useQuery;
export declare const usePaginateCollection: typeof advancedHooks.usePaginateCollection;
export declare const useGetSubCollection: typeof advancedHooks.useGetSubCollection;
export {};
