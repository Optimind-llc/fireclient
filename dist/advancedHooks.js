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
var getFunctions_1 = require("./getFunctions");
var getHooks_1 = require("./getHooks");
var typeCheck = __importStar(require("./typeCheck"));
var typeCheck_1 = require("./typeCheck");
var utils_1 = require("./utils");
// TODO:
// https://firebase.google.com/docs/firestore/manage-data/transactions?hl=ja
// トランザクションを使用する
function useArrayQuery(getFql) {
    typeCheck_1.assertRule(typeCheck.arrayGetFqlRule)(getFql, "getFql");
    var queries = getFql.queries, callback = getFql.callback;
    var connects = getFql.connects === true; // getFql.connects can be undefined
    var acceptOutdated = getFql.acceptOutdated === true; // getFql.acceptOutdated can be undefined
    var initialQueryData = queries.map(function (query) {
        return utils_1.isDocPath(query.location) ? getHooks_1.initialDocData : getHooks_1.initialCollectionData;
    });
    // Subscribeする場合があるので、HooksのIdを持っておく
    var hooksId = react_1.useState(getHooks_1.generateHooksId())[0];
    var _a = react_1.useState(null), error = _a[0], setError = _a[1];
    var _b = react_1.useState(initialQueryData), queryData = _b[0], setQueryData = _b[1];
    var _c = react_1.useState(false), loading = _c[0], setLoading = _c[1];
    var _d = react_1.useState({ unsubscribe: function () { }, reload: function () { } }), unsubscribe = _d[0], setUnsubscribe = _d[1];
    var loadQuery = function () {
        setLoading(true);
        var reloadFns = [];
        var unsubFns = [];
        // React HooksはCallback内で呼び出せないので、
        // fetchFunctionsの関数を直接呼び出す
        Promise.all(queries.map(function (query, i) {
            return new Promise(function (resolve, reject) {
                var location = query.location, limit = query.limit, where = query.where, order = query.order, cursor = query.cursor;
                var queryConnects = query.connects === undefined ? connects : query.connects;
                var queryAcceptOutdated = query.acceptOutdated === undefined ? acceptOutdated : query.acceptOutdated;
                var queryCallback = query.callback;
                var isDocQuery = utils_1.isDocPath(location);
                var onChange = function (data) {
                    resolve({ data: data, key: i });
                    if (callback !== undefined)
                        callback(data);
                    if (queryCallback !== undefined)
                        queryCallback(data);
                };
                var onError = reject;
                var onListen = function () { };
                if (isDocQuery && !queryConnects) {
                    var load = function () { return getFunctions_1.getDoc(location, onChange, onError, queryAcceptOutdated); };
                    load();
                    reloadFns.push(load);
                }
                else if (isDocQuery && queryConnects) {
                    var unsub = getFunctions_1.subscribeDoc(hooksId, location, onChange, onError, onListen);
                    unsubFns.push(unsub);
                }
                else if (!isDocQuery && !queryConnects) {
                    var load = function () {
                        return getFunctions_1.getCollection(location, onChange, onError, { limit: limit, where: where, order: order, cursor: cursor }, queryAcceptOutdated);
                    };
                    load();
                    reloadFns.push(load);
                }
                else if (!isDocQuery && queryConnects) {
                    var unsub = getFunctions_1.subscribeCollection(hooksId, location, onChange, onError, onListen, {
                        limit: limit,
                        where: where,
                        order: order,
                        cursor: cursor,
                    });
                    unsubFns.push(unsub);
                }
            });
        }))
            .then(function (res) {
            setQueryData(res.sort(function (a, b) { return a.key - b.key; }).map(function (r) { return r.data; }));
            setUnsubscribe({
                unsubscribe: function () { return unsubFns.forEach(function (fn) { return fn(); }); },
                reload: function () { return reloadFns.forEach(function (fn) { return fn(); }); },
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
        // loadQueryをexhaustive-depsから除外
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [utils_1.getHashCode(getFql)]);
    return [queryData, loading, error, unsubscribe];
}
exports.useArrayQuery = useArrayQuery;
function useQuery(getFql) {
    typeCheck_1.assertRule(typeCheck.getFqlRule)(getFql, "getFql");
    var queries = getFql.queries;
    var idxToKey = Object.keys(queries).reduce(function (acc, key, i) { return acc.set(i, key); }, immutable_1.Map());
    var arrayQueries = Object.values(queries);
    var arrayGetFql = __assign(__assign({}, getFql), { queries: arrayQueries });
    var _a = useArrayQuery(arrayGetFql), queryData = _a[0], loading = _a[1], error = _a[2], unsubscribe = _a[3];
    return [
        queryData.reduce(function (acc, queryDat, i) { return acc.set(idxToKey.get(i), queryDat); }, immutable_1.Map()).toJS(),
        loading,
        error,
        unsubscribe,
    ];
}
exports.useQuery = useQuery;
function useGetMinMax(path, options) {
    var order = options.order;
    var isDesc = order.direction === "desc";
    var minDocOption = __assign(__assign({}, options), { limit: 1 });
    var maxDocOption = __assign(__assign({}, options), { limit: 1, order: __assign(__assign({}, order), { direction: (isDesc ? "asc" : "desc") }) });
    var _a = getHooks_1.useGetCollectionSnapshot(path, minDocOption), min = _a[0], reloadMin = _a[3];
    var _b = getHooks_1.useGetCollectionSnapshot(path, maxDocOption), max = _b[0], reloadMax = _b[3];
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
function reverseOrder(reverse, order) {
    return Array.isArray(order)
        ? order.map(function (o) { return (__assign(__assign({}, o), { direction: reverseDirection(reverse, o.direction) })); })
        : __assign(__assign({}, order), { direction: reverseDirection(reverse, order.direction) });
}
function usePaginateCollection(path, options) {
    typeCheck_1.assertRule([
        {
            key: "path",
            fn: typeCheck.isString,
        },
        {
            key: "options",
            fn: typeCheck_1.matches(typeCheck.paginateOptionRule),
        },
    ])({ path: path, options: options }, "Argument");
    var order = options.order;
    var _a = useGetMinMax(path, options), min = _a[0], max = _a[1], reloadMin = _a[2], reloadMax = _a[3];
    var _b = react_1.useState(null), first = _b[0], setFirst = _b[1];
    var _c = react_1.useState(null), last = _c[0], setLast = _c[1];
    // 前のページに戻る際、 orderを反転させてクエリする必要がある
    // クエリ実行とデータ取得には遅延があるため、reversedを分ける
    var _d = react_1.useState(false), queryReversed = _d[0], setQueryReversed = _d[1];
    var _e = react_1.useState(false), dataReversed = _e[0], setDataReversed = _e[1];
    var _f = react_1.useState(null), origin = _f[0], setOrigin = _f[1];
    var optionsWithCursor = origin === null
        ? options
        : __assign(__assign({}, options), { 
            // reversedを反映
            order: reverseOrder(queryReversed, order), 
            // originを反映
            cursor: {
                origin: origin,
                direction: "startAfter",
            }, callback: function () {
                if (options.callback !== undefined)
                    options.callback();
                setDataReversed(queryReversed);
            } });
    // first,minは同じCollectionに含まれる
    var remainsPrev = first !== null && min !== null && first.id !== min.id;
    var prevHandler = {
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
    var nextHandler = {
        fn: remainsNext
            ? function () {
                setOrigin(last);
                setQueryReversed(false);
                reloadMax();
            }
            : function () { },
        enabled: remainsNext,
    };
    var _g = getHooks_1.useGetCollectionSnapshot(path, optionsWithCursor), collection = _g[0], loading = _g[1], error = _g[2];
    var nextFirst = collection !== null && collection.length > 0 ? collection[0] : null;
    var nextFirstId = nextFirst !== null ? nextFirst.id : null;
    var nextLast = collection !== null && collection.length > 0 ? collection[collection.length - 1] : null;
    var nextLastId = nextLast !== null ? nextLast.id : null;
    react_1.useEffect(function () {
        setFirst(!queryReversed ? nextFirst : nextLast);
        setLast(!queryReversed ? nextLast : nextFirst);
        // [nextFirst, nextLast]の代わりに[nextFirstId, nextLastId]を使用
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nextFirstId, nextLastId]);
    var collectionData = collection !== null ? _1.createDataFromCollection(collection) : [];
    return [
        !dataReversed ? collectionData : collectionData.slice().reverse(),
        loading,
        error,
        prevHandler,
        nextHandler,
    ];
}
exports.usePaginateCollection = usePaginateCollection;
function useGetSubCollection(path, subCollectionName, options) {
    var _a;
    // Arg typeCheck
    typeCheck_1.assertRule([
        { key: "path", fn: typeCheck.isString },
        { key: "subCollectionName", fn: typeCheck.isString },
        {
            key: "options",
            fn: typeCheck.matches(typeCheck.subCollectionOptionRule),
        },
    ])({ path: path, subCollectionName: subCollectionName, options: options }, "Argument");
    var _b = getHooks_1.useGetCollection(path, options), collection = _b[0], collLoading = _b[1], collError = _b[2], collReloadFn = _b[3];
    var docIds = collection.filter(function (doc) { return doc.id !== null; }).map(function (doc) { return doc.id; });
    var fql = {
        callback: (_a = options) === null || _a === void 0 ? void 0 : _a.callback,
        queries: docIds.map(function (docId) { return ({ location: pathlib.resolve(path, docId, subCollectionName) }); }),
    };
    var _c = useArrayQuery(fql), subCollection = _c[0], subCollLoading = _c[1], subCollError = _c[2], subCollReloadFn = _c[3];
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
