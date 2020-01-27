"use strict";
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
  };
Object.defineProperty(exports, "__esModule", { value: true });
var firebase_1 = require("firebase");
var immutable_1 = require("immutable");
var pathlib = __importStar(require("path"));
var provider_1 = require("./provider");
var validation_1 = require("./validation");
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
  } else {
    return validation_1.isArray(object)
      ? immutable_1
          .Seq(object)
          .map(sortedFromJS)
          .filter(function(v) {
            return v !== undefined;
          })
          .toList()
      : immutable_1
          .Seq(object)
          .map(sortedFromJS)
          .filter(function(v) {
            return v !== undefined;
          })
          .toOrderedMap();
  }
}
function getHashCode(obj) {
  if (obj === undefined) {
    return sortedFromJS({}).hashCode();
  } else {
    return sortedFromJS(obj).hashCode();
  }
}
exports.getHashCode = getHashCode;
function getQueryId(path, option) {
  return getHashCode({
    path: pathlib.resolve(path),
    option: option,
  });
}
exports.getQueryId = getQueryId;
// Optional型のstate, dispatch, dbをunwrap
// stateにdocのデータを保存
function saveDoc(dispatch, docId, doc) {
  dispatch({
    type: "setDoc",
    payload: {
      docId: docId,
      snapshot: doc,
    },
  });
}
// state.collectionに対象のdocのIdを保存, state.docに各データを保存
function saveCollection(dispatch, path, option, collection) {
  collection.forEach(function(doc) {
    var docId = pathlib.resolve(path, doc.id);
    saveDoc(dispatch, docId, doc);
  });
  var collectionId = getQueryId(path, option);
  var docIds = immutable_1.List(
    collection.map(function(doc) {
      return pathlib.resolve(path, doc.id);
    }),
  );
  dispatch({
    type: "setCollection",
    payload: {
      collectionId: collectionId,
      docIds: docIds,
    },
  });
}
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
// state.collectionと各state.docにsubscribe元を登録
function connectCollectionToState(dispatch, collectionId, uuid, docIds) {
  dispatch({
    type: "connectCollection",
    payload: {
      collectionId: collectionId,
      uuid: uuid,
    },
  });
  docIds.forEach(function(docId) {
    return connectDocToState(dispatch, docId, uuid);
  });
}
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
// state.collectionと各state.docからsubscribe元を削除
function disconnectCollectionFromState(dispatch, collectionId, uuid, docIds) {
  dispatch({
    type: "disconnectCollection",
    payload: {
      collectionId: collectionId,
      uuid: uuid,
    },
  });
  docIds.forEach(function(docId) {
    return disconnectDocFromState(dispatch, docId, uuid);
  });
}
function withWhere(ref, where) {
  if (validation_1.isArray(where)) {
    return where.reduce(function(acc, cond) {
      return withWhere(acc, cond);
    }, ref);
  }
  if (where === undefined) {
    return ref;
  }
  var _a = where,
    field = _a.field,
    operator = _a.operator,
    value = _a.value;
  return ref.where(field, operator, value);
}
function withLimit(ref, limit) {
  return limit === undefined ? ref : ref.limit(limit);
}
function withOrder(ref, order) {
  if (validation_1.isArray(order)) {
    return order.reduce(function(acc, ord) {
      return withOrder(acc, ord);
    }, ref);
  }
  if (order === undefined) {
    return ref;
  }
  var _a = order,
    by = _a.by,
    direction = _a.direction;
  return direction === undefined ? ref.orderBy(by) : ref.orderBy(by, direction);
}
function withCursor(ref, cursor) {
  if (cursor === undefined) {
    return ref;
  }
  var direction = cursor.direction,
    origin = cursor.origin,
    multipleFields = cursor.multipleFields;
  var _multipleFields = multipleFields !== undefined ? multipleFields : false;
  validation_1.assert(
    !_multipleFields || origin instanceof Array,
    '"origin" should be array if "multipleFields" is true.',
  );
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
        throw new Error(
          'Query cursor.direction should be any of "startAt" / "startAfter" / "endAt" / "endBefore"',
        );
    }
  } else {
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
        throw new Error(
          'Query cursor.direction should be any of "startAt" / "startAfter" / "endAt" / "endBefore"',
        );
    }
  }
}
function withOption(ref, _a) {
  var where = _a.where,
    limit = _a.limit,
    order = _a.order,
    cursor = _a.cursor;
  var optionFn = [
    { fn: withWhere, param: where },
    { fn: withOrder, param: order },
    { fn: withCursor, param: cursor },
    { fn: withLimit, param: limit },
  ];
  return optionFn.reduce(function(acc, _a) {
    var fn = _a.fn,
      param = _a.param;
    return fn(acc, param);
  }, ref);
}
function getDoc(path, onGet, onError, acceptOutdated) {
  if (acceptOutdated === void 0) {
    acceptOutdated = false;
  }
  var _a, _b;
  var docId = pathlib.resolve(path);
  var _c = provider_1.unwrapContext(provider_1.providerContext),
    state = _c.state,
    dispatch = _c.dispatch,
    firestoreDB = _c.firestoreDB;
  // state内でsubscribeされているかチェック
  var cache = state.get("doc").get(docId);
  if (
    cache !== undefined &&
    (acceptOutdated ||
      ((_b = (_a = cache) === null || _a === void 0 ? void 0 : _a.get("connectedFrom")) === null ||
      _b === void 0
        ? void 0
        : _b.size) > 0)
  ) {
    onGet(cache.get("snapshot"));
    return;
  }
  try {
    var ref = firestoreDB.doc(path);
    ref
      .get()
      .then(function(doc) {
        saveDoc(dispatch, docId, doc);
        onGet(doc);
      })
      .catch(function(err) {
        onError(err);
      });
  } catch (err) {
    onError(err);
  }
}
exports.getDoc = getDoc;
function subscribeDoc(uuid, path, onChange, onError, onListen) {
  if (onListen === void 0) {
    onListen = function() {};
  }
  var docId = pathlib.resolve(path);
  var _a = provider_1.unwrapContext(provider_1.providerContext),
    dispatch = _a.dispatch,
    firestoreDB = _a.firestoreDB;
  try {
    var ref = firestoreDB.doc(path);
    var unsubscribe_1 = ref.onSnapshot(
      function(doc) {
        onListen();
        saveDoc(dispatch, docId, doc);
        connectDocToState(dispatch, docId, uuid);
        onChange(doc);
      },
      function(err) {
        onError(err);
      },
    );
    return function() {
      unsubscribe_1();
      disconnectDocFromState(dispatch, docId, uuid);
    };
  } catch (err) {
    onError(err);
    return function() {};
  }
}
exports.subscribeDoc = subscribeDoc;
function getCollection(path, option, onGet, onError, acceptOutdated) {
  if (option === void 0) {
    option = {};
  }
  if (acceptOutdated === void 0) {
    acceptOutdated = false;
  }
  var _a, _b;
  var collectionId = getQueryId(path, option);
  var _c = provider_1.unwrapContext(provider_1.providerContext),
    state = _c.state,
    dispatch = _c.dispatch,
    firestoreDB = _c.firestoreDB;
  // state内でsubscribeされているかチェック
  var cache = state.get("collection").get(collectionId);
  if (
    cache !== undefined &&
    (acceptOutdated ||
      ((_b = (_a = cache) === null || _a === void 0 ? void 0 : _a.get("connectedFrom")) === null ||
      _b === void 0
        ? void 0
        : _b.size) > 0)
  ) {
    var docIds = cache.get("docIds").map(function(id) {
      return pathlib.resolve(path, id);
    });
    var collectionSnapshot = docIds
      .map(function(docId) {
        return state
          .get("doc")
          .get(docId)
          .get("snapshot");
      })
      .toJS();
    onGet(collectionSnapshot);
    return;
  }
  try {
    var ref = withOption(firestoreDB.collection(path), option);
    ref
      .get()
      .then(function(collection) {
        saveCollection(dispatch, path, option, collection.docs);
        onGet(collection.docs);
      })
      .catch(function(err) {
        onError(err);
      });
  } catch (err) {
    onError(err);
  }
}
exports.getCollection = getCollection;
function subscribeCollection(uuid, path, option, onChange, onError, onListen) {
  if (option === void 0) {
    option = {};
  }
  if (onListen === void 0) {
    onListen = function() {};
  }
  var collectionId = getQueryId(path, option);
  var _a = provider_1.unwrapContext(provider_1.providerContext),
    dispatch = _a.dispatch,
    firestoreDB = _a.firestoreDB;
  var docIds = immutable_1.List();
  try {
    var ref = withOption(firestoreDB.collection(path), option);
    var unsubscribe_2 = ref.onSnapshot(
      function(collection) {
        onListen();
        // docIdsを更新
        // 対象から外れたdocをunsubscribeする
        var nextDocIds = immutable_1.List(
          collection.docs.map(function(doc) {
            return pathlib.resolve(path, doc.id);
          }),
        );
        var decreased = docIds.filter(function(id) {
          return nextDocIds.indexOf(id) === -1;
        });
        decreased.forEach(function(docId) {
          return disconnectDocFromState(dispatch, docId, uuid);
        });
        docIds = nextDocIds;
        saveCollection(dispatch, path, option, collection.docs);
        connectCollectionToState(dispatch, collectionId, uuid, docIds);
        onChange(collection.docs);
      },
      function(err) {
        onError(err);
      },
    );
    return function() {
      unsubscribe_2();
      disconnectCollectionFromState(dispatch, collectionId, uuid, docIds);
    };
  } catch (err) {
    onError(err);
    return function() {};
  }
}
exports.subscribeCollection = subscribeCollection;
