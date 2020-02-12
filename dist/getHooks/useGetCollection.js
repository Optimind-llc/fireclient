"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("firebase/firestore");
var react_1 = require("react");
var __1 = require("..");
var getFunctions_1 = require("../getFunctions");
var typeCheck = __importStar(require("../typeCheck"));
var typeCheck_1 = require("../typeCheck");
var utils_1 = require("../utils");
function useGetCollectionBase(path, initialValue, lazy, getFunction, options) {
    // Argument typeCheck
    typeCheck_1.assertRule([
        { key: "path", fn: typeCheck.isString },
        {
            key: "options",
            optional: true,
            fn: typeCheck_1.matches(typeCheck.concatRule(typeCheck.queryOptionRule, typeCheck.callbackRule, typeCheck.acceptOutdatedRule, typeCheck.saveToStateRule)),
        },
    ])({ path: path, options: options }, "Argument");
    var _a = react_1.useState(null), error = _a[0], setError = _a[1];
    var _b = react_1.useState(initialValue), collection = _b[0], setCollection = _b[1];
    var _c = react_1.useState(!lazy), loading = _c[0], setLoading = _c[1];
    var loadCollection = function () {
        var _a;
        setLoading(true);
        getFunction(path, function (data) {
            var _a;
            setCollection(data);
            setError(null);
            setLoading(false);
            if (((_a = options) === null || _a === void 0 ? void 0 : _a.callback) !== undefined)
                options.callback(data);
        }, function (err) {
            setError(err);
            setLoading(false);
        }, options, (_a = options) === null || _a === void 0 ? void 0 : _a.acceptOutdated);
    };
    if (!lazy)
        react_1.useEffect(function () { return loadCollection(); }, [path, utils_1.getHashCode(options)]);
    return [collection, loading, error, loadCollection];
}
exports.useGetCollectionBase = useGetCollectionBase;
function useLazyGetCollectionSnapshot(path, options) {
    return useGetCollectionBase(path, null, true, getFunctions_1.getCollectionSnapshot, options);
}
exports.useLazyGetCollectionSnapshot = useLazyGetCollectionSnapshot;
function useGetCollectionSnapshot(path, options) {
    return useGetCollectionBase(path, null, false, getFunctions_1.getCollectionSnapshot, options);
}
exports.useGetCollectionSnapshot = useGetCollectionSnapshot;
function useLazyGetCollection(path, options) {
    return useGetCollectionBase(path, __1.initialCollectionData, true, getFunctions_1.getCollection, options);
}
exports.useLazyGetCollection = useLazyGetCollection;
function useGetCollection(path, options) {
    return useGetCollectionBase(path, __1.initialCollectionData, false, getFunctions_1.getCollection, options);
}
exports.useGetCollection = useGetCollection;
