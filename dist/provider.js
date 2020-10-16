"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertStateToJson = exports.getContext = exports.useSetContext = exports.providerContext = exports.Context = void 0;
var immutable_1 = require("immutable");
var react_1 = __importDefault(require("react"));
var reducer_1 = __importDefault(require("./reducer"));
var typeCheck_1 = require("./typeCheck");
exports.Context = react_1.default.createContext(null);
// ライブラリ内で共有する Context
exports.providerContext = {
    state: null,
    dispatch: null,
    firestoreDB: null,
    onAccess: function () {
        /* do nothing */
    },
};
var initialState = immutable_1.Map({
    doc: immutable_1.Map(),
    collection: immutable_1.Map(),
});
// for testing
function useSetContext(firestoreDB, onAccess) {
    typeCheck_1.assert(firestoreDB !== undefined, "firestoreDB props of Provider is undefined");
    typeCheck_1.assert(firestoreDB !== null, "firestoreDB props of Provider is null");
    var _a = react_1.default.useReducer(reducer_1.default, initialState), state = _a[0], dispatch = _a[1];
    // Provider呼び出し時にライブラリ共有 Contextをセットする
    exports.providerContext.state = state;
    exports.providerContext.dispatch = dispatch;
    exports.providerContext.firestoreDB = firestoreDB;
    if (onAccess) {
        exports.providerContext.onAccess = onAccess;
    }
}
exports.useSetContext = useSetContext;
function getContext() {
    var state = exports.providerContext.state, dispatch = exports.providerContext.dispatch, firestoreDB = exports.providerContext.firestoreDB, onAccess = exports.providerContext.onAccess;
    if (state === null || dispatch === null || firestoreDB === null) {
        throw Error("state, dispatch, db is null.\n    You should use <Provider> in parent component.");
    }
    return { state: state, dispatch: dispatch, firestoreDB: firestoreDB, onAccess: onAccess };
}
exports.getContext = getContext;
/**
 *
 * @param state {FireclientState} - This can be obtained via `context`.
 * @example
 * import { useContext } from "React";
 * import { contertStateToJson, Context } from "react-fireclient";;
 * function Component() {
 *    const { state } = useContext(Context);
 *    const json = convertStateToJson(state);
 */
function convertStateToJson(state) {
    return JSON.stringify(state, null, 4);
}
exports.convertStateToJson = convertStateToJson;
function Provider(_a) {
    var children = _a.children, firestoreDB = _a.firestoreDB, onAccess = _a.onAccess;
    useSetContext(firestoreDB, onAccess);
    var state = exports.providerContext.state, dispatch = exports.providerContext.dispatch;
    return (react_1.default.createElement(exports.Context.Provider, { value: {
            state: state,
            dispatch: dispatch,
        } }, children));
}
exports.default = Provider;
