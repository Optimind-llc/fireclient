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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useQuery = exports.useArrayQuery = void 0;
var immutable_1 = require("immutable");
var react_1 = require("react");
var __1 = require("..");
var getFunctions_1 = require("../getFunctions");
var isMounted_1 = __importDefault(require("../isMounted"));
var typeCheck = __importStar(require("../typeCheck"));
var typeCheck_1 = require("../typeCheck");
var utils_1 = require("../utils");
function useArrayQuery(getFql) {
    typeCheck_1.assertRule(typeCheck.arrayGetFqlRule)(getFql, "getFql");
    var queries = getFql.queries, callback = getFql.callback;
    var connects = !!getFql.connects; // getFql.connects can be undefined
    var acceptOutdated = !!getFql.acceptOutdated; // getFql.acceptOutdated can be undefined
    var initialQueryData = queries.map(function (query) {
        return utils_1.isDocPath(query.location) ? __1.initialDocData : __1.initialCollectionData;
    });
    var isMounted = isMounted_1.default();
    var hooksId = react_1.useState(utils_1.generateHooksId())[0];
    var _a = react_1.useState(null), error = _a[0], setError = _a[1];
    var _b = react_1.useState(initialQueryData), queryData = _b[0], setQueryData = _b[1];
    var _c = react_1.useState(true), loading = _c[0], setLoading = _c[1];
    var _d = react_1.useState({
        unsubscribe: function () {
            /* do nothing */
        },
        reload: function () {
            /* do nothing */
        },
    }), unsubscribe = _d[0], setUnsubscribe = _d[1];
    var loadQuery = function () {
        setLoading(true);
        var reloadFns = [];
        var unsubFns = [];
        // React HooksはCallback内で呼び出せないので、
        // fetchFunctionsの関数を直接呼び出す
        Promise.all(queries.map(function (query, i) {
            return new Promise(function (resolve, reject) {
                var location = query.location, limit = query.limit, where = query.where, order = query.order, cursor = query.cursor;
                var queryConnects = query.connects ? query.connects : connects;
                var queryAcceptOutdated = query.acceptOutdated
                    ? query.acceptOutdated
                    : acceptOutdated;
                var queryCallback = query.callback;
                var isDocQuery = utils_1.isDocPath(location);
                var onChange = function (data) {
                    resolve({ data: data, key: i });
                    if (callback)
                        callback(data);
                    if (queryCallback)
                        queryCallback(data);
                };
                var onError = reject;
                var onListen = function () {
                    /* do nothing */
                };
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
            if (isMounted.current) {
                setQueryData(res.sort(function (a, b) { return a.key - b.key; }).map(function (r) { return r.data; }));
                setUnsubscribe({
                    unsubscribe: function () { return unsubFns.forEach(function (fn) { return fn(); }); },
                    reload: function () { return reloadFns.forEach(function (fn) { return fn(); }); },
                });
                setLoading(false);
            }
        })
            .catch(function (err) {
            if (isMounted.current) {
                setLoading(false);
                setError(err);
            }
        });
    };
    react_1.useEffect(loadQuery, [utils_1.getHashCode(getFql)]);
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
