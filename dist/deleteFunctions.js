"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var provider_1 = require("./provider");
var utils_1 = require("./utils");
function deleteDoc(path, onDelete, onError, options) {
    if (options === void 0) { options = {}; }
    var _a = provider_1.getContext(), firestoreDB = _a.firestoreDB, dispatch = _a.dispatch, onAccess = _a.onAccess;
    var saveToState = options.saveToState !== false; // default true
    try {
        onAccess();
        firestoreDB
            .doc(path)
            .delete()
            .then(function () {
            if (saveToState)
                utils_1.deleteDocFromState(dispatch, path);
            onDelete();
        })
            .catch(function (err) {
            console.error(err);
            onError(err);
        });
    }
    catch (err) {
        console.error(err);
    }
}
exports.deleteDoc = deleteDoc;
