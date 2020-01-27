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
var setFunctions_1 = require("./setFunctions");
var validation = __importStar(require("./validation"));
var validation_1 = require("./validation");
// ------------------------------------------
//  Set Hooks Base
// ------------------------------------------
function useSetBase(path, query, setFunction, option) {
    // Arg validation
    validation_1.assertRule([
        { key: "path", fn: validation.isString },
        {
            key: "option",
            optional: true,
            fn: validation_1.matches(validation.mergeRule.concat(validation.callbackRule)),
        },
    ])({ path: path, option: option }, "Argument");
    validation.assertSetDocQuery(query);
    var _a = react_1.useState(false), writing = _a[0], setWriting = _a[1];
    var _b = react_1.useState(false), called = _b[0], setCalled = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    // ObjectでQueryを指定していた場合Functionに変換する
    var queryGenerator = query instanceof Function ? query : function () { return query; };
    var writeFn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var queryObject = queryGenerator.apply(void 0, args);
        validation_1.assertSetDocQueryObject(queryObject);
        setWriting(true);
        setCalled(true);
        setFunction(path, queryGenerator.apply(void 0, args), function () {
            var _a;
            setError(null);
            setWriting(false);
            if (((_a = option) === null || _a === void 0 ? void 0 : _a.callback) !== undefined)
                option.callback();
        }, function (err) {
            setError(err);
            setWriting(false);
        }, option);
    };
    return [writeFn, writing, called, error];
}
function useSetDocsBase(queries, setFunction, option) {
    // Arg validation
    validation_1.assertRule([
        {
            key: "option",
            optional: true,
            fn: validation_1.matches(validation.mergeRule.concat(validation.callbackRule)),
        },
    ])({ option: option }, "Argument");
    validation.assertSetDocsQuery(queries);
    var _a = react_1.useState(false), writing = _a[0], setWriting = _a[1];
    var _b = react_1.useState(false), called = _b[0], setCalled = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var queryEntries = Object.entries(queries);
    var writeFn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        setWriting(true);
        setCalled(true);
        Promise.all(queryEntries.map(function (_a) {
            var path = _a[0], query = _a[1];
            return new Promise(function (resolve, reject) {
                var queryGenerator = query instanceof Function ? query : function () { return query; };
                var queryObject = queryGenerator.apply(void 0, args);
                validation_1.assertSetDocQueryObject(queryObject);
                setFunction(path, queryObject, resolve, reject, option);
            });
        }))
            .then(function () {
            var _a;
            setError(null);
            setWriting(false);
            if (((_a = option) === null || _a === void 0 ? void 0 : _a.callback) !== undefined)
                option.callback();
        })
            .catch(function (err) {
            setError(err);
            setWriting(false);
        });
    };
    return [writeFn, writing, called, error];
}
function useSetDocBase(path, query, setFunction, option) {
    // Arg validation
    validation.assertSetDocQuery(query);
    validation_1.matches([
        { key: "path", fn: validation.isString },
        {
            key: "option",
            fn: validation_1.matches(validation.queryOptionRule.concat(validation.acceptOutdatedRule)),
        },
    ])({ path: path, option: option }, "Argument");
    return useSetBase(path, query, setFunction, option);
}
function useSetCollectionBase(path, queries, setFunction, option) {
    // Arg validation
    validation.assertSetCollectionQuery(queries);
    validation_1.matches([
        { key: "path", fn: validation.isString },
        {
            key: "option",
            fn: validation_1.matches(validation.queryOptionRule.concat(validation.acceptOutdatedRule)),
        },
    ])({ path: path, option: option }, "Argument");
    return useSetBase(path, queries, setFunction, option);
}
// ------------------------------------------
//  Set Doc Hooks
// ------------------------------------------
function useSetDoc(docPath, query, option) {
    return useSetDocBase(docPath, query, setFunctions_1.setDoc, option);
}
exports.useSetDoc = useSetDoc;
function useAddDoc(collectionPath, query, option) {
    return useSetDocBase(collectionPath, query, setFunctions_1.addDoc, option);
}
exports.useAddDoc = useAddDoc;
function useUpdateDoc(docPath, query, option) {
    return useSetDocBase(docPath, query, setFunctions_1.updateDoc, option);
}
exports.useUpdateDoc = useUpdateDoc;
// ------------------------------------------
//  Set Docs Hooks
// ------------------------------------------
function useAddDocs(queries, option) {
    return useSetDocsBase(queries, setFunctions_1.addDoc, option);
}
exports.useAddDocs = useAddDocs;
function useSetDocs(queries, option) {
    return useSetDocsBase(queries, setFunctions_1.setDoc, option);
}
exports.useSetDocs = useSetDocs;
function useUpdateDocs(queries, option) {
    return useSetDocsBase(queries, setFunctions_1.updateDoc, option);
}
exports.useUpdateDocs = useUpdateDocs;
// ------------------------------------------
//  Set Collection Hooks
// ------------------------------------------
function useSetCollection(collectionPath, query, option) {
    return useSetCollectionBase(collectionPath, query, setFunctions_1.setCollection, option);
}
exports.useSetCollection = useSetCollection;
