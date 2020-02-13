import { getContext } from "./provider";
import { deleteDocFromState } from "./utils";

export function deleteDoc(
  path: string,
  onDelete: () => void,
  onError: (error: any) => void,
  options: {
    saveToState?: boolean;
  } = {},
): void {
  const { firestoreDB, dispatch, onAccess } = getContext();
  const saveToState = options.saveToState !== false; // default true
  try {
    onAccess();
    firestoreDB
      .doc(path)
      .delete()
      .then(() => {
        if (saveToState) deleteDocFromState(dispatch, path);
        onDelete();
      })
      .catch(err => {
        console.error(err);
        onError(err);
      });
  } catch (err) {
    console.error(err);
  }
}
