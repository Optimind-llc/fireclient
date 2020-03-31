"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var utils_1 = require("./utils");
function reducer(state, action) {
    switch (action.type) {
        case "setDoc":
            return state.setIn(["doc", action.payload.docId, "data"], action.payload.data);
        case "setCollection":
            return state.setIn(["collection", action.payload.collectionId, "docIds"], action.payload.docIds);
        case "deleteDoc":
            return state.deleteIn(["doc", action.payload.docId, "data"]);
        case "deleteCollection":
            var collectionIds = immutable_1.List(utils_1.searchCollectionId(action.payload.collectionId, state));
            var docIds = collectionIds
                .map(function (id) {
                return state
                    .get("collection")
                    .get(id)
                    .get("docIds");
            })
                .flatten()
                .toSet()
                .toList();
            var collectionDeleted = collectionIds.reduce(function (acc, id) { return acc.deleteIn(["collection", id]); }, state);
            var docDeleted = docIds.reduce(function (acc, id) { return acc.deleteIn(["doc", id]); }, collectionDeleted);
            return docDeleted;
        case "connectDoc":
            return state
                .get("doc")
                .get(action.payload.docId)
                .get("connectedFrom")
                ? state.setIn(["doc", action.payload.docId, "connectedFrom"], state
                    .get("doc")
                    .get(action.payload.docId)
                    .get("connectedFrom")
                    .add(action.payload.hooksId))
                : state.setIn(["doc", action.payload.docId, "connectedFrom"], immutable_1.Set.of(action.payload.hooksId));
        case "connectCollection":
            return state
                .get("collection")
                .get(action.payload.collectionId)
                .get("connectedFrom")
                ? state.setIn(["collection", action.payload.collectionId, "connectedFrom"], state
                    .get("collection")
                    .get(action.payload.collectionId)
                    .get("connectedFrom")
                    .add(action.payload.hooksId))
                : state.setIn(["collection", action.payload.collectionId, "connectedFrom"], immutable_1.Set.of(action.payload.hooksId));
        case "disconnectDoc":
            return state
                .get("doc")
                .get(action.payload.docId)
                .get("connectedFrom")
                ? state.setIn(["doc", action.payload.docId, "connectedFrom"], state
                    .get("doc")
                    .get(action.payload.docId)
                    .get("connectedFrom")
                    .delete(action.payload.hooksId))
                : state;
        case "disconnectCollection":
            return state
                .get("collection")
                .get(action.payload.collectionId)
                .get("connectedFrom")
                ? state.setIn(["collection", action.payload.collectionId, "connectedFrom"], state
                    .get("collection")
                    .get(action.payload.collectionId)
                    .get("connectedFrom")
                    .delete(action.payload.hooksId))
                : state;
        default:
            throw new Error();
    }
}
exports.default = reducer;
