import { firestore } from "firebase";
import "firebase/firestore";
import { Map } from "immutable";
import React from "react";
import { FireclientState, ProviderContext } from ".";
import reducer, { Actions } from "./reducer";
import { assert } from "./validation";

export const Context = React.createContext<any>(null);
// ライブラリ内で共有する Context
export const providerContext: ProviderContext = {
  state: null,
  dispatch: null,
  firestoreDB: null,
};
const initialState: FireclientState = Map({
  doc: Map(),
  collection: Map(),
});

export function getContext(): {
  state: FireclientState;
  dispatch: React.Dispatch<Actions>;
  firestoreDB: firestore.Firestore;
} {
  const { state, dispatch, firestoreDB } = providerContext;
  if (state === null || dispatch === null || firestoreDB === null) {
    throw Error(`state, dispatch, db is null.
    You should use <Provider> in parent component.`);
  }
  return { state, dispatch, firestoreDB };
}
/**
 *
 * @param state {FireclientState} - This can be obtained via `context`.
 * @example
 * import { useContext } from "React";
 * import { contertStateToJson, Context } from "react-fireclient";;
 * function Component() {
 *    const { state } = useContext(Context);
 *    const json = convertStateToJson(state);
 */
export function convertStateToJson(state: FireclientState) {
  return JSON.stringify(state, null, 4);
}

function Provider({
  children,
  firestoreDB,
  onAccess = () => {},
}: {
  children: any;
  firestoreDB: firestore.Firestore;
  onAccess: () => void;
}) {
  assert(firestoreDB !== undefined, "firestoreDB props of Provider is undefined");
  assert(firestoreDB !== null, "firestoreDB props of Provider is null");
  const [state, dispatch] = React.useReducer(reducer, initialState);
  // Provider呼び出し時にライブラリ共有 Contextをセットする
  providerContext.state = state;
  providerContext.dispatch = dispatch;
  providerContext.firestoreDB = firestoreDB;

  return (
    <Context.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default Provider;
