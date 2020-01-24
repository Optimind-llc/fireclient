import * as pathlib from "path";
import { DocData, SetDocQueryObject } from ".";
import { getContext } from "./provider";
import { saveDoc, createDataFromDoc } from "./utils";

export function addDoc(
  path: string,
  query: SetDocQueryObject,
  onSet: (data: DocData) => void,
  onError: (error: any) => void,
) {
  const { firestoreDB, dispatch } = getContext();
  const { fields } = query;
  try {
    const ref = firestoreDB.collection(path);
    ref
      .add(fields)
      .then(doc => {
        const docId = pathlib.resolve(path, doc.id);
        const data = createDataFromDoc(doc);
        saveDoc(dispatch, docId, data);
        onSet(data);
      })
      .catch(err => onError(err));
  } catch (err) {
    onError(err);
  }
}

export function setDoc(
  path: string,
  query: SetDocQueryObject,
  onSet: () => void,
  onError: (error: any) => void,
) {
  const { firestoreDB, dispatch } = getContext();
  const docId = pathlib.resolve(path);
  const { fields } = query;
  const docData: DocData = {
    data: fields,
    id: pathlib.basename(path),
  };

  try {
    const ref = firestoreDB.doc(path);
    ref
      .set(fields)
      .then(() => {
        saveDoc(dispatch, docId, docData);
        onSet();
      })
      .catch(err => onError(err));
  } catch (err) {
    onError(err);
  }
}

export function updateDoc(
  path: string,
  query: SetDocQueryObject,
  onUpdate: () => void,
  onError: (error: any) => void,
) {
  const { firestoreDB, dispatch } = getContext();
  const docId = pathlib.resolve(path);
  const { fields } = query;
  const docData: DocData = {
    data: fields,
    id: pathlib.basename(path),
  };

  try {
    const ref = firestoreDB.doc(path);
    ref
      .update(fields)
      .then(() => {
        saveDoc(dispatch, docId, docData);
        onUpdate();
      })
      .catch(err => onError(err));
  } catch (err) {
    onError(err);
  }
}
