"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var __1 = require("..");
var getFunctions_1 = require("../getFunctions");
var isMounted_1 = __importDefault(require("../isMounted"));
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
    var isMounted = isMounted_1.default();
    var _a = react_1.useState(null), error = _a[0], setError = _a[1];
    var _b = react_1.useState(initialValue), collection = _b[0], setCollection = _b[1];
    var _c = react_1.useState(!lazy), loading = _c[0], setLoading = _c[1];
    var optionsHash = utils_1.getHashCode(options);
    var loadCollection = react_1.useCallback(function () {
        var _a, _b;
        setLoading(true);
        getFunction(path, function (data) {
            var _a;
            if (isMounted.current) {
                setCollection(data);
                setError(null);
                setLoading(false);
            }
            if ((_a = options) === null || _a === void 0 ? void 0 : _a.callback)
                options.callback(data);
        }, function (err) {
            if (isMounted.current) {
                setError(err);
                setLoading(false);
            }
        }, options, (_a = options) === null || _a === void 0 ? void 0 : _a.saveToState, (_b = options) === null || _b === void 0 ? void 0 : _b.acceptOutdated);
    }, [path, optionsHash, isMounted.current]);
    // Automatically excecute loadCollection() if lazy
    react_1.useEffect(function () {
        if (!lazy)
            loadCollection();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path, optionsHash]);
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
