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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("firebase/firestore");
var immutable_1 = require("immutable");
var pathlib = __importStar(require("path"));
var react_1 = require("react");
var _1 = require(".");
var fetchFunctions_1 = require("./fetchFunctions");
var hooks_1 = require("./hooks");
var validation_1 = require("./validation");
function isDoc(path) {
    var p = pathlib.resolve(path);
    return p.split("/").length % 2 === 1;
}
function useArrayQuery(querySchema) {
    validation_1.assertArrayQuerySchema(querySchema);
    var queries = querySchema.queries, callback = querySchema.callback, acceptOutdated = querySchema.acceptOutdated;
    var connects = querySchema.connects ? querySchema.connects : false;
    var initialQueryData = queries.map(function (query) {
        return isDoc(query.location) ? hooks_1.initialDocData : hooks_1.initialCollectionData;
    });
    // Subscribeする場合があるので、HooksのIdを持っておく
    var hooksId = react_1.useState(hooks_1.generateHooksId())[0];
    var _a = react_1.useState(null), error = _a[0], setError = _a[1];
    var _b = react_1.useState(initialQueryData), queryData = _b[0], setQueryData = _b[1];
    var _c = react_1.useState(false), loading = _c[0], setLoading = _c[1];
    var _d = react_1.useState({ unsubscribe: function () { }, reload: function () { } }), unsubscribe = _d[0], setUnsubscribe = _d[1];
    var loadQuery = function () {
        setLoading(true);
        var reloads = [];
        var unsubFns = [];
        // React HooksはCallback内で呼び出せないので、
        // fetchFunctionsの関数を直接呼び出す
        Promise.all(queries.map(function (query, i) {
            return new Promise(function (resolve, reject) {
                var location = query.location, limit = query.limit, where = query.where, order = query.order, cursor = query.cursor;
                var queryConnects = query.connects === undefined ? connects : query.connects;
                var isDocQuery = isDoc(location);
                var onFetchDoc = function (doc) {
                    resolve({ data: _1.createDataFromDoc(doc), key: i });
                    if (callback !== undefined)
                        callback();
                };
                var onFetchCollection = function (collection) {
                    resolve({ data: _1.createDataFromCollection(collection), key: i });
                    if (callback !== undefined)
                        callback();
                };
                var onError = reject;
                if (isDocQuery && !queryConnects) {
                    var load = function () { return fetchFunctions_1.getDoc(location, onFetchDoc, onError, acceptOutdated); };
                    load();
                    reloads.push(load);
                }
                else if (isDocQuery && queryConnects) {
                    var unsub = fetchFunctions_1.subscribeDoc(hooksId, location, onFetchDoc, onError);
                    unsubFns.push(unsub);
                }
                else if (!isDocQuery && !queryConnects) {
                    var load = function () {
                        return fetchFunctions_1.getCollection(location, { limit: limit, where: where, order: order, cursor: cursor }, onFetchCollection, onError, acceptOutdated);
                    };
                    load();
                    reloads.push(load);
                }
                else if (!isDocQuery && queryConnects) {
                    var unsub = fetchFunctions_1.subscribeCollection(hooksId, location, { limit: limit, where: where, order: order, cursor: cursor }, onFetchCollection, onError);
                    unsubFns.push(unsub);
                }
            });
        }))
            .then(function (res) {
            setQueryData(res.sort(function (a, b) { return a.key - b.key; }).map(function (r) { return r.data; }));
            setUnsubscribe({
                unsubscribe: function () { return unsubFns.forEach(function (fn) { return fn(); }); },
                reload: function () { return reloads.forEach(function (fn) { return fn(); }); },
            });
            setLoading(false);
        })
            .catch(function (err) {
            // throw Error(err);
            setLoading(false);
            setError(err);
        });
    };
    react_1.useEffect(function () {
        loadQuery();
    }, [immutable_1.fromJS(querySchema).hashCode()]);
    return [queryData, loading, error, unsubscribe];
}
exports.useArrayQuery = useArrayQuery;
function useQuery(querySchema) {
    validation_1.assertQuerySchema(querySchema);
    var queries = querySchema.queries;
    var idxToKey = Object.keys(queries).reduce(function (acc, key, i) { return acc.set(i, key); }, immutable_1.Map());
    var arrayQueries = Object.values(queries);
    var schema = __assign(__assign({}, querySchema), { queries: arrayQueries });
    var _a = useArrayQuery(schema), queryData = _a[0], loading = _a[1], error = _a[2], unsubscribe = _a[3];
    return [
        queryData.reduce(function (acc, queryDat, i) { return acc.set(idxToKey.get(i), queryDat); }, immutable_1.Map()).toJS(),
        loading,
        error,
        unsubscribe,
    ];
}
exports.useQuery = useQuery;
function useGetMinMax(path, option) {
    var order = option.order;
    var isDesc = order.direction === "desc";
    var minDocOption = __assign(__assign({}, option), { limit: 1 });
    var maxDocOption = __assign(__assign({}, option), { limit: 1, order: __assign(__assign({}, order), { direction: (isDesc ? "asc" : "desc") }) });
    var _a = hooks_1.useGetCollectionSnapshot(path, minDocOption), min = _a[0], reloadMin = _a[3];
    var _b = hooks_1.useGetCollectionSnapshot(path, maxDocOption), max = _b[0], reloadMax = _b[3];
    return [
        min !== null && min[0] !== undefined ? min[0] : null,
        max !== null && max[0] !== undefined ? max[0] : null,
        reloadMin,
        reloadMax,
    ];
}
function reverseDirection(reverse, direction) {
    if (direction === void 0) { direction = "asc"; }
    switch (direction) {
        case "asc":
            return !reverse ? "asc" : "desc";
        case "desc":
            return !reverse ? "asc" : "desc";
    }
}
function usePaginateCollection(path, option) {
    validation_1.assertPath(path);
    validation_1.assertPaginateOption(option);
    var order = option.order;
    var _a = useGetMinMax(path, option), min = _a[0], max = _a[1], reloadMin = _a[2], reloadMax = _a[3];
    var _b = react_1.useState(null), first = _b[0], setFirst = _b[1];
    var _c = react_1.useState(null), last = _c[0], setLast = _c[1];
    // 前のページに戻る際、 orderを反転させてクエリする必要がある
    // クエリ実行とデータ取得には遅延があるため、reversedを分ける
    var _d = react_1.useState(false), queryReversed = _d[0], setQueryReversed = _d[1];
    var _e = react_1.useState(false), dataReversed = _e[0], setDataReversed = _e[1];
    var _f = react_1.useState(null), origin = _f[0], setOrigin = _f[1];
    var optionWithCursor = origin === null
        ? option
        : __assign(__assign({}, option), { 
            // reversedを反映
            order: __assign(__assign({}, order), { direction: reverseDirection(queryReversed, order.direction) }), 
            // originを反映
            cursor: {
                origin: origin,
                direction: "startAfter",
            }, callback: function () {
                if (option.callback !== undefined)
                    option.callback();
                setDataReversed(queryReversed);
            } });
    // first,minは同じCollectionに含まれる
    var remainsPrev = first !== null && min !== null && first.id !== min.id;
    var handlePrev = {
        fn: remainsPrev
            ? function () {
                setOrigin(first);
                setQueryReversed(true);
                reloadMin();
            }
            : function () { },
        enabled: remainsPrev,
    };
    // last,maxは同じCollectionに含まれる
    var remainsNext = last !== null && max !== null && last.id !== max.id;
    var handleNext = {
        fn: remainsNext
            ? function () {
                setOrigin(last);
                setQueryReversed(false);
                reloadMax();
            }
            : function () { },
        enabled: remainsNext,
    };
    var _g = hooks_1.useGetCollectionSnapshot(path, optionWithCursor), collection = _g[0], loading = _g[1], error = _g[2];
    var nextFirst = collection !== null && collection.length > 0 ? collection[0] : null;
    var nextLast = collection !== null && collection.length > 0 ? collection[collection.length - 1] : null;
    react_1.useEffect(function () {
        setFirst(!queryReversed ? nextFirst : nextLast);
        setLast(!queryReversed ? nextLast : nextFirst);
    }, [nextFirst !== null ? nextFirst.id : null, nextLast !== null ? nextLast.id : null]);
    var collectionData = collection !== null ? _1.createDataFromCollection(collection) : [];
    return [
        !dataReversed ? collectionData : collectionData.slice().reverse(),
        loading,
        error,
        handlePrev,
        handleNext,
    ];
}
exports.usePaginateCollection = usePaginateCollection;
function useGetSubCollection(path, option) {
    // assertPath(path);
    // assertSubCollectionOption(option);
    var subCollectionName = option.subCollectionName, acceptOutdated = option.acceptOutdated;
    var _a = hooks_1.useGetCollection(path), collection = _a[0], collLoading = _a[1], collError = _a[2], collReloadFn = _a[3];
    var docIds = collection.filter(function (doc) { return doc.id !== null; }).map(function (doc) { return doc.id; });
    var schema = {
        queries: docIds.map(function (docId) { return ({ location: pathlib.resolve(path, docId, subCollectionName) }); }),
    };
    var _b = useArrayQuery(schema), subCollection = _b[0], subCollLoading = _b[1], subCollError = _b[2], subCollReloadFn = _b[3];
    var flatten = Array.prototype.concat.apply([], subCollection);
    return [
        flatten,
        collLoading || subCollLoading,
        [collError, subCollError],
        function () {
            collReloadFn();
            subCollReloadFn.reload();
        },
    ];
}
exports.useGetSubCollection = useGetSubCollection;
