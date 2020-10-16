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
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePaginateCollection = void 0;
var react_1 = require("react");
var __1 = require("..");
var useGetCollection_1 = require("../getHooks/useGetCollection");
var typeCheck = __importStar(require("../typeCheck"));
var typeCheck_1 = require("../typeCheck");
function useGetMinMax(path, options) {
    var order = options.order;
    var isDesc = order.direction === "desc";
    var minDocOption = __assign(__assign({}, options), { limit: 1 });
    var maxDocOption = __assign(__assign({}, options), { limit: 1, order: __assign(__assign({}, order), { direction: (isDesc ? "asc" : "desc") }) });
    var _a = useGetCollection_1.useGetCollectionSnapshot(path, minDocOption), min = _a[0], reloadMin = _a[3];
    var _b = useGetCollection_1.useGetCollectionSnapshot(path, maxDocOption), max = _b[0], reloadMax = _b[3];
    var optionalMin = min && min[0] ? min[0] : null;
    var optionalMax = max && max[0] ? max[0] : null;
    return [optionalMin, optionalMax, reloadMin, reloadMax];
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
                if (options.callback)
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
            : function () {
                /* do nothing */
            },
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
            : function () {
                /* do nothing */
            },
        enabled: remainsNext,
    };
    var _g = useGetCollection_1.useGetCollectionSnapshot(path, optionsWithCursor), collection = _g[0], loading = _g[1], error = _g[2];
    var nextFirst = collection !== null && collection.length > 0 ? collection[0] : null;
    var nextFirstId = nextFirst !== null ? nextFirst.id : null;
    var nextLast = collection !== null && collection.length > 0 ? collection[collection.length - 1] : null;
    var nextLastId = nextLast !== null ? nextLast.id : null;
    react_1.useEffect(function () {
        setFirst(!queryReversed ? nextFirst : nextLast);
        setLast(!queryReversed ? nextLast : nextFirst);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nextFirstId, nextLastId]);
    var collectionData = collection !== null ? __1.createDataFromCollection(collection) : [];
    return [
        !dataReversed ? collectionData : collectionData.slice().reverse(),
        loading,
        error,
        prevHandler,
        nextHandler,
    ];
}
exports.usePaginateCollection = usePaginateCollection;
