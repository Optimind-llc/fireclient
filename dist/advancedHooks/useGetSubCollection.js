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
exports.useGetSubCollection = void 0;
var pathlib = __importStar(require("path"));
var useGetCollection_1 = require("../getHooks/useGetCollection");
var typeCheck = __importStar(require("../typeCheck"));
var useQuery_1 = require("./useQuery");
var assertRule = typeCheck.assertRule;
function useGetSubCollection(path, subCollectionName, options) {
    // Arg typeCheck
    assertRule([
        { key: "path", fn: typeCheck.isString },
        { key: "subCollectionName", fn: typeCheck.isString },
        {
            key: "options",
            fn: typeCheck.matches(typeCheck.subCollectionOptionRule),
        },
    ])({ path: path, subCollectionName: subCollectionName, options: options }, "Argument");
    var _a = useGetCollection_1.useGetCollection(path, options), collection = _a[0], collLoading = _a[1], collError = _a[2], collReloadFn = _a[3];
    var docIds = collection.filter(function (doc) { return doc.id !== null; }).map(function (doc) { return doc.id; });
    var fql = {
        callback: options === null || options === void 0 ? void 0 : options.callback,
        queries: docIds.map(function (docId) { return ({ location: pathlib.resolve(path, docId, subCollectionName) }); }),
    };
    var _b = useQuery_1.useArrayQuery(fql), subCollection = _b[0], subCollLoading = _b[1], subCollError = _b[2], subCollReloadFn = _b[3];
    var flatten = Array.prototype.concat.apply([], subCollection);
    var loading = collLoading || subCollLoading;
    var error = collError !== null ? collError : subCollError;
    return [
        flatten,
        loading,
        error,
        function () {
            collReloadFn();
            subCollReloadFn.reload();
        },
    ];
}
exports.useGetSubCollection = useGetSubCollection;
