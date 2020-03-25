"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ismounted_1 = __importDefault(require("ismounted"));
var react_1 = require("react");
var setFunctions_1 = require("../setFunctions");
var typeCheck = __importStar(require("../typeCheck"));
var typeCheck_1 = require("../typeCheck");
function useSetDocsBase(queries, setFunction, options) {
    // Argument typeCheck
    typeCheck_1.assertRule([
        {
            key: "options",
            optional: true,
            fn: typeCheck_1.matches(typeCheck.concatRule(typeCheck.mergeRule, typeCheck.callbackRule, typeCheck.saveToStateRule)),
        },
    ])({ options: options }, "Argument");
    typeCheck.assertSetDocsFql(queries);
    var isMounted = ismounted_1.default();
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
                typeCheck_1.assertStaticSetFql(queryObject);
                setFunction(path, queryObject, resolve, reject, options);
            });
        }))
            .then(function () {
            var _a;
            if (isMounted.current) {
                setError(null);
                setWriting(false);
            }
            if ((_a = options) === null || _a === void 0 ? void 0 : _a.callback)
                options.callback();
        })
            .catch(function (err) {
            if (isMounted.current) {
                setError(err);
                setWriting(false);
            }
        });
    };
    return [writeFn, writing, called, error];
}
function useSetDocs(queries, options) {
    return useSetDocsBase(queries, setFunctions_1.setDoc, options);
}
exports.useSetDocs = useSetDocs;
function useUpdateDocs(queries, options) {
    return useSetDocsBase(queries, setFunctions_1.updateDoc, options);
}
exports.useUpdateDocs = useUpdateDocs;
