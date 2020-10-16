"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetSubCollection = exports.usePaginateCollection = exports.useQuery = exports.useArrayQuery = exports.useDeleteDocs = exports.useDeleteDoc = exports.useSetCollection = exports.useUpdateDocs = exports.useSetDocs = exports.useUpdateDoc = exports.useSetDoc = exports.useSubscribeCollection = exports.useSubscribeCollectionSnapshot = exports.useSubscribeDoc = exports.useSubscribeDocSnapshot = exports.useGetCollectionSnapshot = exports.useLazyGetCollectionSnapshot = exports.useGetCollection = exports.useLazyGetCollection = exports.useGetDoc = exports.useLazyGetDoc = exports.useGetDocSnapshot = exports.useLazyGetDocSnapshot = exports.getQueryId = exports.createDataFromCollection = exports.createDataFromDoc = exports.getHashCode = exports.getContext = exports.Context = exports.FireclientProvider = exports.convertStateToJson = exports.deleteField = exports.initialCollectionData = exports.initialDocData = void 0;
var firebase_1 = require("firebase");
var _useGetSubCollection = __importStar(require("./advancedHooks/useGetSubCollection"));
var _usePaginateCollection = __importStar(require("./advancedHooks/usePaginateCollection"));
var _useQuery = __importStar(require("./advancedHooks/useQuery"));
var _useGetCollection = __importStar(require("./getHooks/useGetCollection"));
var _useGetDoc = __importStar(require("./getHooks/useGetDoc"));
var _useSubscribeCollection = __importStar(require("./getHooks/useSubscribeCollection"));
var _useSubscribeDoc = __importStar(require("./getHooks/useSubscribeDoc"));
var provider = __importStar(require("./provider"));
var _useSetCollection = __importStar(require("./setHooks/useSetCollection"));
var _useSetDoc = __importStar(require("./setHooks/useSetDoc"));
var _useSetDocs = __importStar(require("./setHooks/useSetDocs"));
var _useDeleteDoc = __importStar(require("./setHooks/useDeleteDoc"));
var utils = __importStar(require("./utils"));
exports.initialDocData = {
    data: null,
    id: null,
};
exports.initialCollectionData = [];
exports.deleteField = firebase_1.firestore.FieldValue.delete();
exports.convertStateToJson = provider.convertStateToJson;
exports.FireclientProvider = provider.default;
exports.Context = provider.Context;
exports.getContext = provider.getContext;
exports.getHashCode = utils.getHashCode;
exports.createDataFromDoc = utils.createDataFromDoc;
exports.createDataFromCollection = utils.createDataFromCollection;
exports.getQueryId = utils.getQueryId;
exports.useLazyGetDocSnapshot = _useGetDoc.useLazyGetDocSnapshot;
exports.useGetDocSnapshot = _useGetDoc.useGetDocSnapshot;
exports.useLazyGetDoc = _useGetDoc.useLazyGetDoc;
exports.useGetDoc = _useGetDoc.useGetDoc;
exports.useLazyGetCollection = _useGetCollection.useLazyGetCollection;
exports.useGetCollection = _useGetCollection.useGetCollection;
exports.useLazyGetCollectionSnapshot = _useGetCollection.useLazyGetCollectionSnapshot;
exports.useGetCollectionSnapshot = _useGetCollection.useGetCollectionSnapshot;
exports.useSubscribeDocSnapshot = _useSubscribeDoc.useSubscribeDocSnapshot;
exports.useSubscribeDoc = _useSubscribeDoc.useSubscribeDoc;
exports.useSubscribeCollectionSnapshot = _useSubscribeCollection.useSubscribeCollectionSnapshot;
exports.useSubscribeCollection = _useSubscribeCollection.useSubscribeCollection;
exports.useSetDoc = _useSetDoc.useSetDoc;
exports.useUpdateDoc = _useSetDoc.useUpdateDoc;
exports.useSetDocs = _useSetDocs.useSetDocs;
exports.useUpdateDocs = _useSetDocs.useUpdateDocs;
exports.useSetCollection = _useSetCollection.useSetCollection;
exports.useDeleteDoc = _useDeleteDoc.useDeleteDoc;
exports.useDeleteDocs = _useDeleteDoc.useDeleteDocs;
exports.useArrayQuery = _useQuery.useArrayQuery;
exports.useQuery = _useQuery.useQuery;
exports.usePaginateCollection = _usePaginateCollection.usePaginateCollection;
exports.useGetSubCollection = _useGetSubCollection.useGetSubCollection;
