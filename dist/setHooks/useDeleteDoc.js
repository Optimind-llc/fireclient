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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDeleteDocs = exports.useDeleteDoc = void 0;
var react_1 = require("react");
var isMounted_1 = __importDefault(require("../isMounted"));
var setFunctions_1 = require("../setFunctions");
var typeCheck = __importStar(require("../typeCheck"));
var typeCheck_1 = require("../typeCheck");
var utils_1 = require("../utils");
function useDeleteDoc(docPath, options) {
    // Argument typeCheck
    typeCheck_1.assertRule([
        { key: "docPath", fn: typeCheck.isString },
        {
            key: "options",
            optional: true,
            fn: typeCheck_1.matches(typeCheck.concatRule(typeCheck.callbackRule, typeCheck.saveToStateRule)),
        },
    ])({ docPath: docPath, options: options }, "Argument");
    var isMounted = isMounted_1.default();
    var _a = react_1.useState(false), deleting = _a[0], setDeleting = _a[1];
    var _b = react_1.useState(false), called = _b[0], setCalled = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var deleteFn = react_1.useCallback(function () {
        setDeleting(true);
        setCalled(true);
        setFunctions_1.deleteDoc(docPath, function () {
            if (isMounted.current) {
                setError(null);
                setDeleting(false);
            }
            if (options === null || options === void 0 ? void 0 : options.callback)
                options.callback();
        }, function (err) {
            if (isMounted.current) {
                setError(err);
                setDeleting(false);
            }
        }, options);
    }, [docPath, utils_1.getHashCode(options), isMounted.current]);
    return [deleteFn, deleting, called, error];
}
exports.useDeleteDoc = useDeleteDoc;
function useDeleteDocs(docPaths, query, options) {
    // Argument typeCheck
    typeCheck_1.assertRule([
        { key: "docPaths", fn: typeCheck.isArrayOf(typeCheck.isString) },
        {
            key: "options",
            optional: true,
            fn: typeCheck_1.matches(typeCheck.concatRule(typeCheck.callbackRule, typeCheck.saveToStateRule)),
        },
    ])({ docPaths: docPaths, options: options }, "Argument");
    var isMounted = isMounted_1.default();
    var _a = react_1.useState(false), deleting = _a[0], setDeleting = _a[1];
    var _b = react_1.useState(false), called = _b[0], setCalled = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var deleteFn = react_1.useCallback(function () {
        setDeleting(true);
        setCalled(true);
        Promise.all(docPaths.map(function (docPath) { return new Promise(function (resolve, reject) { return setFunctions_1.deleteDoc(docPath, resolve, reject, options); }); }))
            .then(function () {
            if (isMounted.current) {
                setError(null);
                setDeleting(false);
            }
            if (options === null || options === void 0 ? void 0 : options.callback)
                options.callback();
        })
            .catch(function (err) {
            if (isMounted.current) {
                setError(err);
                setDeleting(false);
            }
        });
    }, __spreadArrays(docPaths, [utils_1.getHashCode(options), isMounted.current]));
    return [deleteFn, deleting, called, error];
}
exports.useDeleteDocs = useDeleteDocs;
