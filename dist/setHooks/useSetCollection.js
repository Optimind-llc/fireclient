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
exports.useSetCollection = void 0;
var react_1 = require("react");
var isMounted_1 = __importDefault(require("../isMounted"));
var setFunctions_1 = require("../setFunctions");
var typeCheck = __importStar(require("../typeCheck"));
var typeCheck_1 = require("../typeCheck");
var utils_1 = require("../utils");
function useSetCollectionBase(path, queries, setFunction, options) {
    // Argument typeCheck
    typeCheck.assertSetCollectionFql(queries);
    typeCheck_1.matches([
        { key: "path", fn: typeCheck.isString },
        {
            key: "options",
            optional: true,
            fn: typeCheck_1.matches(typeCheck.concatRule(typeCheck.mergeRule, typeCheck.callbackRule, typeCheck.saveToStateRule)),
        },
    ])({ path: path, options: options }, "Argument");
    var isMounted = isMounted_1.default();
    var _a = react_1.useState(false), writing = _a[0], setWriting = _a[1];
    var _b = react_1.useState(false), called = _b[0], setCalled = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    // ObjectでQueryを指定していた場合Functionに変換する
    var queryGenerators = queries.map(function (query) { return (query instanceof Function ? query : function () { return query; }); });
    var writeFn = react_1.useCallback(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var queryObject = queryGenerators.map(function (queryGenerator) { return queryGenerator.apply(void 0, args); });
        typeCheck_1.assertStaticSetFql(queryObject);
        setWriting(true);
        setCalled(true);
        setFunction(path, queryObject, function () {
            if (isMounted.current) {
                setError(null);
                setWriting(false);
            }
            if (options === null || options === void 0 ? void 0 : options.callback)
                options.callback();
        }, function (err) {
            if (isMounted.current) {
                setError(err);
                setWriting(false);
            }
        }, options);
    }, [path, utils_1.getHashCode({ options: options, queryGenerators: queryGenerators }), isMounted.current]);
    return [writeFn, writing, called, error];
}
function useSetCollection(collectionPath, query, options) {
    return useSetCollectionBase(collectionPath, query, setFunctions_1.setCollection, options);
}
exports.useSetCollection = useSetCollection;
