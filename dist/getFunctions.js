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
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeCollection = exports.subscribeCollectionSnapshot = exports.getCollection = exports.getCollectionSnapshot = exports.subscribeDoc = exports.subscribeDocSnapshot = exports.getDoc = exports.getDocSnapshot = void 0;
var immutable_1 = require("immutable");
var pathlib = __importStar(require("path"));
var provider_1 = require("./provider");
var utils_1 = require("./utils");
/**
 * DocのSnapshotを取得する
 * saveToState == true の場合
 * 取得時にproviderContext内のstateに取得内容を保存する
 * @param path 取得対象のFirestore上のPath
 * @param onGet 取得した際のCallback
 * @param onError Errorが発生した際のCallback
 * @param saveToState 取得した内容をStateに保存するかを決める
 */
function getDocSnapshot(path, onGet, onError, saveToState) {
    if (saveToState === void 0) { saveToState = true; }
    var docId = pathlib.resolve(path);
    var _a = provider_1.getContext(), dispatch = _a.dispatch, firestoreDB = _a.firestoreDB, onAccess = _a.onAccess;
    try {
        onAccess();
        var ref = firestoreDB.doc(path);
        ref
            .get()
            .then(function (doc) {
            if (saveToState)
                utils_1.saveDoc(dispatch, docId, utils_1.createDataFromDoc(doc));
            onGet(doc);
        })
            .catch(function (err) {
            console.error(err);
            onError(err);
        });
    }
    catch (err) {
        console.error(err);
        onError(err);
    }
}
exports.getDocSnapshot = getDocSnapshot;
/**
 * DocをDocDataの形で取得する
 * saveToState == true の場合
 * 取得時にproviderContext内のstateに取得内容を保存する
 * @param path 取得対象のFirestore上のPath
 * @param onGet 取得した際のCallback
 * @param onError Errorが発生した際のCallback
 * @param saveToState 取得した内容をStateに保存するかを決める
 * @param acceptOutdated 取得対象のCacheが残っていた場合それを使用する
 */
function getDoc(path, onGet, onError, saveToState, acceptOutdated) {
    var _a;
    if (acceptOutdated === void 0) { acceptOutdated = false; }
    var docId = pathlib.resolve(path);
    var state = provider_1.getContext().state;
    // state内でsubscribeされているかチェック
    var cache = state.get("doc").get(docId);
    if (cache && (acceptOutdated || ((_a = cache.get("connectedFrom")) === null || _a === void 0 ? void 0 : _a.size) > 0)) {
        var docCache = cache.get("data");
        onGet(docCache);
        return;
    }
    getDocSnapshot(path, function (doc) { return onGet(utils_1.createDataFromDoc(doc)); }, onError, saveToState);
}
exports.getDoc = getDoc;
/**
 * DocのSnapshotをSubscribeする
 * saveToState == true の場合
 * 取得時にproviderContext内のstateに取得内容を保存する
 * @param hooksId どこからSubscribeされているかを表す
 * @param path 対象のDocのFireclient上でのPath
 * @param onChange データを取得した際のCallback
 * @param onError Errorが発生した際のCallback
 * @param onListen データを取得する直前に実行されるCallback
 * @param saveToState 取得した内容をStateに保存するかを決める
 */
function subscribeDocSnapshot(hooksId, path, onChange, onError, onListen, saveToState) {
    if (onListen === void 0) { onListen = function () {
        /* do nothing */
    }; }
    if (saveToState === void 0) { saveToState = true; }
    var docId = pathlib.resolve(path);
    var _a = provider_1.getContext(), dispatch = _a.dispatch, firestoreDB = _a.firestoreDB, onAccess = _a.onAccess;
    try {
        onAccess();
        var ref = firestoreDB.doc(path);
        var unsubscribe_1 = ref.onSnapshot(function (doc) {
            onListen();
            if (saveToState) {
                utils_1.saveDoc(dispatch, docId, utils_1.createDataFromDoc(doc));
                utils_1.connectDocToState(dispatch, docId, hooksId);
            }
            onChange(doc);
        }, function (err) {
            console.log(err);
            onError(err);
        });
        return function () {
            unsubscribe_1();
            utils_1.disconnectDocFromState(dispatch, docId, hooksId);
        };
    }
    catch (err) {
        console.error(err);
        onError(err);
        return function () {
            /* do nothing */
        };
    }
}
exports.subscribeDocSnapshot = subscribeDocSnapshot;
/**
 * DocをDocDataの形でSubscribeする
 * saveToState == true の場合
 * 取得時にproviderContext内のstateに取得内容を保存する
 * @param hooksId どこからSubscribeされているかを表す
 * @param path 対象のDocのFireclient上でのPath
 * @param onChange データを取得した際のCallback
 * @param onError Errorが発生した際のCallback
 * @param onListen データを取得する直前に実行されるCallback
 * @param saveToState 取得した内容をStateに保存するかを決める
 */
function subscribeDoc(hooksId, path, onChange, onError, onListen, saveToState) {
    if (onListen === void 0) { onListen = function () {
        /* do nothing */
    }; }
    return subscribeDocSnapshot(hooksId, path, function (doc) { return onChange(utils_1.createDataFromDoc(doc)); }, onError, onListen, saveToState);
}
exports.subscribeDoc = subscribeDoc;
/**
 * CollectionのSnapshotを取得する
 * saveToState == true の場合
 * 取得時にproviderContext内のstateに取得内容を保存する
 * @param path 取得対象のFirestore上のPath
 * @param onGet 取得した際のCallback
 * @param onError Errorが発生した際のCallback
 * @param options Collectionを取得する際のOption. Where Limit Order Cursor などを含む
 * @param saveToState 取得した内容をStateに保存するかを決める
 */
