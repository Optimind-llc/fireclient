/// <reference types="react" />
import { firestore } from "firebase";
import { List, Map, Set } from "immutable";
import * as _useGetSubCollection from "./advancedHooks/useGetSubCollection";
import * as _usePaginateCollection from "./advancedHooks/usePaginateCollection";
import * as _useQuery from "./advancedHooks/useQuery";
import * as _useGetCollection from "./getHooks/useGetCollection";
import * as _useGetDoc from "./getHooks/useGetDoc";
import * as _useSubscribeCollection from "./getHooks/useSubscribeCollection";
import * as _useSubscribeDoc from "./getHooks/useSubscribeDoc";
import * as provider from "./provider";
import * as reducer from "./reducer";
import * as _useSetCollection from "./setHooks/useSetCollection";
import * as _useSetDoc from "./setHooks/useSetDoc";
import * as _useSetDocs from "./setHooks/useSetDocs";
import * as _useDeleteDoc from "./setHooks/useDeleteDoc";
export declare type HooksId = string;
export declare type DocId = string;
export declare type CollectionId = string;
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
    value: any;
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
 * @property {string} location                              - Where doc or collection is in firestore.
 * @property {string?} connects                             - Whether doc or collection is to be subscribed.
 * @property {boolean} acceptOutdated                       - Whether un-connected cache is to be used.
 * @property {(DocData | CollectionData) => void} callback  - This is excecuted after fetching from Firestore or getting cache.
 * @property {Where?}  where                                - Filters collection by doc's field.
 * @property {Limit?}  limit                                - Limits the number of fetching docs.
 * @property {Order?}  order                                - Defines the order of docs.
 * @property {Cursor?} cursor                               - Defines the start and end point.
 */
export declare type Query = {
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
export declare type ObjectQuery = {
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
export declare type ArrayQuery = Query[];
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
export declare type GetFql<QueryType> = {
    connects?: boolean;
    queries: QueryType;
    acceptOutdated?: boolean;
    callback?: (data: DocData | CollectionData) => void;
};
export declare type StaticSetFql = {
    id?: string;
    fields?: {
        [field: string]: any;
    };
    subCollection?: {
        [name: string]: StaticSetCollectionFql;
    };
};
export declare type DynamicSetFql = (...args: any[]) => StaticSetFql;
export declare type SetFql = StaticSetFql | DynamicSetFql;
export declare type StaticSetCollectionFql = StaticSetFql[];
export declare type SetCollectionFql = SetFql[];
export declare type ProviderContext = {
    state: FireclientState | null;
    dispatch: React.Dispatch<reducer.Actions> | null;
    firestoreDB: firestore.Firestore | null;
    onAccess: () => void;
};
export declare const initialDocData: DocData;
export declare const initialCollectionData: CollectionData;
export declare const deleteField: firestore.FieldValue;
export declare const convertStateToJson: typeof provider.convertStateToJson;
export declare const FireclientProvider: typeof provider.default;
export declare const Context: import("react").Context<any>;
export declare const getContext: typeof provider.getContext;
export declare const getHashCode: (obj: any) => number;
export declare const createDataFromDoc: (doc: firestore.DocumentData) => DocData;
export declare const createDataFromCollection: (collection: firestore.DocumentSnapshot<firestore.DocumentData>[]) => CollectionData;
export declare const getQueryId: (collectionPath: string, options?: QueryOptions) => string;
export declare const useLazyGetDocSnapshot: typeof _useGetDoc.useLazyGetDocSnapshot;
export declare const useGetDocSnapshot: typeof _useGetDoc.useGetDocSnapshot;
export declare const useLazyGetDoc: typeof _useGetDoc.useLazyGetDoc;
export declare const useGetDoc: typeof _useGetDoc.useGetDoc;
export declare const useLazyGetCollection: typeof _useGetCollection.useLazyGetCollection;
export declare const useGetCollection: typeof _useGetCollection.useGetCollection;
export declare const useLazyGetCollectionSnapshot: typeof _useGetCollection.useLazyGetCollectionSnapshot;
export declare const useGetCollectionSnapshot: typeof _useGetCollection.useGetCollectionSnapshot;
export declare const useSubscribeDocSnapshot: typeof _useSubscribeDoc.useSubscribeDocSnapshot;
export declare const useSubscribeDoc: typeof _useSubscribeDoc.useSubscribeDoc;
export declare const useSubscribeCollectionSnapshot: typeof _useSubscribeCollection.useSubscribeCollectionSnapshot;
export declare const useSubscribeCollection: typeof _useSubscribeCollection.useSubscribeCollection;
export declare const useSetDoc: typeof _useSetDoc.useSetDoc;
export declare const useUpdateDoc: typeof _useSetDoc.useUpdateDoc;
export declare const useSetDocs: typeof _useSetDocs.useSetDocs;
export declare const useUpdateDocs: typeof _useSetDocs.useUpdateDocs;
export declare const useSetCollection: typeof _useSetCollection.useSetCollection;
export declare const useDeleteDoc: typeof _useDeleteDoc.useDeleteDoc;
export declare const useDeleteDocs: typeof _useDeleteDoc.useDeleteDocs;
export declare const useArrayQuery: typeof _useQuery.useArrayQuery;
export declare const useQuery: typeof _useQuery.useQuery;
export declare const usePaginateCollection: typeof _usePaginateCollection.usePaginateCollection;
export declare const useGetSubCollection: typeof _useGetSubCollection.useGetSubCollection;
export {};
