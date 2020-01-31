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
var getFunctions_1 = require("./getFunctions");
var typeCheck = __importStar(require("./typeCheck"));
var typeCheck_1 = require("./typeCheck");
var utils_1 = require("./utils");
function generateHooksId() {
    return Math.random()
        .toString(32)
        .substring(2);
}
exports.generateHooksId = generateHooksId;
// ------------------------------------------
//  Get Doc Hooks Base
// ------------------------------------------
function useLazyGetDocBase(path, initialValue, getFunction, options) {
    // Arg typeCheck
    typeCheck_1.assertRule([
        { key: "path", fn: typeCheck.isString },
        {
            key: "options",
            optional: true,
            fn: typeCheck.matches(typeCheck.callbackRule.concat(typeCheck.acceptOutdatedRule)),
        },
    ])({ path: path, options: options }, "Argument");
    var _a = react_1.useState(null), error = _a[0], setError = _a[1];
    var _b = react_1.useState(initialValue), doc = _b[0], setDoc = _b[1];
    var _c = react_1.useState(false), loading = _c[0], setLoading = _c[1];
    var loadDoc = function () {
        setLoading(true);
        getFunction(path, function (data) {
            var _a;
            setDoc(data);
            setError(null);
            setLoading(false);
            if (((_a = options) === null || _a === void 0 ? void 0 : _a.callback) !== undefined)
                options.callback(data);
        }, function (err) {
            setError(err);
            setLoading(false);
        });
    };
    return [doc, loading, error, loadDoc];
}
function useSubscribeDocBase(path, initialValue, subscribeFunction, options) {
    // Arg typeCheck
    typeCheck_1.assertRule([
        { key: "path", fn: typeCheck.isString },
        {
            key: "options",
            optional: true,
            fn: typeCheck_1.matches(typeCheck.callbackRule),
        },
    ])({ path: path, options: options }, "Argument");
    var hooksId = react_1.useState(generateHooksId())[0];
    var _a = react_1.useState(null), error = _a[0], setError = _a[1];
    var _b = react_1.useState(initialValue), doc = _b[0], setDoc = _b[1];
    var _c = react_1.useState(false), loading = _c[0], setLoading = _c[1];
    var _d = react_1.useState({ fn: function () { } }), unsubscribe = _d[0], setUnsubscribe = _d[1];
    react_1.useEffect(function () {
        var unsub = subscribeFunction(hooksId, path, function (data) {
            var _a;
            setDoc(data);
            setError(null);
            setLoading(false);
            if (((_a = options) === null || _a === void 0 ? void 0 : _a.callback) !== undefined)
                options.callback(data);
        }, function (err) {
            setError(err);
            setLoading(false);
        }, function () { return setLoading(true); });
        setUnsubscribe({ fn: unsub });
        // subscribeFunctionを除去
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path, hooksId, utils_1.getHashCode(options)]);
    return [doc, loading, error, unsubscribe.fn];
}
exports.useSubscribeDocBase = useSubscribeDocBase;
// ------------------------------------------
//  Get Collection Hooks Base
// ------------------------------------------
function useLazyGetCollectionBase(path, initialValue, getFunction, options) {
    // Arg typeCheck
    typeCheck_1.assertRule([
        { key: "path", fn: typeCheck.isString },
        {
            key: "options",
            optional: true,
            fn: typeCheck_1.matches(typeCheck.queryOptionRule.concat(typeCheck.callbackRule, typeCheck.acceptOutdatedRule)),
        },
    ])({ path: path, options: options }, "Argument");
    var _a = react_1.useState(null), error = _a[0], setError = _a[1];
    var _b = react_1.useState(initialValue), collection = _b[0], setCollection = _b[1];
    var _c = react_1.useState(false), loading = _c[0], setLoading = _c[1];
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
    return [collection, loading, error, loadCollection];
}
exports.useLazyGetCollectionBase = useLazyGetCollectionBase;
function useSubscribeCollectionBase(path, initialValue, subscribeFunction, options) {
    typeCheck_1.assertRule([
        { key: "path", fn: typeCheck.isString },
        {
            key: "options",
            fn: typeCheck_1.matches(typeCheck.queryOptionRule.concat(typeCheck.callbackRule)),
        },
    ])({ path: path, options: options }, "Argument");
    var hooksId = react_1.useState(generateHooksId())[0];
    var _a = react_1.useState(null), error = _a[0], setError = _a[1];
    var _b = react_1.useState(initialValue), collection = _b[0], setCollection = _b[1];
    var _c = react_1.useState(false), loading = _c[0], setLoading = _c[1];
    var _d = react_1.useState({ fn: function () { } }), unsubscribe = _d[0], setUnsubscribe = _d[1];
    react_1.useEffect(function () {
        var unsub = subscribeFunction(hooksId, path, function (snapshot) {
            var _a;
            setCollection(snapshot);
            setError(null);
            setLoading(false);
            if (((_a = options) === null || _a === void 0 ? void 0 : _a.callback) !== undefined)
                options.callback(snapshot);
        }, function (err) {
            setError(err);
            setLoading(false);
        }, function () { return setLoading(true); }, options);
        setUnsubscribe({ fn: unsub });
        // subscribeFunctionを除去
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path, hooksId, utils_1.getHashCode(options)]);
    return [collection, loading, error, unsubscribe.fn];
}
exports.useSubscribeCollectionBase = useSubscribeCollectionBase;
// ------------------------------------------
//  Get Doc Snapshot Hooks
// ------------------------------------------
function useLazyGetDocSnapshot(path, options) {
    return useLazyGetDocBase(path, null, getFunctions_1.getDocSnapshot, options);
}
exports.useLazyGetDocSnapshot = useLazyGetDocSnapshot;
function useGetDocSnapshot(path, options) {
    var _a = useLazyGetDocSnapshot(path, options), doc = _a[0], loading = _a[1], error = _a[2], reloadDoc = _a[3];
    // reloadDocを除去
    // eslint-disable-next-line react-hooks/exhaustive-deps
    react_1.useEffect(function () { return reloadDoc(); }, [path, utils_1.getHashCode(options)]);
    return [doc, loading, error, reloadDoc];
}
exports.useGetDocSnapshot = useGetDocSnapshot;
function useSubscribeDocSnapshot(path, options) {
    return useSubscribeDocBase(path, null, getFunctions_1.subscribeDocSnapshot, options);
}
exports.useSubscribeDocSnapshot = useSubscribeDocSnapshot;
// ------------------------------------------
//  Get Collection Snapshot Hooks
// ------------------------------------------
function useLazyGetCollectionSnapshot(path, options) {
    return useLazyGetCollectionBase(path, null, getFunctions_1.getCollectionSnapshot, options);
}
exports.useLazyGetCollectionSnapshot = useLazyGetCollectionSnapshot;
function useGetCollectionSnapshot(path, options) {
    var _a = useLazyGetCollectionSnapshot(path, options), collection = _a[0], loading = _a[1], error = _a[2], reloadCollection = _a[3];
    // reloadCollectionを除去
    // eslint-disable-next-line react-hooks/exhaustive-deps
    react_1.useEffect(function () { return reloadCollection(); }, [path, utils_1.getHashCode(options)]);
    return [collection, loading, error, reloadCollection];
}
exports.useGetCollectionSnapshot = useGetCollectionSnapshot;
function useSubscribeCollectionSnapshot(path, options) {
    return useSubscribeCollectionBase(path, [], getFunctions_1.subscribeCollectionSnapshot, options);
}
exports.useSubscribeCollectionSnapshot = useSubscribeCollectionSnapshot;
// ------------------------------------------
//  Get Doc Hooks
// ------------------------------------------
exports.initialDocData = {
    data: null,
    id: null,
};
exports.initialCollectionData = [];
function useLazyGetDoc(path, options) {
    return useLazyGetDocBase(path, exports.initialDocData, getFunctions_1.getDoc, options);
}
exports.useLazyGetDoc = useLazyGetDoc;
function useGetDoc(path, options) {
    var _a = useLazyGetDoc(path, options), doc = _a[0], loading = _a[1], error = _a[2], reloadDoc = _a[3];
    // reloadDocを除去
    // eslint-disable-next-line react-hooks/exhaustive-deps
    react_1.useEffect(function () { return reloadDoc(); }, [path, utils_1.getHashCode(options)]);
    return [doc, loading, error, reloadDoc];
}
exports.useGetDoc = useGetDoc;
function useSubscribeDoc(path, options) {
    return useSubscribeDocBase(path, exports.initialDocData, getFunctions_1.subscribeDoc, options);
}
exports.useSubscribeDoc = useSubscribeDoc;
// ------------------------------------------
//  Get Collection Hooks
// ------------------------------------------
function useLazyGetCollection(path, options) {
    return useLazyGetCollectionBase(path, exports.initialCollectionData, getFunctions_1.getCollection, options);
}
exports.useLazyGetCollection = useLazyGetCollection;
function useGetCollection(path, options) {
    var _a = useLazyGetCollection(path, options), collection = _a[0], loading = _a[1], error = _a[2], reloadCollection = _a[3];
    // reloadCollectionを除去
    // eslint-disable-next-line react-hooks/exhaustive-deps
    react_1.useEffect(function () { return reloadCollection(); }, [path, utils_1.getHashCode(options)]);
    return [collection, loading, error, reloadCollection];
}
exports.useGetCollection = useGetCollection;
function useSubscribeCollection(path, options) {
    return useSubscribeCollectionBase(path, exports.initialCollectionData, getFunctions_1.subscribeCollection, options);
}
exports.useSubscribeCollection = useSubscribeCollection;
