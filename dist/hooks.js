"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("firebase/firestore");
var react_1 = require("react");
var getFunctions_1 = require("./getFunctions");
var setFunctions_1 = require("./setFunctions");
var utils_1 = require("./utils");
var validation_1 = require("./validation");
function generateHooksId() {
  return Math.random()
    .toString(32)
    .substring(2);
}
exports.generateHooksId = generateHooksId;
// ----------
//  Get Base
// ----------
function useLazyGetDocBase(path, initialValue, getFunction, option) {
  validation_1.assertPath(path);
  validation_1.assertCallback(option?.callback);
  validation_1.assertAcceptOutdated(option?.acceptOutdated);
  var _a = react_1.useState(null),
    error = _a[0],
    setError = _a[1];
  var _b = react_1.useState(initialValue),
    doc = _b[0],
    setDoc = _b[1];
  var _c = react_1.useState(false),
    loading = _c[0],
    setLoading = _c[1];
  var loadDoc = function() {
    setLoading(true);
    getFunction(
      path,
      function(data) {
        var _a;
        setDoc(data);
        setError(null);
        setLoading(false);
        if (((_a = option) === null || _a === void 0 ? void 0 : _a.callback) !== undefined)
          option.callback(data);
      },
      function(err) {
        setError(err);
        setLoading(false);
      },
    );
  };
  return [doc, loading, error, loadDoc];
}
function useSubscribeDocBase(path, initialValue, subscribeFunction, option) {
  validation_1.assertPath(path);
  validation_1.assertCallback(option?.callback);
  var hooksId = react_1.useState(generateHooksId())[0];
  var _a = react_1.useState(null),
    error = _a[0],
    setError = _a[1];
  var _b = react_1.useState(initialValue),
    doc = _b[0],
    setDoc = _b[1];
  var _c = react_1.useState(false),
    loading = _c[0],
    setLoading = _c[1];
  var _d = react_1.useState({ fn: function() {} }),
    unsubscribe = _d[0],
    setUnsubscribe = _d[1];
  react_1.useEffect(
    function() {
      var unsub = subscribeFunction(
        hooksId,
        path,
        function(data) {
          var _a;
          setDoc(data);
          setError(null);
          setLoading(false);
          if (((_a = option) === null || _a === void 0 ? void 0 : _a.callback) !== undefined)
            option.callback(data);
        },
        function(err) {
          setError(err);
          setLoading(false);
        },
        function() {
          return setLoading(true);
        },
      );
      setUnsubscribe({ fn: unsub });
    },
    [path],
  );
  return [doc, loading, error, unsubscribe.fn];
}
exports.useSubscribeDocBase = useSubscribeDocBase;
function useLazyGetCollectionBase(path, initialValue, getFunction, option) {
  validation_1.assertPath(path);
  validation_1.assertQueryOption(option);
  validation_1.assertCallback(option?.callback);
  validation_1.assertAcceptOutdated(option?.acceptOutdated);
  var _a = react_1.useState(null),
    error = _a[0],
    setError = _a[1];
  var _b = react_1.useState(initialValue),
    collection = _b[0],
    setCollection = _b[1];
  var _c = react_1.useState(false),
    loading = _c[0],
    setLoading = _c[1];
  var loadCollection = function() {
    var _a;
    setLoading(true);
    getFunction(
      path,
      function(data) {
        var _a;
        setCollection(data);
        setError(null);
        setLoading(false);
        if (((_a = option) === null || _a === void 0 ? void 0 : _a.callback) !== undefined)
          option.callback(data);
      },
      function(err) {
        setError(err);
        setLoading(false);
      },
      option,
      (_a = option) === null || _a === void 0 ? void 0 : _a.acceptOutdated,
    );
  };
  return [collection, loading, error, loadCollection];
}
exports.useLazyGetCollectionBase = useLazyGetCollectionBase;
function useSubscribeCollectionBase(path, initialValue, subscribeFunction, option) {
  validation_1.assertPath(path);
  validation_1.assertQueryOption(option);
  validation_1.assertCallback(option?.callback);
  var hooksId = react_1.useState(generateHooksId())[0];
  var _a = react_1.useState(null),
    error = _a[0],
    setError = _a[1];
  var _b = react_1.useState(initialValue),
    collection = _b[0],
    setCollection = _b[1];
  var _c = react_1.useState(false),
    loading = _c[0],
    setLoading = _c[1];
  var _d = react_1.useState({ fn: function() {} }),
    unsubscribe = _d[0],
    setUnsubscribe = _d[1];
  react_1.useEffect(
    function() {
      var unsub = subscribeFunction(
        hooksId,
        path,
        function(snapshot) {
          var _a;
          setCollection(snapshot);
          setError(null);
          setLoading(false);
          if (((_a = option) === null || _a === void 0 ? void 0 : _a.callback) !== undefined)
            option.callback(snapshot);
        },
        function(err) {
          setError(err);
          setLoading(false);
        },
        function() {
          return setLoading(true);
        },
        option,
      );
      setUnsubscribe({ fn: unsub });
    },
    [path, utils_1.getHashCode(option)],
  );
  return [collection, loading, error, unsubscribe.fn];
}
exports.useSubscribeCollectionBase = useSubscribeCollectionBase;
// ----------
//  Get Snapshot
// ----------
function useLazyGetDocSnapshot(path, option) {
  return useLazyGetDocBase(path, null, getFunctions_1.getDocSnapshot, option);
}
exports.useLazyGetDocSnapshot = useLazyGetDocSnapshot;
function useGetDocSnapshot(path, option) {
  var _a = useLazyGetDocSnapshot(path, option),
    doc = _a[0],
    loading = _a[1],
    error = _a[2],
    reloadDoc = _a[3];
  react_1.useEffect(
    function() {
      return reloadDoc();
    },
    [path, utils_1.getHashCode(option)],
  );
  return [doc, loading, error, reloadDoc];
}
exports.useGetDocSnapshot = useGetDocSnapshot;
function useSubscribeDocSnapshot(path, option) {
  return useSubscribeDocBase(path, null, getFunctions_1.subscribeDocSnapshot, option);
}
exports.useSubscribeDocSnapshot = useSubscribeDocSnapshot;
function useLazyGetCollectionSnapshot(path, option) {
  return useLazyGetCollectionBase(path, null, getFunctions_1.getCollectionSnapshot, option);
}
exports.useLazyGetCollectionSnapshot = useLazyGetCollectionSnapshot;
function useGetCollectionSnapshot(path, option) {
  var _a = useLazyGetCollectionSnapshot(path, option),
    collection = _a[0],
    loading = _a[1],
    error = _a[2],
    reloadCollection = _a[3];
  react_1.useEffect(
    function() {
      return reloadCollection();
    },
    [path, utils_1.getHashCode(option)],
  );
  return [collection, loading, error, reloadCollection];
}
exports.useGetCollectionSnapshot = useGetCollectionSnapshot;
function useSubscribeCollectionSnapshot(path, option) {
  return useSubscribeCollectionBase(path, [], getFunctions_1.subscribeCollectionSnapshot, option);
}
exports.useSubscribeCollectionSnapshot = useSubscribeCollectionSnapshot;
// ----------
//  Get Data
// ----------
exports.initialDocData = {
  data: null,
  id: null,
};
exports.initialCollectionData = [];
function useLazyGetDoc(path, option) {
  return useLazyGetDocBase(path, exports.initialDocData, getFunctions_1.getDoc, option);
}
exports.useLazyGetDoc = useLazyGetDoc;
function useGetDoc(path, option) {
  var _a = useLazyGetDoc(path, option),
    doc = _a[0],
    loading = _a[1],
    error = _a[2],
    reloadDoc = _a[3];
  react_1.useEffect(
    function() {
      return reloadDoc();
    },
    [path, utils_1.getHashCode(option)],
  );
  return [doc, loading, error, reloadDoc];
}
exports.useGetDoc = useGetDoc;
function useSubscribeDoc(path, option) {
  return useSubscribeDocBase(path, exports.initialDocData, getFunctions_1.subscribeDoc, option);
}
exports.useSubscribeDoc = useSubscribeDoc;
function useLazyGetCollection(path, option) {
  return useLazyGetCollectionBase(
    path,
    exports.initialCollectionData,
    getFunctions_1.getCollection,
    option,
  );
}
exports.useLazyGetCollection = useLazyGetCollection;
function useGetCollection(path, option) {
  var _a = useLazyGetCollection(path, option),
    collection = _a[0],
    loading = _a[1],
    error = _a[2],
    reloadCollection = _a[3];
  react_1.useEffect(
    function() {
      return reloadCollection();
    },
    [path, utils_1.getHashCode(option)],
  );
  return [collection, loading, error, reloadCollection];
}
exports.useGetCollection = useGetCollection;
function useSubscribeCollection(path, option) {
  return useSubscribeCollectionBase(
    path,
    exports.initialCollectionData,
    getFunctions_1.subscribeCollection,
    option,
  );
}
exports.useSubscribeCollection = useSubscribeCollection;
// ----------
//  Set Data
// ----------
function useWriteDoc(path, query, writeFunction, option) {
  var _a = react_1.useState(false),
    writing = _a[0],
    setWriting = _a[1];
  var _b = react_1.useState(false),
    called = _b[0],
    setCalled = _b[1];
  var _c = react_1.useState(null),
    error = _c[0],
    setError = _c[1];
  var queryGenerator =
    query instanceof Function
      ? query
      : function() {
          return query;
        };
  var writeFn = function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    setWriting(true);
    setCalled(true);
    writeFunction(
      path,
      queryGenerator.apply(void 0, args),
      function() {
        setError(null);
        setWriting(false);
      },
      function(err) {
        setError(err);
        setWriting(false);
      },
    );
  };
  return [writeFn, writing, called, error];
}
function useSetDoc(path, query, option) {
  return useWriteDoc(path, query, setFunctions_1.setDoc, option);
}
exports.useSetDoc = useSetDoc;
function useAddDoc(path, query, option) {
  return useWriteDoc(path, query, setFunctions_1.addDoc, option);
}
exports.useAddDoc = useAddDoc;
function useUpdateDoc(path, query, option) {
  return useWriteDoc(path, query, setFunctions_1.updateDoc, option);
}
exports.useUpdateDoc = useUpdateDoc;
