"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("firebase/firestore");
var react_1 = require("react");
var _1 = require(".");
var fetchFunctions_1 = require("./fetchFunctions");
var validation_1 = require("./validation");
function generateHooksId() {
    return Math.random()
        .toString(32)
        .substring(2);
}
exports.generateHooksId = generateHooksId;
// ----------
//  Snapshot
// ----------
function useLazyGetDocSnapshot(path, option) {
    validation_1.assertPath(path);
    validation_1.assertCallbackOption(option);
    validation_1.assertAcceptOutdatedOption(option);
    var _a = react_1.useState(null), error = _a[0], setError = _a[1];
    var _b = react_1.useState(null), doc = _b[0], setDoc = _b[1];
    var _c = react_1.useState(false), loading = _c[0], setLoading = _c[1];
    var loadDoc = function () {
        var _a;
        setLoading(true);
        fetchFunctions_1.getDoc(path, function (snapshot) {
            var _a;
            setDoc(snapshot);
            setError(null);
            setLoading(false);
            if (((_a = option) === null || _a === void 0 ? void 0 : _a.callback) !== undefined)
                option.callback(snapshot);
        }, function (err) {
            setError(err);
            setLoading(false);
        }, (_a = option) === null || _a === void 0 ? void 0 : _a.acceptOutdated);
    };
    return [doc, loading, error, loadDoc];
}
exports.useLazyGetDocSnapshot = useLazyGetDocSnapshot;
function useGetDocSnapshot(path, option) {
    var _a = useLazyGetDocSnapshot(path, option), doc = _a[0], loading = _a[1], error = _a[2], reloadDoc = _a[3];
    react_1.useEffect(function () {
        reloadDoc();
    }, [path]);
    return [doc, loading, error, reloadDoc];
}
exports.useGetDocSnapshot = useGetDocSnapshot;
function useSubscribeDocSnapshot(path, option) {
    validation_1.assertPath(path);
    validation_1.assertCallbackOption(option);
    var hooksId = react_1.useState(generateHooksId())[0];
    var _a = react_1.useState(null), error = _a[0], setError = _a[1];
    var _b = react_1.useState(null), doc = _b[0], setDoc = _b[1];
    var _c = react_1.useState(false), loading = _c[0], setLoading = _c[1];
    var _d = react_1.useState({ fn: function () { } }), unsubscribe = _d[0], setUnsubscribe = _d[1];
    react_1.useEffect(function () {
        var unsub = fetchFunctions_1.subscribeDoc(hooksId, path, function (snapshot) {
            var _a;
            setDoc(snapshot);
            setError(null);
            setLoading(false);
            if (((_a = option) === null || _a === void 0 ? void 0 : _a.callback) !== undefined)
                option.callback(snapshot);
        }, function (err) {
            setError(err);
            setLoading(false);
        }, function () { return setLoading(true); });
        setUnsubscribe({ fn: unsub });
    }, [path]);
    return [doc, loading, error, unsubscribe.fn];
}
exports.useSubscribeDocSnapshot = useSubscribeDocSnapshot;
function useLazyGetCollectionSnapshot(path, option) {
    validation_1.assertPath(path);
    validation_1.assertQueryOption(option);
    validation_1.assertCallbackOption(option);
    validation_1.assertAcceptOutdatedOption(option);
    var _a = react_1.useState(null), error = _a[0], setError = _a[1];
    var _b = react_1.useState(null), collection = _b[0], setCollection = _b[1];
    var _c = react_1.useState(false), loading = _c[0], setLoading = _c[1];
    var loadCollection = function () {
        var _a;
        setLoading(true);
        fetchFunctions_1.getCollection(path, option, function (snapshot) {
            var _a;
            setCollection(snapshot);
            setError(null);
            setLoading(false);
            if (((_a = option) === null || _a === void 0 ? void 0 : _a.callback) !== undefined)
                option.callback(snapshot);
        }, function (err) {
            setError(err);
            setLoading(false);
        }, (_a = option) === null || _a === void 0 ? void 0 : _a.acceptOutdated);
    };
    return [collection, loading, error, loadCollection];
}
exports.useLazyGetCollectionSnapshot = useLazyGetCollectionSnapshot;
function useGetCollectionSnapshot(path, option) {
    var _a = useLazyGetCollectionSnapshot(path, option), collection = _a[0], loading = _a[1], error = _a[2], reloadCollection = _a[3];
    react_1.useEffect(function () {
        reloadCollection();
    }, [path, fetchFunctions_1.getHashCode(option)]);
    return [collection, loading, error, reloadCollection];
}
exports.useGetCollectionSnapshot = useGetCollectionSnapshot;
function useSubscribeCollectionSnapshot(path, option) {
    validation_1.assertPath(path);
    validation_1.assertQueryOption(option);
    validation_1.assertCallbackOption(option);
    validation_1.assertAcceptOutdatedOption(option);
    var hooksId = react_1.useState(generateHooksId())[0];
    var _a = react_1.useState(null), error = _a[0], setError = _a[1];
    var _b = react_1.useState([]), collection = _b[0], setCollection = _b[1];
    var _c = react_1.useState(false), loading = _c[0], setLoading = _c[1];
    var _d = react_1.useState({ fn: function () { } }), unsubscribe = _d[0], setUnsubscribe = _d[1];
    react_1.useEffect(function () {
        var unsub = fetchFunctions_1.subscribeCollection(hooksId, path, option, function (snapshot) {
            var _a;
            setCollection(snapshot);
            setError(null);
            setLoading(false);
            if (((_a = option) === null || _a === void 0 ? void 0 : _a.callback) !== undefined)
                option.callback(snapshot);
        }, function (err) {
            setError(err);
            setLoading(false);
        }, function () { return setLoading(true); });
        setUnsubscribe({ fn: unsub });
    }, [path, fetchFunctions_1.getHashCode(option)]);
    return [collection, loading, error, unsubscribe.fn];
}
exports.useSubscribeCollectionSnapshot = useSubscribeCollectionSnapshot;
// ----------
//  Data
// ----------
exports.initialDocData = {
    data: null,
    id: null,
};
exports.initialCollectionData = [];
function convertDocCallback(option) {
    var _a;
    return ((_a = option) === null || _a === void 0 ? void 0 : _a.callback) !== undefined
        ? __assign(__assign({}, option), { callback: function (snapshot) {
                return option.callback(_1.createDataFromDoc(snapshot));
            } }) : option;
}
function convertCollectionCallback(option) {
    var _a;
    return ((_a = option) === null || _a === void 0 ? void 0 : _a.callback) !== undefined
        ? __assign(__assign({}, option), { callback: function (snapshot) {
                return option.callback(_1.createDataFromCollection(snapshot));
            } }) : option;
}
function useLazyGetDoc(path, option) {
    var _a = useLazyGetDocSnapshot(path, convertDocCallback(option)), doc = _a[0], loading = _a[1], error = _a[2], loadDoc = _a[3];
    return [doc !== null ? _1.createDataFromDoc(doc) : exports.initialDocData, loading, error, loadDoc];
}
exports.useLazyGetDoc = useLazyGetDoc;
function useGetDoc(path, option) {
    var _a = useGetDocSnapshot(path, convertDocCallback(option)), doc = _a[0], loading = _a[1], error = _a[2], reloadDoc = _a[3];
    return [doc !== null ? _1.createDataFromDoc(doc) : exports.initialDocData, loading, error, reloadDoc];
}
exports.useGetDoc = useGetDoc;
function useSubscribeDoc(path, option) {
    var _a = useSubscribeDocSnapshot(path, convertDocCallback(option)), doc = _a[0], loading = _a[1], error = _a[2], unsubscribe = _a[3];
    return [doc !== null ? _1.createDataFromDoc(doc) : exports.initialDocData, loading, error, unsubscribe];
}
exports.useSubscribeDoc = useSubscribeDoc;
function useLazyGetCollection(path, option) {
    var _a = useLazyGetCollectionSnapshot(path, convertCollectionCallback(option)), collection = _a[0], loading = _a[1], error = _a[2], loadCollection = _a[3];
    return [
        collection !== null ? _1.createDataFromCollection(collection) : exports.initialCollectionData,
        loading,
        error,
        loadCollection,
    ];
}
exports.useLazyGetCollection = useLazyGetCollection;
function useGetCollection(path, option) {
    var _a = useGetCollectionSnapshot(path, convertCollectionCallback(option)), collection = _a[0], loading = _a[1], error = _a[2], reloadCollection = _a[3];
    return [
        collection !== null ? _1.createDataFromCollection(collection) : exports.initialCollectionData,
        loading,
        error,
        reloadCollection,
    ];
}
exports.useGetCollection = useGetCollection;
function useSubscribeCollection(path, option) {
    var _a = useSubscribeCollectionSnapshot(path, convertCollectionCallback(option)), collection = _a[0], loading = _a[1], error = _a[2], unsubscribe = _a[3];
    return [
        collection !== null ? _1.createDataFromCollection(collection) : exports.initialCollectionData,
        loading,
        error,
        unsubscribe,
    ];
}
exports.useSubscribeCollection = useSubscribeCollection;
