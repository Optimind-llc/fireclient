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
exports.deleteDoc = exports.setCollection = exports.updateDoc = exports.setDoc = void 0;
var pathlib = __importStar(require("path"));
var provider_1 = require("./provider");
var utils_1 = require("./utils");
/**
 * 書き込み完了時のCallback
 * @param dispatch
 * @param onSet Setする際のCallback
 * @param onError エラーが発生した際のCallback
 * @param docPath Set対象のDocのFirestore上でのPath
 * @param fields Setする内容
 * @param options Setする際のOption
 * @param subCollection Docに持たせるsubCollectionの内容
 */
var setDocCallback = function (dispatch, onSet, onError, docPath, fields, options, subCollection, docRef) {
    var saveToState = (options === null || options === void 0 ? void 0 : options.saveToState) !== false; // default true
    // 書き込んだ内容をStateに保存する
    if (saveToState) {
        var docId = pathlib.basename(docPath);
        var data = utils_1.createData(docId, fields);
        utils_1.saveDoc(dispatch, docPath, data);
    }
    if (!subCollection) {
        // subCollectionがなければ終了
        onSet(docRef);
    }
    else {
        // subCollectionがあればそれぞれを書き込み
        var subCollectionQueries = Object.entries(subCollection);
        Promise.all(subCollectionQueries.map(function (_a) {
            var subCollectionId = _a[0], collectionQuery = _a[1];
            return new Promise(function (resolve, reject) {
                setCollection(pathlib.resolve(docPath, subCollectionId), collectionQuery, resolve, reject, options);
            });
        }))
            .then(function () { return onSet(docRef); })
            .catch(function (err) {
            console.error(err);
            onError(err);
        });
    }
};
/**
 * Docにqueryの内容をsetする
 * DocPathが確定していれば db.doc(DocPath).set() を実行する
 * DocPathが確定していなければ db.collection(CollectionPath).add() を実行する
 * @param path 書込対象のDocのFirestore上でのPath
 * @param query Setする内容
 * @param onSet Setする際のCallback
 * @param onError Errorが発生した際のCallback
 * @param options Setする際のOption
 */
function setDoc(path, query, onSet, onError, options) {
    if (options === void 0) { options = {}; }
    var _a = provider_1.getContext(), firestoreDB = _a.firestoreDB, dispatch = _a.dispatch, onAccess = _a.onAccess;
    var id = query.id, subCollection = query.subCollection;
    var merge = options.merge, mergeFields = options.mergeFields;
    var fields = query.fields ? query.fields : {};
    var isDoc = utils_1.isDocPath(path);
    try {
        onAccess();
        if (isDoc) {
            // doc path が渡された時
            var ref = firestoreDB.doc(path);
            ref
                .set(fields, { merge: merge, mergeFields: mergeFields })
                .then(function () { return setDocCallback(dispatch, onSet, onError, path, fields, options, subCollection); })
                .catch(function (err) {
                console.error(err);
                onError(err);
            });
        }
        else if (id) {
            // collection path と id が渡された時
            var docPath = pathlib.resolve(path, id);
            var ref = firestoreDB.doc(docPath);
            ref
                .set(fields, { merge: merge, mergeFields: mergeFields })
                .then(function () { return setDocCallback(dispatch, onSet, onError, path, fields, options, subCollection); })
                .catch(function (err) {
                console.error(err);
                onError(err);
            });
        }
        else {
            // collection path のみ渡された時（ランダムな doc id が割り振られる）
            var ref = firestoreDB.collection(path);
            ref
                .add(fields)
                .then(function (doc) {
                return setDocCallback(dispatch, onSet, onError, pathlib.resolve(path, doc.id), fields, options, subCollection, doc);
            })
                .catch(function (err) {
                console.error(err);
                onError(err);
            });
        }
    }
    catch (err) {
        console.error(err);
        onError(err);
    }
}
exports.setDoc = setDoc;
/**
 * Docをqueryの内容でUpdateする
 * @param path 書込対象のDocのFirestore上でのPath
 * @param query Updateする内容
 * @param onUpdate Updateする際のCallback
 * @param onError Errorが発生した際のCallback
 * @param options Updateする際のOption
 */
function updateDoc(path, query, onUpdate, onError, options) {
    var _a = provider_1.getContext(), firestoreDB = _a.firestoreDB, dispatch = _a.dispatch, onAccess = _a.onAccess;
    var id = query.id;
    var fields = query.fields ? query.fields : {};
    var isDoc = utils_1.isDocPath(path);
    if (!isDoc && !id) {
        throw new Error("Given path is collection path and doc id is not specified in query.");
    }
    var docPath = isDoc ? path : pathlib.resolve(path, id);
    try {
        onAccess();
        var ref = firestoreDB.doc(docPath);
        ref
            .update(fields)
            .then(function () { return setDocCallback(dispatch, onUpdate, onError, docPath, fields, options); })
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
exports.updateDoc = updateDoc;
/**
 * Collectionをqueriesの内容でSetする
 * @param path 書込対象のDocのFirestore上でのPath
 * @param queries Setする内容
 * @param onSet Setする際のCallback
 * @param onError Errorが発生した際のCallback
 * @param options Setする際のOption
 */
function setCollection(collectionPath, queries, onSet, onError, options) {
    Promise.all(queries.map(function (query) {
        return new Promise(function (resolve, reject) {
            var id = query.id;
            var path = id ? pathlib.resolve(collectionPath, id) : collectionPath;
            setDoc(path, query, resolve, reject, options);
        });
    }))
        .then(onSet)
        .catch(function (err) {
        console.error(err);
        onError(err);
    });
}
exports.setCollection = setCollection;
/**
 * DocをDeleteする
 * @param path 書込対象のDocのFirestore上でのPath
 * @param onDelete Deleteする際のCallback
 * @param onError Errorが発生した際のCallback
 * @param options Setする際のOption
 */
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
