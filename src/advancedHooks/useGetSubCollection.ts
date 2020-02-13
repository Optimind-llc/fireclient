import "firebase/firestore";
import * as pathlib from "path";
import { CollectionData } from "..";
import { useGetCollection } from "../getHooks/useGetCollection";
import * as typeCheck from "../typeCheck";
import { useArrayQuery } from "./useQuery";

const { assertRule } = typeCheck;

export function useGetSubCollection(
  path: string,
  subCollectionName: string,
  options?: { acceptOutdated?: boolean; callback?: () => void },
): [CollectionData, boolean, any, () => void] {
  // Arg typeCheck
  assertRule([
    { key: "path", fn: typeCheck.isString },
    { key: "subCollectionName", fn: typeCheck.isString },
    {
      key: "options",
      fn: typeCheck.matches(typeCheck.subCollectionOptionRule),
    },
  ])({ path, subCollectionName, options }, "Argument");

  const [collection, collLoading, collError, collReloadFn] = useGetCollection(path, options);
  const docIds = collection.filter(doc => doc.id !== null).map(doc => doc.id) as string[];
  const fql = {
    callback: options?.callback,
    queries: docIds.map(docId => ({ location: pathlib.resolve(path, docId, subCollectionName) })),
  };

  const [subCollection, subCollLoading, subCollError, subCollReloadFn] = useArrayQuery(fql);

  const flatten = Array.prototype.concat.apply([], subCollection);
  const loading = collLoading || subCollLoading;
  const error = collError !== null ? collError : subCollError;
  return [
    flatten,
    loading,
    error,
    () => {
      collReloadFn();
      subCollReloadFn.reload();
    },
  ];
}
