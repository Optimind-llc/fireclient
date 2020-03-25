import useIsMounted from "ismounted";
import { firestore } from "firebase";
import { useEffect, useState } from "react";
import { CollectionData, HooksId, initialCollectionData, QueryOptions } from "..";
import { subscribeCollection, subscribeCollectionSnapshot } from "../getFunctions";
import * as typeCheck from "../typeCheck";
import { assertRule, matches } from "../typeCheck";
import { generateHooksId, getHashCode } from "../utils";

type SubscribeCollectionFunction<State> = (
  hooksId: HooksId,
  path: string,
  onChange: (doc: State) => void,
  onError: (err: Error) => void,
  onListen?: () => void,
  options?: QueryOptions,
  saveToState?: boolean,
) => () => void;

export function useSubscribeCollectionBase<State, InitialState = State>(
  path: string,
  initialValue: State | InitialState,
  subscribeFunction: SubscribeCollectionFunction<State>,
  options?: {
    callback?: (data: State) => void;
    saveToState?: boolean;
  } & QueryOptions,
): [State | InitialState, boolean, any, () => void] {
  // Argument typeCheck
  assertRule([
    { key: "path", fn: typeCheck.isString },
    {
      key: "options",
      fn: matches(
        typeCheck.concatRule(
          typeCheck.queryOptionRule,
          typeCheck.callbackRule,
          typeCheck.saveToStateRule,
        ),
      ),
    },
  ])({ path, options }, "Argument");

  const isMounted = useIsMounted();
  const [hooksId] = useState(generateHooksId());
  const [error, setError] = useState<Error | null>(null);
  const [collection, setCollection] = useState<State | InitialState>(initialValue);
  const [loading, setLoading] = useState(true);
  const [unsubscribe, setUnsubscribe] = useState<{
    fn: () => void;
  }>({
    fn: (): void => {
      /* do nothing */
    },
  });

  useEffect(() => {
    const unsub = subscribeFunction(
      hooksId,
      path,
      snapshot => {
        if (isMounted.current) {
          setCollection(snapshot);
          setError(null);
          setLoading(false);
        }
        if (options?.callback) options.callback(snapshot);
      },
      err => {
        if (isMounted.current) {
          setError(err);
          setLoading(false);
        }
      },
      () => {
        if (isMounted.current) setLoading(true);
      },
      options,
    );
    setUnsubscribe({ fn: unsub });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, hooksId, getHashCode(options)]);
  return [collection, loading, error, unsubscribe.fn];
}

export function useSubscribeCollectionSnapshot(
  path: string,
  options?: {
    callback?: (snapshot: firestore.DocumentSnapshot[]) => void;
    saveToState?: boolean;
  } & QueryOptions,
): [firestore.DocumentSnapshot[] | null, boolean, any, () => void] {
  return useSubscribeCollectionBase(path, [], subscribeCollectionSnapshot, options);
}

export function useSubscribeCollection(
  path: string,
  options?: {
    callback?: (collection: CollectionData) => void;
    saveToState?: boolean;
  } & QueryOptions,
): [CollectionData, boolean, any, () => void] {
  return useSubscribeCollectionBase(path, initialCollectionData, subscribeCollection, options);
}
