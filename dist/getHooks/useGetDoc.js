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
exports.useGetDoc = exports.useLazyGetDoc = exports.useGetDocSnapshot = exports.useLazyGetDocSnapshot = void 0;
var react_1 = require("react");
var __1 = require("..");
var getFunctions_1 = require("../getFunctions");
var isMounted_1 = __importDefault(require("../isMounted"));
var typeCheck = __importStar(require("../typeCheck"));
var typeCheck_1 = require("../typeCheck");
var utils_1 = require("../utils");
function useGetDocBase(path, initialValue, lazy, getFunction, options) {
    // Argument typeCheck
    typeCheck_1.assertRule([
        { key: "path", fn: typeCheck.isString },
        {
            key: "options",
            optional: true,
            fn: typeCheck.matches(typeCheck.concatRule(typeCheck.callbackRule, typeCheck.acceptOutdatedRule, typeCheck.saveToStateRule)),
        },
    ])({ path: path, options: options }, "Argument");
    var isMounted = isMounted_1.default();
    var _a = react_1.useState(null), error = _a[0], setError = _a[1];
    var _b = react_1.useState(initialValue), doc = _b[0], setDoc = _b[1];
    var _c = react_1.useState(!lazy), loading = _c[0], setLoading = _c[1];
    var optionsHash = utils_1.getHashCode(options);
    var loadDoc = react_1.useCallback(function () {
        setLoading(true);
        getFunction(path, function (data) {
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
        }, options === null || options === void 0 ? void 0 : options.saveToState, options === null || options === void 0 ? void 0 : options.acceptOutdated);
    }, [path, optionsHash, isMounted.current]);
    // Automatically excecute loadDoc() if lazy
    react_1.useEffect(function () {
        if (!lazy)
            loadDoc();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path, optionsHash]);
    return [doc, loading, error, loadDoc];
}
function useLazyGetDocSnapshot(path, options) {
    return useGetDocBase(path, null, true, getFunctions_1.getDocSnapshot, options);
}
exports.useLazyGetDocSnapshot = useLazyGetDocSnapshot;
function useGetDocSnapshot(path, options) {
    return useGetDocBase(path, null, false, getFunctions_1.getDocSnapshot, options);
}
exports.useGetDocSnapshot = useGetDocSnapshot;
function useLazyGetDoc(path, options) {
    return useGetDocBase(path, __1.initialDocData, true, getFunctions_1.getDoc, options);
}
exports.useLazyGetDoc = useLazyGetDoc;
function useGetDoc(path, options) {
    return useGetDocBase(path, __1.initialDocData, false, getFunctions_1.getDoc, options);
}
exports.useGetDoc = useGetDoc;
