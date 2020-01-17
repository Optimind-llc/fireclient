import { firestore } from "firebase";
import { FireclientState, HooksId } from ".";
import { Set, List } from "immutable";

export type Actions =
  | {
      type: "setDoc";
      payload: {
        docId: string;
        snapshot: firestore.DocumentSnapshot;
      };
    }
  | {
      type: "setCollection";
      payload: {
        collectionId: number;
        docIds: List<string>;
      };
    }
  | {
      type: "connectDoc";
      payload: {
        docId: string;
        uuid: HooksId;
      };
    }
  | {
      type: "connectCollection";
      payload: {
        collectionId: number;
        uuid: HooksId;
      };
    }
  | {
      type: "disconnectDoc";
      payload: {
        docId: string;
        uuid: HooksId;
      };
    }
  | {
      type: "disconnectCollection";
      payload: {
        collectionId: number;
        uuid: HooksId;
      };
    };

function reducer(state: FireclientState, action: Actions): FireclientState {
  switch (action.type) {
    case "setDoc":
      return state.setIn(
        ["doc", action.payload.docId, "snapshot"],
        action.payload.snapshot
      );

    case "setCollection":
      return state.setIn(
        ["collection", action.payload.collectionId, "docIds"],
        action.payload.docIds
      );

    case "connectDoc":
      return state
        .get("doc")
        .get(action.payload.docId)
        .get("connectedFrom") === undefined
        ? state.setIn(
            ["doc", action.payload.docId, "connectedFrom"],
            Set.of(action.payload.uuid)
          )
        : state.setIn(
            ["doc", action.payload.docId, "connectedFrom"],
            state
              .get("doc")
              .get(action.payload.docId)
              .get("connectedFrom")
              .add(action.payload.uuid)
          );

    case "connectCollection":
      return state
        .get("collection")
        .get(action.payload.collectionId)
        .get("connectedFrom") === undefined
        ? state.setIn(
            ["collection", action.payload.collectionId, "connectedFrom"],
            Set.of(action.payload.uuid)
          )
        : state.setIn(
            ["collection", action.payload.collectionId, "connectedFrom"],
            state
              .get("collection")
              .get(action.payload.collectionId)
              .get("connectedFrom")
              .add(action.payload.uuid)
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
              .delete(action.payload.uuid)
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
              .delete(action.payload.uuid)
          );

    default:
      throw new Error();
  }
}

export default reducer;
