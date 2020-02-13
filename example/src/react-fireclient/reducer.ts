import { List, Set } from "immutable";
import { DocData, CollectionId, FireclientState, HooksId, DocId } from ".";
import { searchCollectionId } from "./utils";

export type Actions =
  | {
      type: "setDoc";
      payload: {
        docId: DocId;
        data: DocData;
      };
    }
  | {
      type: "setCollection";
      payload: {
        collectionId: CollectionId;
        docIds: List<DocId>;
      };
    }
  | {
      type: "deleteDoc";
      payload: {
        docId: DocId;
      };
    }
  | {
      type: "deleteCollection";
      payload: {
        collectionId: CollectionId;
      };
    }
  | {
      type: "connectDoc";
      payload: {
        docId: DocId;
        uuid: HooksId;
      };
    }
  | {
      type: "connectCollection";
      payload: {
        collectionId: CollectionId;
        uuid: HooksId;
      };
    }
  | {
      type: "disconnectDoc";
      payload: {
        docId: DocId;
        uuid: HooksId;
      };
    }
  | {
      type: "disconnectCollection";
      payload: {
        collectionId: CollectionId;
        uuid: HooksId;
      };
    };

function reducer(state: FireclientState, action: Actions): FireclientState {
  switch (action.type) {
    case "setDoc":
      return state.setIn(["doc", action.payload.docId, "data"], action.payload.data);

    case "setCollection":
      return state.setIn(
        ["collection", action.payload.collectionId, "docIds"],
        action.payload.docIds,
      );

    case "deleteDoc":
      return state.deleteIn(["doc", action.payload.docId, "data"]);

    case "deleteCollection":
      const collectionIds = List(searchCollectionId(action.payload.collectionId, state));
      const docIds: List<DocId> = collectionIds
        .map(id =>
          state
            .get("collection")
            .get(id)
            .get("docIds"),
        )
        .flatten()
        .toSet()
        .toList();
      const collectionDeleted = collectionIds.reduce(
        (acc, id) => acc.deleteIn(["collection", id]),
        state,
      );
      const docDeleted = docIds.reduce((acc, id) => acc.deleteIn(["doc", id]), collectionDeleted);
      return docDeleted;

    case "connectDoc":
      return state
        .get("doc")
        .get(action.payload.docId)
        .get("connectedFrom") === undefined
        ? state.setIn(["doc", action.payload.docId, "connectedFrom"], Set.of(action.payload.uuid))
        : state.setIn(
            ["doc", action.payload.docId, "connectedFrom"],
            state
              .get("doc")
              .get(action.payload.docId)
              .get("connectedFrom")
              .add(action.payload.uuid),
          );

    case "connectCollection":
      return state
        .get("collection")
        .get(action.payload.collectionId)
        .get("connectedFrom") === undefined
        ? state.setIn(
            ["collection", action.payload.collectionId, "connectedFrom"],
            Set.of(action.payload.uuid),
          )
        : state.setIn(
            ["collection", action.payload.collectionId, "connectedFrom"],
            state
              .get("collection")
              .get(action.payload.collectionId)
              .get("connectedFrom")
              .add(action.payload.uuid),
          );

    case "disconnectDoc":
      return state
        .get("doc")
        .get(action.payload.docId)
        .get("connectedFrom") === undefined
        ? state
        : state.setIn(
            ["doc", action.payload.docId, "connectedFrom"],
            state
              .get("doc")
              .get(action.payload.docId)
              .get("connectedFrom")
              .delete(action.payload.uuid),
          );

    case "disconnectCollection":
      return state
        .get("collection")
        .get(action.payload.collectionId)
        .get("connectedFrom") === undefined
        ? state
        : state.setIn(
            ["collection", action.payload.collectionId, "connectedFrom"],
            state
              .get("collection")
              .get(action.payload.collectionId)
              .get("connectedFrom")
              .delete(action.payload.uuid),
          );

    default:
      throw new Error();
  }
}

export default reducer;
