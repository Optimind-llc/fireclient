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
var utils_1 = require("./utils");
var validation = __importStar(require("./validation"));
var validation_1 = require("./validation");
function generateHooksId() {
    return Math.random()
        .toString(32)
        .substring(2);
}
exports.generateHooksId = generateHooksId;
// ------------------------------------------
//  Get Doc Hooks Base
// ------------------------------------------
function useLazyGetDocBase(path, initialValue, getFunction, option) {
    // Arg validation
    validation_1.assertRule([
        { key: "path", fn: validation.isString },
        {
            key: "option",
            optional: true,
            fn: validation.matches(validation.callbackRule.concat(validation.acceptOutdatedRule)),
        },
    ])({ path: path, option: option }, "Argument");
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
            if (((_a = option) === null || _a === void 0 ? void 0 : _a.callback) !== undefined)
                option.callback(data);
        }, function (err) {
            setError(err);
            setLoading(false);
        });
    };
    return [doc, loading, error, loadDoc];
}
function useSubscribeDocBase(path, initialValue, subscribeFunction, option) {
    // Arg validation
    validation_1.assertRule([
        { key: "path", fn: validation.isString },
        {
            key: "option",
            optional: true,
            fn: validation_1.matches(validation.callbackRule),
        },
    ])({ path: path, option: option }, "Argument");
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
            if (((_a = option) === null || _a === void 0 ? void 0 : _a.callback) !== undefined)
                option.callback(data);
        }, function (err) {
            setError(err);
            setLoading(false);
        }, function () { return setLoading(true); });
        setUnsubscribe({ fn: unsub });
    }, [path]);
    return [doc, loading, error, unsubscribe.fn];
}
exports.useSubscribeDocBase = useSubscribeDocBase;
// ------------------------------------------
//  Get Collection Hooks Base
// ------------------------------------------
function useLazyGetCollectionBase(path, initialValue, getFunction, option) {
    // Arg validation
    validation_1.assertRule([
        { key: "path", fn: validation.isString },
        {
            key: "option",
            fn: validation_1.matches(validation.queryOptionRule.concat(validation.callbackRule, validation.acceptOutdatedRule)),
        },
    ])({ path: path, option: option }, "Argument");
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
            if (((_a = option) === null || _a === void 0 ? void 0 : _a.callback) !== undefined)
                option.callback(data);
        }, function (err) {
            setError(err);
            setLoading(false);
        }, option, (_a = option) === null || _a === void 0 ? void 0 : _a.acceptOutdated);
    };
    return [collection, loading, error, loadCollection];
}
exports.useLazyGetCollectionBase = useLazyGetCollectionBase;
function useSubscribeCollectionBase(path, initialValue, subscribeFunction, option) {
    validation_1.assertRule([
        { key: "path", fn: validation.isString },
        {
            key: "option",
            fn: validation_1.matches(validation.queryOptionRule.concat(validation.acceptOutdatedRule)),
        },
    ])({ path: path, option: option }, "Argument");
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
            if (((_a = option) === null || _a === void 0 ? void 0 : _a.callback) !== undefined)
                option.callback(snapshot);
        }, function (err) {
            setError(err);
            setLoading(false);
        }, function () { return setLoading(true); }, option);
        setUnsubscribe({ fn: unsub });
    }, [path, utils_1.getHashCode(option)]);
    return [collection, loading, error, unsubscribe.fn];
}
exports.useSubscribeCollectionBase = useSubscribeCollectionBase;
// ------------------------------------------
//  Get Doc Snapshot Hooks
// ------------------------------------------
function useLazyGetDocSnapshot(path, option) {
    return useLazyGetDocBase(path, null, getFunctions_1.getDocSnapshot, option);
}
exports.useLazyGetDocSnapshot = useLazyGetDocSnapshot;
function useGetDocSnapshot(path, option) {
    var _a = useLazyGetDocSnapshot(path, option), doc = _a[0], loading = _a[1], error = _a[2], reloadDoc = _a[3];
    react_1.useEffect(function () { return reloadDoc(); }, [path, utils_1.getHashCode(option)]);
    return [doc, loading, error, reloadDoc];
}
exports.useGetDocSnapshot = useGetDocSnapshot;
function useSubscribeDocSnapshot(path, option) {
    return useSubscribeDocBase(path, null, getFunctions_1.subscribeDocSnapshot, option);
}
exports.useSubscribeDocSnapshot = useSubscribeDocSnapshot;
// ------------------------------------------
//  Get Collection Snapshot Hooks
// ------------------------------------------
function useLazyGetCollectionSnapshot(path, option) {
    return useLazyGetCollectionBase(path, null, getFunctions_1.getCollectionSnapshot, option);
}
exports.useLazyGetCollectionSnapshot = useLazyGetCollectionSnapshot;
function useGetCollectionSnapshot(path, option) {
    var _a = useLazyGetCollectionSnapshot(path, option), collection = _a[0], loading = _a[1], error = _a[2], reloadCollection = _a[3];
    react_1.useEffect(function () { return reloadCollection(); }, [path, utils_1.getHashCode(option)]);
    return [collection, loading, error, reloadCollection];
}
exports.useGetCollectionSnapshot = useGetCollectionSnapshot;
function useSubscribeCollectionSnapshot(path, option) {
    return useSubscribeCollectionBase(path, [], getFunctions_1.subscribeCollectionSnapshot, option);
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
function useLazyGetDoc(path, option) {
    return useLazyGetDocBase(path, exports.initialDocData, getFunctions_1.getDoc, option);
}
exports.useLazyGetDoc = useLazyGetDoc;
function useGetDoc(path, option) {
    var _a = useLazyGetDoc(path, option), doc = _a[0], loading = _a[1], error = _a[2], reloadDoc = _a[3];
    react_1.useEffect(function () { return reloadDoc(); }, [path, utils_1.getHashCode(option)]);
    return [doc, loading, error, reloadDoc];
}
exports.useGetDoc = useGetDoc;
function useSubscribeDoc(path, option) {
    return useSubscribeDocBase(path, exports.initialDocData, getFunctions_1.subscribeDoc, option);
}
exports.useSubscribeDoc = useSubscribeDoc;
// ------------------------------------------
//  Get Collection Hooks
// ------------------------------------------
function useLazyGetCollection(path, option) {
    return useLazyGetCollectionBase(path, exports.initialCollectionData, getFunctions_1.getCollection, option);
}
exports.useLazyGetCollection = useLazyGetCollection;
function useGetCollection(path, option) {
    var _a = useLazyGetCollection(path, option), collection = _a[0], loading = _a[1], error = _a[2], reloadCollection = _a[3];
    react_1.useEffect(function () { return reloadCollection(); }, [path, utils_1.getHashCode(option)]);
    return [collection, loading, error, reloadCollection];
}
exports.useGetCollection = useGetCollection;
function useSubscribeCollection(path, option) {
    return useSubscribeCollectionBase(path, exports.initialCollectionData, getFunctions_1.subscribeCollection, option);
}
exports.useSubscribeCollection = useSubscribeCollection;
