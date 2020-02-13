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
function useSubscribeCollectionBase(path, initialValue, subscribeFunction, options) {
    // Argument typeCheck
    typeCheck_1.assertRule([
        { key: "path", fn: typeCheck.isString },
        {
            key: "options",
            fn: typeCheck_1.matches(typeCheck.concatRule(typeCheck.queryOptionRule, typeCheck.callbackRule, typeCheck.saveToStateRule)),
        },
    ])({ path: path, options: options }, "Argument");
    var hooksId = react_1.useState(utils_1.generateHooksId())[0];
    var _a = react_1.useState(null), error = _a[0], setError = _a[1];
    var _b = react_1.useState(initialValue), collection = _b[0], setCollection = _b[1];
    var _c = react_1.useState(true), loading = _c[0], setLoading = _c[1];
    var _d = react_1.useState({
        fn: function () {
            /* do nothing */
        },
    }), unsubscribe = _d[0], setUnsubscribe = _d[1];
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
    }, [path, hooksId, utils_1.getHashCode(options)]);
    return [collection, loading, error, unsubscribe.fn];
}
exports.useSubscribeCollectionBase = useSubscribeCollectionBase;
function useSubscribeCollectionSnapshot(path, options) {
    return useSubscribeCollectionBase(path, [], getFunctions_1.subscribeCollectionSnapshot, options);
}
exports.useSubscribeCollectionSnapshot = useSubscribeCollectionSnapshot;
function useSubscribeCollection(path, options) {
    return useSubscribeCollectionBase(path, __1.initialCollectionData, getFunctions_1.subscribeCollection, options);
}
exports.useSubscribeCollection = useSubscribeCollection;
