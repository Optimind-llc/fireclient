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
// 書き込み完了時のCallback
var setDocCallback = function (dispatch, onSet, onError, docPath, fields, subCollection) {
    // 書き込んだ内容をStateに保存する
    var docId = pathlib.basename(docPath);
    var data = utils_1.createData(docId, fields);
    utils_1.saveDoc(dispatch, docPath, data);
    if (subCollection === undefined) {
        // subCollectionがなければ終了
        onSet();
    }
    else {
        // subCollectionがあればそれぞれを書き込み
        var subCollectionQueries = Object.entries(subCollection);
        Promise.all(subCollectionQueries.map(function (_a) {
            var subCollectionId = _a[0], collectionQuery = _a[1];
            return new Promise(function (resolve, reject) {
                setCollection(pathlib.resolve(docPath, subCollectionId), collectionQuery, resolve, reject);
            });
        }))
            .then(onSet)
            .catch(function (err) {
            console.error(err);
            onError(err);
        });
    }
};
function addDoc(path, query, onSet, onError) {
    var _a = provider_1.getContext(), firestoreDB = _a.firestoreDB, dispatch = _a.dispatch;
    var id = query.id, subCollection = query.subCollection;
    var fields = query.fields !== undefined ? query.fields : {};
    var isDoc = utils_1.isDocPath(path);
    var idExists = id !== undefined;
    try {
        if (isDoc) {
            // doc path が渡された時
            var ref = firestoreDB.doc(path);
            ref
                .set(fields)
                .then(function () { return setDocCallback(dispatch, onSet, onError, path, fields, subCollection); })
                .catch(function (err) {
                console.error(err);
                onError(err);
            });
        }
        else if (idExists) {
            // collection path と id が渡された時
            var docPath = pathlib.resolve(path, id);
            var ref = firestoreDB.doc(docPath);
            ref
                .set(fields)
                .then(function () { return setDocCallback(dispatch, onSet, onError, path, fields, subCollection); })
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
                return setDocCallback(dispatch, onSet, onError, pathlib.resolve(path, doc.id), fields, subCollection);
            })
                .catch(function (err) {
                console.error(err);
                onError(err);
            });
        }
    }
    catch (err) {
        onError(err);
    }
}
exports.addDoc = addDoc;
function setDoc(docPath, query, onSet, onError, options) {
    var _a = provider_1.getContext(), firestoreDB = _a.firestoreDB, dispatch = _a.dispatch;
    var subCollection = query.subCollection;
    var fields = query.fields !== undefined ? query.fields : {};
    try {
        var promise = options !== undefined
            ? firestoreDB.doc(docPath).set(fields, options)
            : firestoreDB.doc(docPath).set(fields);
        promise
            .then(function () {
            setDocCallback(dispatch, onSet, onError, docPath, fields, subCollection);
        })
            .catch(function (err) {
            console.error(err);
            onError(err);
        });
    }
    catch (err) {
        onError(err);
    }
}
exports.setDoc = setDoc;
// subCollectionを扱わない
function updateDoc(docPath, query, onUpdate, onError) {
    var _a = provider_1.getContext(), firestoreDB = _a.firestoreDB, dispatch = _a.dispatch;
    var fields = query.fields !== undefined ? query.fields : {};
    try {
        var ref = firestoreDB.doc(docPath);
        ref
            .update(fields)
            .then(function () {
            setDocCallback(dispatch, onUpdate, onError, docPath, fields);
        })
            .catch(function (err) {
            console.error(err);
            onError(err);
        });
    }
    catch (err) {
        onError(err);
    }
}
exports.updateDoc = updateDoc;
/**
 * ```js
 * [
 *  {
 *    id: ...,
 *    fields: { ... },
 *  },
 *  {
 *    fields: { ... },
 *    subCollection: { ... }
 *  }
 * ]
 * ```
 */
function setCollection(collectionPath, queries, onSet, onError, options) {
    Promise.all(queries.map(function (query) {
        return new Promise(function (resolve, reject) {
            var id = query.id;
            if (id !== undefined) {
                var docPath = pathlib.resolve(collectionPath, id);
                setDoc(docPath, query, resolve, reject, options);
            }
            else {
                addDoc(collectionPath, query, resolve, reject);
            }
        });
    }))
        .then(onSet)
        .catch(function (err) {
        console.error(err);
        onError(err);
    });
}
exports.setCollection = setCollection;
