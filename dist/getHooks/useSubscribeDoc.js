"use strict";
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
exports.useSubscribeDoc = exports.useSubscribeDocSnapshot = exports.useSubscribeDocBase = void 0;
var react_1 = require("react");
var __1 = require("..");
var getFunctions_1 = require("../getFunctions");
var isMounted_1 = __importDefault(require("../isMounted"));
var typeCheck = __importStar(require("../typeCheck"));
var typeCheck_1 = require("../typeCheck");
var utils_1 = require("../utils");
function useSubscribeDocBase(path, initialValue, subscribeFunction, options) {
    // Argument typeCheck
    typeCheck_1.assertRule([
        { key: "path", fn: typeCheck.isString },
        {
            key: "options",
            optional: true,
            fn: typeCheck_1.matches(typeCheck.concatRule(typeCheck.callbackRule, typeCheck.saveToStateRule)),
        },
    ])({ path: path, options: options }, "Argument");
    var isMounted = isMounted_1.default();
    var hooksId = react_1.useState(utils_1.generateHooksId())[0];
    var _a = react_1.useState(null), error = _a[0], setError = _a[1];
    var _b = react_1.useState(initialValue), doc = _b[0], setDoc = _b[1];
    var _c = react_1.useState(true), loading = _c[0], setLoading = _c[1];
    var _d = react_1.useState({
        fn: function () {
            /* do nothing */
        },
    }), unsubscribe = _d[0], setUnsubscribe = _d[1];
    react_1.useEffect(function () {
        var unsub = subscribeFunction(hooksId, path, function (data) {
            if (isMounted.current) {
                setDoc(data);
                setError(null);
                setLoading(false);
            }
            if (options === null || options === void 0 ? void 0 : options.callback)
                options.callback(data);
        }, function (err) {
            if (isMounted.current) {
                setError(err);
                setLoading(false);
            }
        }, function () {
            if (isMounted.current)
                setLoading(true);
        });
        setUnsubscribe({ fn: unsub });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path, hooksId, utils_1.getHashCode(options)]);
    return [doc, loading, error, unsubscribe.fn];
}
exports.useSubscribeDocBase = useSubscribeDocBase;
function useSubscribeDocSnapshot(path, options) {
    return useSubscribeDocBase(path, null, getFunctions_1.subscribeDocSnapshot, options);
}
exports.useSubscribeDocSnapshot = useSubscribeDocSnapshot;
function useSubscribeDoc(path, options) {
    return useSubscribeDocBase(path, __1.initialDocData, getFunctions_1.subscribeDoc, options);
}
exports.useSubscribeDoc = useSubscribeDoc;
