"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withOption = exports.disconnectCollectionFromState = exports.disconnectDocFromState = exports.connectCollectionToState = exports.connectDocToState = exports.deleteCollectionFromState = exports.deleteDocFromState = exports.saveCollection = exports.saveDoc = exports.createDataFromCollection = exports.createDataFromDoc = exports.createData = exports.isDocPath = exports.searchCollectionId = exports.getCollectionPathFromId = exports.generateHooksId = exports.getQueryId = exports.getHashCode = void 0;
var firebase_1 = require("firebase");
var immutable_1 = require("immutable");
var path_1 = __importDefault(require("path"));
var typeCheck_1 = require("./typeCheck");
/**
 * objをSortされたOrderedMapに変換して返す
 * objが持つkeyとvalueが一致していれば全く同じ内容を返す全単射な関数
 * @param obj
 */
function sortedFromJS(obj) {
    // CursorでOriginにSnapshotを指定することがある
    if (obj instanceof firebase_1.firestore.DocumentSnapshot) {
        return obj.ref.path;
    }
    // callbackなど、FunctionをOptionに渡すことがある
    if (obj instanceof Function) {
        return obj.toString();
    }
    if (typeof obj !== "object" || obj === null) {
        return obj;
    }
    else {
        return Array.isArray(obj)
            ? immutable_1.Seq(obj)
                .map(sortedFromJS)
                .filter(function (v) { return !!v; })
                .toList()
            : immutable_1.Seq(obj)
                .map(sortedFromJS)
                .filter(function (v) { return !!v; })
                .toOrderedMap()
                .sortBy(function (v, k) { return k; });
    }
}
/**
 * 受け取ったobjのHashCodeを返す
 * objが持つkeyとvalueが一致していれば全く同じ値を返す全単射な関数
 * @param obj
 */
exports.getHashCode = function (obj) {
    return obj ? sortedFromJS(obj).hashCode() : sortedFromJS({}).hashCode();
};
/**
 * CollectionのQueryに対するQueryIdを返す
 * CollectionPathとoptionsの内容が一致していれば全く同じ値を返す全単射な関数
 * @param collectionPath Fireclient上のCollectionのPath
 * @param options
 */
exports.getQueryId = function (collectionPath, options) {
    if (options === void 0) { options = {}; }
    var optionsId = exports.getHashCode(options);
    return collectionPath + (":" + optionsId);
};
/**
 * HooksIdを生成する
 * ランダムな値を返す
 */
exports.generateHooksId = function () {
    return Math.random()
        .toString(32)
        .substring(2);
};
var findLastColonIndex = function (s) {
    return s.split("").reduce(function (acc, val, i) { return (acc = val === ":" ? i : acc); }, -1);
};
/**
 * CollectionIdからPathの部分のみを抽出する
 * @param collectionId
 */
exports.getCollectionPathFromId = function (collectionId) {
    return collectionId.slice(0, findLastColonIndex(collectionId));
};
exports.searchCollectionId = function (collectionPath, state) {
    return Array.from(state
        .get("collection")
        .filter(function (id) { return id.startsWith(collectionPath); })
        .keys());
};
var withoutDot = function (s) { return s !== "."; };
var withoutEmpty = function (s) { return s.length > 0; };
var computeLevel = function (acc, s) { return (s === ".." ? acc - 1 : acc + 1); };
/**
 * pathがDocのPathであるかどうかを判定する
 * @param path
 */
exports.isDocPath = function (path) {
    var depth = path_1.default
        .normalize(path)
        .split(path_1.default.sep)
        .filter(withoutDot)
        .filter(withoutEmpty)
        .reduce(computeLevel, 0);
    return depth % 2 === 0;
};
/**
 * 取得したDocをDocDataに変換する
 * @param id DocId
 * @param fields Docの内容
 */
exports.createData = function (id, fields) { return ({
    data: fields,
    id: id,
}); };
/**
 * Converts Firestore document snapshot into `DocData`.
 * @param {firestore.DocumentData} doc
 * @example
 * const [snapshot] = useGetDocSnapshot("/path/to/doc");
 * const docData = createDataFromDoc(snapshot);
 */
exports.createDataFromDoc = function (doc) {
    var id = doc.id;
    var data = doc.data();
    return exports.createData(id, data ? data : null);
};
/**
 * Converts Firestore collection snapshot into `CollectionData`.
 * @param {firestore.DocumentData} doc
 * @example
 * const [snapshot] = useGetCollectionSnapshot("/path/to/collection");
 * const collectionData = createDataFromCollection(snapshot);
 */
exports.createDataFromCollection = function (collection) { return collection.map(function (coll) { return exports.createDataFromDoc(coll); }); };
/**
 * DocDataをproviderContext内のstateに保存する
 * @param dispatch
 * @param docPath
 * @param doc
 */
exports.saveDoc = function (dispatch, docPath, doc) {
    return dispatch({
        type: "setDoc",
        payload: {
            docId: path_1.default.resolve(docPath),
            data: doc,
        },
    });
};
/**
 * CollectionDataをproviderContext内のstateに保存する
 * @param dispatch
 * @param collectionPath
 * @param options Collectionを取得した際のQueryOptions QueryIdの取得に使用する
 * @param collection
 */
