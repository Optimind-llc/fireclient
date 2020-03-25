import { useState } from "react";
import { SetFql } from "..";
import { deleteDoc } from "../setFunctions";
import * as typeCheck from "../typeCheck";
import { assertRule, matches } from "../typeCheck";

export function useDeleteDoc(
  docPath: string,
  options?: {
    callback?: () => void;
    saveToState?: boolean;
  },
): [() => void, boolean, boolean, any] {
  // Argument typeCheck
  assertRule([
    { key: "docPath", fn: typeCheck.isString },
    {
      key: "options",
      optional: true,
      fn: matches(typeCheck.concatRule(typeCheck.callbackRule, typeCheck.saveToStateRule)),
    },
  ])({ docPath, options }, "Argument");

  const [deleting, setDeleting] = useState(false);
  const [called, setCalled] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteFn = (): void => {
    setDeleting(true);
    setCalled(true);
    deleteDoc(
      docPath,
      () => {
        setError(null);
        setDeleting(false);
        if (options?.callback) options.callback();
      },
      err => {
        setError(err);
        setDeleting(false);
      },
      options,
    );
  };
  return [deleteFn, deleting, called, error];
}

export function useDeleteDocs(
  docPaths: string[],
  query: SetFql,
  options?: {
    callback?: () => void;
    saveToState?: boolean;
  },
): [() => void, boolean, boolean, any] {
  // Argument typeCheck
  assertRule([
    { key: "docPaths", fn: typeCheck.isArrayOf(typeCheck.isString) },
    {
      key: "options",
      optional: true,
      fn: matches(typeCheck.concatRule(typeCheck.callbackRule, typeCheck.saveToStateRule)),
    },
  ])({ docPaths, options }, "Argument");

  const [deleting, setDeleting] = useState(false);
  const [called, setCalled] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteFn = (): void => {
    setDeleting(true);
    setCalled(true);

    Promise.all(
      docPaths.map(
        docPath => new Promise((resolve, reject) => deleteDoc(docPath, resolve, reject, options)),
      ),
    )
      .then(() => {
        setError(null);
        setDeleting(false);
        if (options?.callback) options.callback();
      })
      .catch(err => {
        setError(err);
        setDeleting(false);
      });
  };
  return [deleteFn, deleting, called, error];
}
