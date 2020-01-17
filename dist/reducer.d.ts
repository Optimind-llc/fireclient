import { firestore } from "firebase";
import { FireclientState, HooksId } from ".";
import { List } from "immutable";
export declare type Actions = {
    type: "setDoc";
    payload: {
        docId: string;
        snapshot: firestore.DocumentSnapshot;
    };
} | {
    type: "setCollection";
    payload: {
        collectionId: number;
        docIds: List<string>;
    };
} | {
    type: "connectDoc";
    payload: {
        docId: string;
        uuid: HooksId;
    };
} | {
    type: "connectCollection";
    payload: {
        collectionId: number;
        uuid: HooksId;
    };
} | {
    type: "disconnectDoc";
    payload: {
        docId: string;
        uuid: HooksId;
    };
} | {
    type: "disconnectCollection";
    payload: {
        collectionId: number;
        uuid: HooksId;
    };
};
declare function reducer(state: FireclientState, action: Actions): FireclientState;
export default reducer;
