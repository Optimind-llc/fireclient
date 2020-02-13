"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var setFunctions_1 = require("../setFunctions");
var typeCheck = __importStar(require("../typeCheck"));
var typeCheck_1 = require("../typeCheck");
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
    var _a = react_1.useState(false), deleting = _a[0], setDeleting = _a[1];
    var _b = react_1.useState(false), called = _b[0], setCalled = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var deleteFn = function () {
        setDeleting(true);
        setCalled(true);
        setFunctions_1.deleteDoc(docPath, function () {
            var _a;
            setError(null);
            setDeleting(false);
            if (((_a = options) === null || _a === void 0 ? void 0 : _a.callback) !== undefined)
                options.callback();
        }, function (err) {
            setError(err);
            setDeleting(false);
        }, options);
    };
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
    var _a = react_1.useState(false), deleting = _a[0], setDeleting = _a[1];
    var _b = react_1.useState(false), called = _b[0], setCalled = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var deleteFn = function () {
        setDeleting(true);
        setCalled(true);
        Promise.all(docPaths.map(function (docPath) { return new Promise(function (resolve, reject) { return setFunctions_1.deleteDoc(docPath, resolve, reject, options); }); }))
            .then(function () {
            var _a;
            setError(null);
            setDeleting(false);
            if (((_a = options) === null || _a === void 0 ? void 0 : _a.callback) !== undefined)
                options.callback();
        })
            .catch(function (err) {
            setError(err);
            setDeleting(false);
        });
    };
    return [deleteFn, deleting, called, error];
}
exports.useDeleteDocs = useDeleteDocs;
