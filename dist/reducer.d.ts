import { List } from "immutable";
import { DocData, CollectionId, FireclientState, HooksId, DocId } from ".";
export declare type Actions = {
    type: "setDoc";
    payload: {
        docId: DocId;
        data: DocData;
    };
} | {
    type: "setCollection";
    payload: {
        collectionId: CollectionId;
        docIds: List<DocId>;
    };
} | {
    type: "deleteDoc";
    payload: {
        docId: DocId;
    };
} | {
    type: "deleteCollection";
    payload: {
        collectionId: CollectionId;
    };
} | {
    type: "connectDoc";
    payload: {
        docId: DocId;
        uuid: HooksId;
    };
} | {
    type: "connectCollection";
    payload: {
        collectionId: CollectionId;
        uuid: HooksId;
    };
} | {
    type: "disconnectDoc";
    payload: {
        docId: DocId;
        uuid: HooksId;
    };
} | {
    type: "disconnectCollection";
    payload: {
        collectionId: CollectionId;
        uuid: HooksId;
    };
};
declare function reducer(state: FireclientState, action: Actions): FireclientState;
export default reducer;
