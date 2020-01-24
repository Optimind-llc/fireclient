"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var pathlib = __importStar(require("path"));
var provider_1 = require("./provider");
var utils_1 = require("./utils");
var onAccess = function () { return console.log("fireclient accessed"); };
function getDocSnapshot(path, onGet, onError, acceptOutdated) {
    if (acceptOutdated === void 0) { acceptOutdated = false; }
    var docId = pathlib.resolve(path);
    var _a = provider_1.getContext(), dispatch = _a.dispatch, firestoreDB = _a.firestoreDB;
    try {
        var ref = firestoreDB.doc(path);
        onAccess();
        ref
            .get()
            .then(function (doc) {
            utils_1.saveDoc(dispatch, docId, utils_1.createDataFromDoc(doc));
            onGet(doc);
        })
            .catch(onError);
    }
    catch (err) {
        onError(err);
    }
}
exports.getDocSnapshot = getDocSnapshot;
function getDoc(path, onGet, onError, acceptOutdated) {
    if (acceptOutdated === void 0) { acceptOutdated = false; }
    var _a, _b;
    var docId = pathlib.resolve(path);
    var _c = provider_1.getContext(), state = _c.state, dispatch = _c.dispatch, firestoreDB = _c.firestoreDB;
    // state内でsubscribeされているかチェック
    var cache = state.get("doc").get(docId);
    if (cache !== undefined && (acceptOutdated || ((_b = (_a = cache) === null || _a === void 0 ? void 0 : _a.get("connectedFrom")) === null || _b === void 0 ? void 0 : _b.size) > 0)) {
        var docCache = cache.get("data");
        onGet(docCache);
        return;
    }
    getDocSnapshot(path, function (doc) { return onGet(utils_1.createDataFromDoc(doc)); }, onError);
}
exports.getDoc = getDoc;
function subscribeDocSnapshot(uuid, path, onChange, onError, onListen) {
    if (onListen === void 0) { onListen = function () { }; }
    var docId = pathlib.resolve(path);
    var _a = provider_1.getContext(), dispatch = _a.dispatch, firestoreDB = _a.firestoreDB;
    try {
        var ref = firestoreDB.doc(path);
        onAccess();
        var unsubscribe_1 = ref.onSnapshot(function (doc) {
            onListen();
            utils_1.saveDoc(dispatch, docId, utils_1.createDataFromDoc(doc));
            utils_1.connectDocToState(dispatch, docId, uuid);
            onChange(doc);
        }, onError);
        return function () {
            unsubscribe_1();
            utils_1.disconnectDocFromState(dispatch, docId, uuid);
        };
    }
    catch (err) {
        onError(err);
        return function () { };
    }
}
exports.subscribeDocSnapshot = subscribeDocSnapshot;
function subscribeDoc(uuid, path, onChange, onError, onListen) {
    if (onListen === void 0) { onListen = function () { }; }
    return subscribeDocSnapshot(uuid, path, function (doc) { return onChange(utils_1.createDataFromDoc(doc)); }, onError, onListen);
}
exports.subscribeDoc = subscribeDoc;
function getCollectionSnapshot(path, onGet, onError, option, acceptOutdated) {
    if (option === void 0) { option = {}; }
    if (acceptOutdated === void 0) { acceptOutdated = false; }
    var _a = provider_1.getContext(), dispatch = _a.dispatch, firestoreDB = _a.firestoreDB;
    try {
        var ref = utils_1.withOption(firestoreDB.collection(path), option);
        onAccess();
        ref
            .get()
            .then(function (collection) {
            utils_1.saveCollection(dispatch, path, option, utils_1.createDataFromCollection(collection.docs));
            onGet(collection.docs);
        })
            .catch(onError);
    }
    catch (err) {
        onError(err);
    }
}
exports.getCollectionSnapshot = getCollectionSnapshot;
function getCollection(path, onGet, onError, option, acceptOutdated) {
    if (option === void 0) { option = {}; }
    if (acceptOutdated === void 0) { acceptOutdated = false; }
    var _a, _b;
    var collectionId = utils_1.getQueryId(path, option);
    var _c = provider_1.getContext(), state = _c.state, dispatch = _c.dispatch, firestoreDB = _c.firestoreDB;
    // state内でsubscribeされているかチェック
    var cache = state.get("collection").get(collectionId);
    if (cache !== undefined && (acceptOutdated || ((_b = (_a = cache) === null || _a === void 0 ? void 0 : _a.get("connectedFrom")) === null || _b === void 0 ? void 0 : _b.size) > 0)) {
        var docIds = cache.get("docIds").map(function (id) { return pathlib.resolve(path, id); });
        var collectionCache = docIds
            .map(function (docId) {
            return state
                .get("doc")
                .get(docId)
                .get("data");
        })
            .toJS();
        onGet(collectionCache);
        return;
    }
    getCollectionSnapshot(path, function (collection) { return onGet(utils_1.createDataFromCollection(collection)); }, onError, option);
}
exports.getCollection = getCollection;
function subscribeCollectionSnapshot(uuid, path, onChange, onError, onListen, option) {
    if (onListen === void 0) { onListen = function () { }; }
    if (option === void 0) { option = {}; }
    var collectionId = utils_1.getQueryId(path, option);
    var _a = provider_1.getContext(), dispatch = _a.dispatch, firestoreDB = _a.firestoreDB;
    var docIds = immutable_1.List();
    try {
        var ref = utils_1.withOption(firestoreDB.collection(path), option);
        onAccess();
        var unsubscribe_2 = ref.onSnapshot(function (collection) {
            onListen();
            // docIdsを更新
            // 対象から外れたdocをunsubscribeする
            var nextDocIds = immutable_1.List(collection.docs.map(function (doc) { return pathlib.resolve(path, doc.id); }));
            var decreased = docIds.filter(function (id) { return nextDocIds.indexOf(id) === -1; });
            decreased.forEach(function (docId) { return utils_1.disconnectDocFromState(dispatch, docId, uuid); });
            docIds = nextDocIds;
            utils_1.saveCollection(dispatch, path, option, utils_1.createDataFromCollection(collection.docs));
            utils_1.connectCollectionToState(dispatch, collectionId, uuid, docIds);
            onChange(collection.docs);
        }, onError);
        return function () {
            unsubscribe_2();
            utils_1.disconnectCollectionFromState(dispatch, collectionId, uuid, docIds);
        };
    }
    catch (err) {
        onError(err);
        return function () { };
    }
}
exports.subscribeCollectionSnapshot = subscribeCollectionSnapshot;
function subscribeCollection(uuid, path, onChange, onError, onListen, option) {
    if (onListen === void 0) { onListen = function () { }; }
    if (option === void 0) { option = {}; }
    return subscribeCollectionSnapshot(uuid, path, function (collection) { return onChange(utils_1.createDataFromCollection(collection)); }, onError, onListen, option);
}
exports.subscribeCollection = subscribeCollection;