function getCollectionSnapshot(path, onGet, onError, options, saveToState) {
    if (options === void 0) { options = {}; }
    if (saveToState === void 0) { saveToState = true; }
    var _a = provider_1.getContext(), dispatch = _a.dispatch, firestoreDB = _a.firestoreDB, onAccess = _a.onAccess;
    try {
        onAccess();
        var ref = utils_1.withOption(firestoreDB.collection(path), options);
        ref
            .get()
            .then(function (collection) {
            if (saveToState)
                utils_1.saveCollection(dispatch, path, options, utils_1.createDataFromCollection(collection.docs));
            onGet(collection.docs);
        })
            .catch(function (err) {
            console.error(err);
            onError(err);
        });
    }
    catch (err) {
        console.error(err);
        onError(err);
    }
}
exports.getCollectionSnapshot = getCollectionSnapshot;
/**
 * CollectionをCollectionDataの形で取得する
 * saveToState == true の場合
 * 取得時にproviderContext内のstateに取得内容を保存する
 * @param path 取得対象のFirestore上のPath
 * @param onGet 取得した際のCallback
 * @param onError Errorが発生した際のCallback
 * @param options Collectionを取得する際のOption. Where Limit Order Cursor などを含む
 * @param saveToState 取得した内容をStateに保存するかを決める
 * @param acceptOutdated 取得対象のCacheが残っていた場合それを使用する
 */
function getCollection(path, onGet, onError, options, saveToState, acceptOutdated) {
    var _a;
    if (options === void 0) { options = {}; }
    if (acceptOutdated === void 0) { acceptOutdated = false; }
    var collectionId = utils_1.getQueryId(path, options);
    var state = provider_1.getContext().state;
    // state内でsubscribeされているかチェック
    var cache = state.get("collection").get(collectionId);
    if (cache && (acceptOutdated || ((_a = cache.get("connectedFrom")) === null || _a === void 0 ? void 0 : _a.size) > 0)) {
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
    getCollectionSnapshot(path, function (collection) { return onGet(utils_1.createDataFromCollection(collection)); }, onError, options, saveToState);
}
exports.getCollection = getCollection;
/**
 * CollectionのSnapshotをSubscribeする
 * saveToState == true の場合
 * 取得時にproviderContext内のstateに取得内容を保存する
 * @param hooksId どこからSubscribeされているかを表す
 * @param path 対象のDocのFireclient上でのPath
 * @param onChange データを取得した際のCallback
 * @param onError Errorが発生した際のCallback
 * @param onListen データを取得する直前に実行されるCallback
 * @param options Collectionを取得する際のOption. Where Limit Order Cursor などを含む
 * @param saveToState 取得した内容をStateに保存するかを決める
 */
function subscribeCollectionSnapshot(hooksId, path, onChange, onError, onListen, options, saveToState) {
    if (onListen === void 0) { onListen = function () {
        /* do nothing */
    }; }
    if (options === void 0) { options = {}; }
    if (saveToState === void 0) { saveToState = true; }
    var collectionId = utils_1.getQueryId(path, options);
    var _a = provider_1.getContext(), dispatch = _a.dispatch, firestoreDB = _a.firestoreDB, onAccess = _a.onAccess;
    var docIds = immutable_1.List();
    try {
        onAccess();
        var ref = utils_1.withOption(firestoreDB.collection(path), options);
        var unsubscribe_2 = ref.onSnapshot(function (collection) {
            onListen();
            // docIdsを更新
            // 対象から外れたdocをunsubscribeする
            var nextDocIds = immutable_1.List(collection.docs.map(function (doc) { return pathlib.resolve(path, doc.id); }));
            var decreased = docIds.filter(function (id) { return nextDocIds.indexOf(id) === -1; });
            decreased.forEach(function (docId) { return utils_1.disconnectDocFromState(dispatch, docId, hooksId); });
            docIds = nextDocIds;
            if (saveToState) {
                utils_1.saveCollection(dispatch, path, options, utils_1.createDataFromCollection(collection.docs));
                utils_1.connectCollectionToState(dispatch, collectionId, hooksId, docIds);
            }
            onChange(collection.docs);
        }, function (err) {
            console.error(err);
            onError(err);
        });
        return function () {
            unsubscribe_2();
            utils_1.disconnectCollectionFromState(dispatch, collectionId, hooksId, docIds);
        };
    }
    catch (err) {
        console.error(err);
        onError(err);
        return function () {
            /* do nothing */
        };
    }
}
exports.subscribeCollectionSnapshot = subscribeCollectionSnapshot;
/**
 * CollectionをCollectionDataの形でSubscribeする
 * saveToState == true の場合
 * 取得時にproviderContext内のstateに取得内容を保存する
 * @param hooksId どこからSubscribeされているかを表す
 * @param path 対象のDocのFireclient上でのPath
 * @param onChange データを取得した際のCallback
 * @param onError Errorが発生した際のCallback
 * @param onListen データを取得する直前に実行されるCallback
 * @param options Collectionを取得する際のOption. Where Limit Order Cursor などを含む
 * @param saveToState 取得した内容をStateに保存するかを決める
 */
function subscribeCollection(hooksId, path, onChange, onError, onListen, options, saveToState) {
    if (onListen === void 0) { onListen = function () {
        /* do nothing */
    }; }
    if (options === void 0) { options = {}; }
    return subscribeCollectionSnapshot(hooksId, path, function (collection) { return onChange(utils_1.createDataFromCollection(collection)); }, onError, onListen, options, saveToState);
}
exports.subscribeCollection = subscribeCollection;
