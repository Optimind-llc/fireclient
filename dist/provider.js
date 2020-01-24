"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("firebase/firestore");
var immutable_1 = require("immutable");
var react_1 = __importDefault(require("react"));
var reducer_1 = __importDefault(require("./reducer"));
var validation_1 = require("./validation");
exports.Context = react_1.default.createContext(null);
// ライブラリ内で共有する Context
exports.providerContext = {
    state: null,
    dispatch: null,
    firestoreDB: null,
};
var initialState = immutable_1.Map({
    doc: immutable_1.Map(),
    collection: immutable_1.Map(),
});
function getContext() {
    var state = exports.providerContext.state, dispatch = exports.providerContext.dispatch, firestoreDB = exports.providerContext.firestoreDB;
    if (state === null || dispatch === null || firestoreDB === null) {
        throw Error("state, dispatch, db is null.\n    You should use <Provider> in parent component.");
    }
    return { state: state, dispatch: dispatch, firestoreDB: firestoreDB };
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
    var children = _a.children, firestoreDB = _a.firestoreDB, _b = _a.onAccess, onAccess = _b === void 0 ? function () { } : _b;
    validation_1.assert(firestoreDB !== undefined, "firestoreDB props of Provider is undefined");
    validation_1.assert(firestoreDB !== null, "firestoreDB props of Provider is null");
    var _c = react_1.default.useReducer(reducer_1.default, initialState), state = _c[0], dispatch = _c[1];
    // Provider呼び出し時にライブラリ共有 Contextをセットする
    exports.providerContext.state = state;
    exports.providerContext.dispatch = dispatch;
    exports.providerContext.firestoreDB = firestoreDB;
    return (react_1.default.createElement(exports.Context.Provider, { value: {
            state: state,
            dispatch: dispatch,
        } }, children));
}
exports.default = Provider;
