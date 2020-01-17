"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
function reducer(state, action) {
    switch (action.type) {
        case "setDoc":
            return state.setIn(["doc", action.payload.docId, "snapshot"], action.payload.snapshot);
        case "setCollection":
            return state.setIn(["collection", action.payload.collectionId, "docIds"], action.payload.docIds);
        case "connectDoc":
            return state
                .get("doc")
                .get(action.payload.docId)
                .get("connectedFrom") === undefined
                ? state.setIn(["doc", action.payload.docId, "connectedFrom"], immutable_1.Set.of(action.payload.uuid))
                : state.setIn(["doc", action.payload.docId, "connectedFrom"], state
                    .get("doc")
                    .get(action.payload.docId)
                    .get("connectedFrom")
                    .add(action.payload.uuid));
        case "connectCollection":
            return state
                .get("collection")
                .get(action.payload.collectionId)
                .get("connectedFrom") === undefined
                ? state.setIn(["collection", action.payload.collectionId, "connectedFrom"], immutable_1.Set.of(action.payload.uuid))
                : state.setIn(["collection", action.payload.collectionId, "connectedFrom"], state
                    .get("collection")
                    .get(action.payload.collectionId)
                    .get("connectedFrom")
                    .add(action.payload.uuid));
        case "disconnectDoc":
            return state
                .get("doc")
                .get(action.payload.docId)
                .get("connectedFrom") === undefined
                ? state
                : state.setIn(["doc", action.payload.docId, "connectedFrom"], state
                    .get("doc")
                    .get(action.payload.docId)
                    .get("connectedFrom")
                    .delete(action.payload.uuid));
        case "disconnectCollection":
            return state
                .get("collection")
                .get(action.payload.collectionId)
                .get("connectedFrom") === undefined
                ? state
                : state.setIn(["collection", action.payload.collectionId, "connectedFrom"], state
                    .get("collection")
                    .get(action.payload.collectionId)
                    .get("connectedFrom")
                    .delete(action.payload.uuid));
        default:
            throw new Error();
    }
}
exports.default = reducer;
