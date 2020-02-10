"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var firebase_1 = require("firebase");
var advancedHooks = __importStar(require("./advancedHooks"));
var getHooks = __importStar(require("./getHooks"));
var provider = __importStar(require("./provider"));
var setHooks = __importStar(require("./setHooks"));
var utils = __importStar(require("./utils"));
exports.deleteField = firebase_1.firestore.FieldValue.delete();
exports.convertStateToJson = provider.convertStateToJson;
exports.Provider = provider.default;
exports.Context = provider.Context;
exports.getContext = provider.getContext;
exports.getHashCode = utils.getHashCode;
exports.createDataFromDoc = utils.createDataFromDoc;
exports.createDataFromCollection = utils.createDataFromCollection;
exports.getQueryId = utils.getQueryId;
exports.useLazyGetDocSnapshot = getHooks.useLazyGetDocSnapshot;
exports.useGetDocSnapshot = getHooks.useGetDocSnapshot;
exports.useSubscribeDocSnapshot = getHooks.useSubscribeDocSnapshot;
exports.useLazyGetCollectionSnapshot = getHooks.useLazyGetCollectionSnapshot;
exports.useGetCollectionSnapshot = getHooks.useGetCollectionSnapshot;
exports.useSubscribeCollectionSnapshot = getHooks.useSubscribeCollectionSnapshot;
exports.useLazyGetDoc = getHooks.useLazyGetDoc;
exports.useGetDoc = getHooks.useGetDoc;
exports.useSubscribeDoc = getHooks.useSubscribeDoc;
exports.useLazyGetCollection = getHooks.useLazyGetCollection;
exports.useGetCollection = getHooks.useGetCollection;
exports.useSubscribeCollection = getHooks.useSubscribeCollection;
exports.useSetDoc = setHooks.useSetDoc;
exports.useUpdateDoc = setHooks.useUpdateDoc;
exports.useSetDocs = setHooks.useSetDocs;
exports.useUpdateDocs = setHooks.useUpdateDocs;
exports.useSetCollection = setHooks.useSetCollection;
exports.useArrayQuery = advancedHooks.useArrayQuery;
exports.useQuery = advancedHooks.useQuery;
exports.usePaginateCollection = advancedHooks.usePaginateCollection;
exports.useGetSubCollection = advancedHooks.useGetSubCollection;