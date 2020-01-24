"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var pathlib = __importStar(require("path"));
var provider_1 = require("./provider");
var utils_1 = require("./utils");
function addDoc(path, query, onSet, onError) {
    var _a = provider_1.getContext(), firestoreDB = _a.firestoreDB, dispatch = _a.dispatch;
    var fields = query.fields;
    try {
        var ref = firestoreDB.collection(path);
        ref
            .add(fields)
            .then(function (doc) {
            var docId = pathlib.resolve(path, doc.id);
            var data = utils_1.createDataFromDoc(doc);
            utils_1.saveDoc(dispatch, docId, data);
            onSet(data);
        })
            .catch(function (err) { return onError(err); });
    }
    catch (err) {
        onError(err);
    }
}
exports.addDoc = addDoc;
function setDoc(path, query, onSet, onError) {
    var _a = provider_1.getContext(), firestoreDB = _a.firestoreDB, dispatch = _a.dispatch;
    var docId = pathlib.resolve(path);
    var fields = query.fields;
    var docData = {
        data: fields,
        id: pathlib.basename(path),
    };
    try {
        var ref = firestoreDB.doc(path);
        ref
            .set(fields)
            .then(function () {
            utils_1.saveDoc(dispatch, docId, docData);
            onSet();
        })
            .catch(function (err) { return onError(err); });
    }
    catch (err) {
        onError(err);
    }
}
exports.setDoc = setDoc;
function updateDoc(path, query, onUpdate, onError) {
    var _a = provider_1.getContext(), firestoreDB = _a.firestoreDB, dispatch = _a.dispatch;
    var docId = pathlib.resolve(path);
    var fields = query.fields;
    var docData = {
        data: fields,
        id: pathlib.basename(path),
    };
    try {
        var ref = firestoreDB.doc(path);
        ref
            .update(fields)
            .then(function () {
            utils_1.saveDoc(dispatch, docId, docData);
            onUpdate();
        })
            .catch(function (err) { return onError(err); });
    }
    catch (err) {
        onError(err);
    }
}
exports.updateDoc = updateDoc;