exports.saveCollection = function (dispatch, collectionPath, options, collection) {
    collection.forEach(function (doc) {
        if (doc.id === null) {
            return;
        }
        exports.saveDoc(dispatch, path_1.default.resolve(collectionPath, doc.id), doc);
    });
    var collectionId = exports.getQueryId(collectionPath, options);
    var docIds = immutable_1.List(collection
        .filter(function (doc) { return doc.id !== null; })
        .map(function (doc) { return path_1.default.resolve(collectionPath, doc.id); }));
    dispatch({
        type: "setCollection",
        payload: {
            collectionId: collectionId,
            docIds: docIds,
        },
    });
};
/**
 * docPathの内容をproviderContext内のstateから削除する
 * @param dispatch
 * @param docPath
 */
exports.deleteDocFromState = function (dispatch, docPath) {
    return dispatch({
        type: "deleteDoc",
        payload: {
            docId: path_1.default.resolve(docPath),
        },
    });
};
/**
 * collectionPathの内容をproviderContext内のstateから削除する
 * @param dispatch
 * @param collectionPath
 */
exports.deleteCollectionFromState = function (dispatch, collectionPath) {
    return dispatch({
        type: "deleteCollection",
        payload: {
            collectionId: exports.getQueryId(collectionPath),
        },
    });
};
/**
 * providerContext内のstate上で
 * docIdがhooksIdからsubscribeされていることを記憶する
 *
 * state.doc.(docId).connectedFromにhooksIdを追加する
 * @param dispatch
 * @param docId
 * @param hooksId
 */
exports.connectDocToState = function (dispatch, docId, hooksId) {
    return dispatch({
        type: "connectDoc",
        payload: {
            docId: docId,
            hooksId: hooksId,
        },
    });
};
/**
 * providerContext内のstate上で
 * 各docIdとcollectionIdがhooksIdからsubscribeされていることを記憶する
 *
 * state.doc.(各docId).connectedFromと
 * state.collection.(collectionId).connectedFromにhooksIdを追加する
 * @param dispatch
 * @param collectionId
 * @param hooksId
 * @param docIds
 */
exports.connectCollectionToState = function (dispatch, collectionId, hooksId, docIds) {
    dispatch({
        type: "connectCollection",
        payload: {
            collectionId: collectionId,
            hooksId: hooksId,
        },
    });
    docIds.forEach(function (docId) { return exports.connectDocToState(dispatch, docId, hooksId); });
};
/**
 * state.doc.(docId).connectedFromからhooksIdを削除する
 * @param dispatch
 * @param docId
 * @param hooksId
 */
exports.disconnectDocFromState = function (dispatch, docId, hooksId) {
    return dispatch({
        type: "disconnectDoc",
        payload: {
            docId: docId,
            hooksId: hooksId,
        },
    });
};
/**
 * state.doc.(各docId).connectedFromと
 * state.collection.(collectionId).connectedFromからhooksIdを削除する
 * @param dispatch
 * @param collectionId
 * @param hooksId
 * @param docIds
 */
exports.disconnectCollectionFromState = function (dispatch, collectionId, hooksId, docIds) {
    dispatch({
        type: "disconnectCollection",
        payload: {
            collectionId: collectionId,
            hooksId: hooksId,
        },
    });
    docIds.forEach(function (docId) { return exports.disconnectDocFromState(dispatch, docId, hooksId); });
};
function withWhere(ref, where) {
    if (Array.isArray(where)) {
        return where.reduce(function (acc, cond) { return withWhere(acc, cond); }, ref);
    }
    if (!where) {
        return ref;
    }
    var _a = where, field = _a.field, operator = _a.operator, value = _a.value;
    return ref.where(field, operator, value);
}
function withLimit(ref, limit) {
    return limit ? ref.limit(limit) : ref;
}
function withOrder(ref, order) {
    if (Array.isArray(order)) {
        return order.reduce(function (acc, ord) {
            return withOrder(acc, ord);
        }, ref);
    }
    if (!order) {
        return ref;
    }
    var _a = order, by = _a.by, direction = _a.direction;
    return direction ? ref.orderBy(by, direction) : ref.orderBy(by);
}
function withCursor(ref, cursor) {
    if (!cursor) {
        return ref;
    }
    var direction = cursor.direction, origin = cursor.origin, multipleFields = cursor.multipleFields;
    var _multipleFields = multipleFields ? multipleFields : false;
    typeCheck_1.assert(!_multipleFields || Array.isArray(origin), '"origin" should be array if "multipleFields" is true.');
    if (!_multipleFields) {
        switch (direction) {
            case "startAt":
                return ref.startAt(origin);
            case "startAfter":
                return ref.startAfter(origin);
            case "endAt":
                return ref.endAt(origin);
            case "endBefore":
                return ref.endBefore(origin);
            default:
                throw new Error('Query cursor.direction should be any of "startAt" / "startAfter" / "endAt" / "endBefore"');
        }
    }
    else {
        switch (direction) {
            case "startAt":
                return ref.startAt.apply(ref, origin);
            case "startAfter":
                return ref.startAfter.apply(ref, origin);
            case "endAt":
                return ref.endAt.apply(ref, origin);
            case "endBefore":
                return ref.endBefore.apply(ref, origin);
            default:
                throw new Error('Query cursor.direction should be any of "startAt" / "startAfter" / "endAt" / "endBefore"');
        }
    }
}
function withOption(ref, _a) {
    var where = _a.where, limit = _a.limit, order = _a.order, cursor = _a.cursor;
    var optionFn = [
        { fn: withWhere, param: where },
        { fn: withOrder, param: order },
        { fn: withCursor, param: cursor },
        { fn: withLimit, param: limit },
    ];
    return optionFn.reduce(function (acc, _a) {
        var fn = _a.fn, param = _a.param;
        return fn(acc, param);
    }, ref);
}
exports.withOption = withOption;
