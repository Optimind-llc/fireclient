"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var advancedHooks = __importStar(require("./advancedHooks"));
var fetchFunctions = __importStar(require("./fetchFunctions"));
var hooks = __importStar(require("./hooks"));
var provider = __importStar(require("./provider"));
/**
 * Converts Firestore document snapshot into `FireclientDoc`.
 * @param {firestore.DocumentData} doc
 * @example
 * const [snapshot] = useGetDocSnapshot("/path/to/doc");
 * const docData = createDataFromDoc(snapshot);
 */
function createDataFromDoc(doc) {
    var id = doc.id;
    var data = doc.data();
    return {
        data: data !== undefined ? data : null,
        id: id,
    };
}
exports.createDataFromDoc = createDataFromDoc;
/**
 * Converts Firestore collection snapshot into `FireclientDoc[]`.
 * @param {firestore.DocumentData} doc
 * @example
 * const [snapshot] = useGetCollectionSnapshot("/path/to/collection");
 * const collectionData = createDataFromCollection(snapshot);
 */
function createDataFromCollection(collection) {
    return collection.map(function (coll) { return createDataFromDoc(coll); });
}
exports.createDataFromCollection = createDataFromCollection;
exports.convertStateToJson = provider.convertStateToJson;
exports.Provider = provider.default;
exports.Context = provider.Context;
exports.getQueryId = fetchFunctions.getQueryId;
exports.useLazyGetDocSnapshot = hooks.useLazyGetDocSnapshot;
exports.useGetDocSnapshot = hooks.useGetDocSnapshot;
exports.useSubscribeDocSnapshot = hooks.useSubscribeDocSnapshot;
exports.useLazyGetCollectionSnapshot = hooks.useLazyGetCollectionSnapshot;
exports.useGetCollectionSnapshot = hooks.useGetCollectionSnapshot;
exports.useSubscribeCollectionSnapshot = hooks.useSubscribeCollectionSnapshot;
exports.useLazyGetDoc = hooks.useLazyGetDoc;
exports.useGetDoc = hooks.useGetDoc;
exports.useSubscribeDoc = hooks.useSubscribeDoc;
exports.useLazyGetCollection = hooks.useLazyGetCollection;
exports.useGetCollection = hooks.useGetCollection;
exports.useSubscribeCollection = hooks.useSubscribeCollection;
exports.useArrayQuery = advancedHooks.useArrayQuery;
exports.useQuery = advancedHooks.useQuery;
exports.usePaginateCollection = advancedHooks.usePaginateCollection;
exports.useGetSubCollection = advancedHooks.useGetSubCollection;
