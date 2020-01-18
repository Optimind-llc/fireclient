import React from "react";
import "firebase/firestore";
import { firestore } from "firebase";
import { FireclientState, ProviderContext } from ".";
import { Actions } from "./reducer";
export declare const Context: React.Context<any>;
export declare const providerContext: ProviderContext;
export declare function unwrapContext(context: ProviderContext): {
    state: FireclientState;
    dispatch: React.Dispatch<Actions>;
    firestoreDB: firestore.Firestore;
};
/**
 *
 * @param state {FireclientState} - This can be obtained via `context`.
 * @example
 * import { useContext } from "React";
 * import { contertStateToJson, Context } from "fireclient";
 * function Component() {
 *    const { state } = useContext(Context);
 *    const json = convertStateToJson(state);
 */
export declare function convertStateToJson(state: FireclientState): string;
declare function Provider({ children, firestoreDB, onAccess }: {
    children: any;
    firestoreDB: firestore.Firestore;
    onAccess: () => void;
}): JSX.Element;
export default Provider;