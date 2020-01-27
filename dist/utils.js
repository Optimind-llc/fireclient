"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var firebase_1 = require("firebase");
var immutable_1 = require("immutable");
var path_1 = __importDefault(require("path"));
var typeCheck_1 = require("./typeCheck");
function sortedFromJS(object) {
    // CursorでOriginにSnapshotを指定することがある
    if (object instanceof firebase_1.firestore.DocumentSnapshot) {
        return object.ref.path;
    }
    // callbackなど、FunctionをOptionに渡すことがある
    if (object instanceof Function) {
        return object.toString();
    }
    if (typeof object !== "object" || object === null) {
        return object;
    }
    else {
        return Array.isArray(object)
            ? immutable_1.Seq(object)
                .map(sortedFromJS)
                .filter(function (v) { return v !== undefined; })
                .toList()
            : immutable_1.Seq(object)
                .map(sortedFromJS)
                .filter(function (v) { return v !== undefined; })
                .toOrderedMap()
                .sortBy(function (v, k) { return k; });
    }
}
function getHashCode(obj) {
    if (obj === undefined) {
        return sortedFromJS({}).hashCode();
    }
    else {
        return sortedFromJS(obj).hashCode();
    }
}
exports.getHashCode = getHashCode;
function getQueryId(path, options) {
    return getHashCode({
        path: path_1.default.resolve(path),
        options: options,
    });
}
exports.getQueryId = getQueryId;
function isDocPath(path) {
    var p = path_1.default.resolve(path);
    return p.split("/").length % 2 === 1;
}
exports.isDocPath = isDocPath;
function createData(id, fields) {
    return {
        data: fields,
        id: id,
    };
}
exports.createData = createData;
/**
 * Converts Firestore document snapshot into `DocData`.
 * @param {firestore.DocumentData} doc
 * @example
 * const [snapshot] = useGetDocSnapshot("/path/to/doc");
 * const docData = createDataFromDoc(snapshot);
 */
function createDataFromDoc(doc) {
    var id = doc.id;
    var data = doc.data();
    return createData(id, data !== undefined ? data : null);
}
exports.createDataFromDoc = createDataFromDoc;
/**
 * Converts Firestore collection snapshot into `CollectionData`.
 * @param {firestore.DocumentData} doc
 * @example
 * const [snapshot] = useGetCollectionSnapshot("/path/to/collection");
 * const collectionData = createDataFromCollection(snapshot);
 */
function createDataFromCollection(collection) {
    return collection.map(function (coll) { return createDataFromDoc(coll); });
}
exports.createDataFromCollection = createDataFromCollection;
// stateにdocのデータを保存
function saveDoc(dispatch, docPath, doc) {
    dispatch({
        type: "setDoc",
        payload: {
            docId: path_1.default.resolve(docPath),
            data: doc,
        },
    });
}
exports.saveDoc = saveDoc;
// state.collectionに対象のdocのIdを保存, state.docに各データを保存
function saveCollection(dispatch, path, options, collection) {
    collection.forEach(function (doc) {
        if (doc.id === null) {
            return;
        }
        saveDoc(dispatch, path_1.default.resolve(path, doc.id), doc);
    });
    var collectionId = getQueryId(path, options);
    var docIds = immutable_1.List(collection.filter(function (doc) { return doc.id !== null; }).map(function (doc) { return path_1.default.resolve(path, doc.id); }));
    dispatch({
        type: "setCollection",
        payload: {
            collectionId: collectionId,
            docIds: docIds,
        },
    });
}
exports.saveCollection = saveCollection;
// state.docにsubscribe元を登録
function connectDocToState(dispatch, docId, uuid) {
    dispatch({
        type: "connectDoc",
        payload: {
            docId: docId,
            uuid: uuid,
        },
    });
}
exports.connectDocToState = connectDocToState;
// state.collectionと各state.docにsubscribe元を登録
function connectCollectionToState(dispatch, collectionId, uuid, docIds) {
    dispatch({
        type: "connectCollection",
        payload: {
            collectionId: collectionId,
            uuid: uuid,
        },
    });
    docIds.forEach(function (docId) { return connectDocToState(dispatch, docId, uuid); });
}
exports.connectCollectionToState = connectCollectionToState;
// state.docからsubscribe元を削除
function disconnectDocFromState(dispatch, docId, uuid) {
    dispatch({
        type: "disconnectDoc",
        payload: {
            docId: docId,
            uuid: uuid,
        },
    });
}
exports.disconnectDocFromState = disconnectDocFromState;
// state.collectionと各state.docからsubscribe元を削除
function disconnectCollectionFromState(dispatch, collectionId, uuid, docIds) {
    dispatch({
        type: "disconnectCollection",
        payload: {
            collectionId: collectionId,
            uuid: uuid,
        },
    });
    docIds.forEach(function (docId) { return disconnectDocFromState(dispatch, docId, uuid); });
}
exports.disconnectCollectionFromState = disconnectCollectionFromState;
function withWhere(ref, where) {
    if (Array.isArray(where)) {
        return where.reduce(function (acc, cond) { return withWhere(acc, cond); }, ref);
    }
    if (where === undefined) {
        return ref;
    }
    var _a = where, field = _a.field, operator = _a.operator, value = _a.value;
    return ref.where(field, operator, value);
}
function withLimit(ref, limit) {
    return limit === undefined ? ref : ref.limit(limit);
}
function withOrder(ref, order) {
    if (Array.isArray(order)) {
        return order.reduce(function (acc, ord) {
            return withOrder(acc, ord);
        }, ref);
    }
    if (order === undefined) {
        return ref;
    }
    var _a = order, by = _a.by, direction = _a.direction;
    return direction === undefined ? ref.orderBy(by) : ref.orderBy(by, direction);
}
function withCursor(ref, cursor) {
    if (cursor === undefined) {
        return ref;
    }
    var direction = cursor.direction, origin = cursor.origin, multipleFields = cursor.multipleFields;
    var _multipleFields = multipleFields !== undefined ? multipleFields : false;
    typeCheck_1.assert(!_multipleFields || origin instanceof Array, '"origin" should be array if "multipleFields" is true.');
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
