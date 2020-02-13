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
exports.generateHooksId = function () {
    return Math.random()
        .toString(32)
        .substring(2);
};
exports.getHashCode = function (obj) {
    return obj === undefined ? sortedFromJS({}).hashCode() : sortedFromJS(obj).hashCode();
};
exports.getQueryId = function (path, options) {
    if (options === void 0) { options = {}; }
    var optionsId = exports.getHashCode(options);
    return path + (":" + optionsId);
};
var findLastColonIndex = function (s) {
    return s.split("").reduce(function (acc, val, i) { return (acc = val === ":" ? i : acc); }, -1);
};
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
exports.isDocPath = function (path) {
    var depth = path_1.default
        .normalize(path)
        .split(path_1.default.sep)
        .filter(withoutDot)
        .filter(withoutEmpty)
        .reduce(computeLevel, 0);
    return depth % 2 === 0;
};
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
    return exports.createData(id, data !== undefined ? data : null);
};
/**
 * Converts Firestore collection snapshot into `CollectionData`.
 * @param {firestore.DocumentData} doc
 * @example
 * const [snapshot] = useGetCollectionSnapshot("/path/to/collection");
 * const collectionData = createDataFromCollection(snapshot);
 */
exports.createDataFromCollection = function (collection) { return collection.map(function (coll) { return exports.createDataFromDoc(coll); }); };
// stateにdocのデータを保存
exports.saveDoc = function (dispatch, docPath, doc) {
    return dispatch({
        type: "setDoc",
        payload: {
            docId: path_1.default.resolve(docPath),
            data: doc,
        },
    });
};
// state.collectionに対象のdocのIdを保存, state.docに各データを保存
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
exports.deleteDocFromState = function (dispatch, docPath) {
    return dispatch({
        type: "deleteDoc",
        payload: {
            docId: path_1.default.resolve(docPath),
        },
    });
};
exports.deleteCollectionFromState = function (dispatch, collectionPath) {
    return dispatch({
        type: "deleteCollection",
        payload: {
            collectionId: exports.getQueryId(collectionPath),
        },
    });
};
// state.docにsubscribe元を登録
exports.connectDocToState = function (dispatch, docId, uuid) {
    return dispatch({
        type: "connectDoc",
        payload: {
            docId: docId,
            uuid: uuid,
        },
    });
};
// state.collectionと各state.docにsubscribe元を登録
exports.connectCollectionToState = function (dispatch, collectionId, uuid, docIds) {
    dispatch({
        type: "connectCollection",
        payload: {
            collectionId: collectionId,
            uuid: uuid,
        },
    });
    docIds.forEach(function (docId) { return exports.connectDocToState(dispatch, docId, uuid); });
};
// state.docからsubscribe元を削除
exports.disconnectDocFromState = function (dispatch, docId, uuid) {
    return dispatch({
        type: "disconnectDoc",
        payload: {
            docId: docId,
            uuid: uuid,
        },
    });
};
// state.collectionと各state.docからsubscribe元を削除
exports.disconnectCollectionFromState = function (dispatch, collectionId, uuid, docIds) {
    dispatch({
        type: "disconnectCollection",
        payload: {
            collectionId: collectionId,
            uuid: uuid,
        },
    });
    docIds.forEach(function (docId) { return exports.disconnectDocFromState(dispatch, docId, uuid); });
};
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
