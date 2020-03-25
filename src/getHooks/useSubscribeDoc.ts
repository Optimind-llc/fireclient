import { firestore } from "firebase";
import { useEffect, useState } from "react";
import { DocData, HooksId, initialDocData } from "..";
import { subscribeDoc, subscribeDocSnapshot } from "../getFunctions";
import * as typeCheck from "../typeCheck";
import { assertRule, matches } from "../typeCheck";
import { generateHooksId, getHashCode } from "../utils";

type SubscribeDocFunction<State> = (
  hooksId: HooksId,
  path: string,
  onChange: (doc: State) => void,
  onError: (err: Error) => void,
  onListen?: () => void,
  saveToState?: boolean,
) => () => void;

export function useSubscribeDocBase<State, InitialState = State>(
  path: string,
  initialValue: State | InitialState,
  subscribeFunction: SubscribeDocFunction<State>,
  options?: {
    callback?: (snapshot: State) => void;
    saveToState?: boolean;
  },
): [State | InitialState, boolean, any, () => void] {
  // Argument typeCheck
  assertRule([
    { key: "path", fn: typeCheck.isString },
    {
      key: "options",
      optional: true,
      fn: matches(typeCheck.concatRule(typeCheck.callbackRule, typeCheck.saveToStateRule)),
    },
  ])({ path, options }, "Argument");

  const [hooksId] = useState(generateHooksId());
  const [error, setError] = useState<Error | null>(null);
  const [doc, setDoc] = useState<State | InitialState>(initialValue);
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
      data => {
        setDoc(data);
        setError(null);
        setLoading(false);
        if (options?.callback) options.callback(data);
      },
      err => {
        setError(err);
        setLoading(false);
      },
      () => setLoading(true),
    );
    setUnsubscribe({ fn: unsub });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, hooksId, getHashCode(options)]);
  return [doc, loading, error, unsubscribe.fn];
}

export function useSubscribeDocSnapshot(
  path: string,
  options?: {
    callback?: (snapshot: firestore.DocumentSnapshot) => void;
    saveToState?: boolean;
  },
): [firestore.DocumentSnapshot | null, boolean, any, () => void] {
  return useSubscribeDocBase(path, null, subscribeDocSnapshot, options);
}

export function useSubscribeDoc(
  path: string,
  options?: {
    callback?: (data: DocData) => void;
    acceptOutdated?: boolean;
    saveToState?: boolean;
  },
): [DocData, boolean, any, () => void] {
  return useSubscribeDocBase(path, initialDocData, subscribeDoc, options);
}
