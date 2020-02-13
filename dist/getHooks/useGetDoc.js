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
    var _a = react_1.useState(null), error = _a[0], setError = _a[1];
    var _b = react_1.useState(initialValue), doc = _b[0], setDoc = _b[1];
    var _c = react_1.useState(!lazy), loading = _c[0], setLoading = _c[1];
    var loadDoc = function () {
        var _a, _b;
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
        }, (_a = options) === null || _a === void 0 ? void 0 : _a.saveToState, (_b = options) === null || _b === void 0 ? void 0 : _b.acceptOutdated);
    };
    // Automatically excecute loadDoc() if lazy
    if (!lazy)
        react_1.useEffect(function () { return loadDoc(); }, [path, utils_1.getHashCode(options)]);
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
