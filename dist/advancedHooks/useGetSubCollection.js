"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var pathlib = __importStar(require("path"));
var useGetCollection_1 = require("../getHooks/useGetCollection");
var typeCheck = __importStar(require("../typeCheck"));
var useQuery_1 = require("./useQuery");
var assertRule = typeCheck.assertRule;
function useGetSubCollection(path, subCollectionName, options) {
    var _a;
    // Arg typeCheck
    assertRule([
        { key: "path", fn: typeCheck.isString },
        { key: "subCollectionName", fn: typeCheck.isString },
        {
            key: "options",
            fn: typeCheck.matches(typeCheck.subCollectionOptionRule),
        },
    ])({ path: path, subCollectionName: subCollectionName, options: options }, "Argument");
    var _b = useGetCollection_1.useGetCollection(path, options), collection = _b[0], collLoading = _b[1], collError = _b[2], collReloadFn = _b[3];
    var docIds = collection.filter(function (doc) { return doc.id !== null; }).map(function (doc) { return doc.id; });
    var fql = {
        callback: (_a = options) === null || _a === void 0 ? void 0 : _a.callback,
        queries: docIds.map(function (docId) { return ({ location: pathlib.resolve(path, docId, subCollectionName) }); }),
    };
    var _c = useQuery_1.useArrayQuery(fql), subCollection = _c[0], subCollLoading = _c[1], subCollError = _c[2], subCollReloadFn = _c[3];
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
