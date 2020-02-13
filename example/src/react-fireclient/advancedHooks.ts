import { firestore } from "firebase";
import "firebase/firestore";
import { Map } from "immutable";
import * as pathlib from "path";
import { useEffect, useState } from "react";
import {
  ArrayQuery,
  CollectionData,
  createDataFromCollection,
  CursorDirection,
  DocData,
  GetFql,
  ObjectQuery,
  Order,
  OrderDirection,
  Query,
  QueryOptions,
} from ".";
import { getCollection, getDoc, subscribeCollection, subscribeDoc } from "./getFunctions";
import {
  initialCollectionData,
  initialDocData,
  useGetCollection,
  useGetCollectionSnapshot,
} from "./getHooks";
import * as typeCheck from "./typeCheck";
import { assertRule, matches } from "./typeCheck";
import { generateHooksId, getHashCode, isDocPath } from "./utils";

type ArrayQueryData = (DocData | CollectionData)[];

// TODO:
// https://firebase.google.com/docs/firestore/manage-data/transactions?hl=ja
// トランザクションを使用する
export function useArrayQuery(
  getFql: GetFql<ArrayQuery>,
): [ArrayQueryData, boolean, any, { unsubscribe: () => void; reload: () => void }] {
  assertRule(typeCheck.arrayGetFqlRule)(getFql, "getFql");
  const { queries, callback } = getFql;
  const connects = getFql.connects === true; // getFql.connects can be undefined
  const acceptOutdated = getFql.acceptOutdated === true; // getFql.acceptOutdated can be undefined
  const initialQueryData: ArrayQueryData = queries.map(query =>
    isDocPath(query.location) ? initialDocData : initialCollectionData,
  );

  // Subscribeする場合があるので、HooksのIdを持っておく
  const [hooksId] = useState(generateHooksId());

  const [error, setError] = useState(null);
  const [queryData, setQueryData] = useState<ArrayQueryData>(initialQueryData);
  const [loading, setLoading] = useState(false);
  const [unsubscribe, setUnsubscribe] = useState<{
    unsubscribe: () => void;
    reload: () => void;
  }>({
    unsubscribe: (): void => {
      /* do nothing */
    },
    reload: (): void => {
      /* do nothing */
    },
  });

  const loadQuery = () => {
    setLoading(true);
    let reloadFns: (() => void)[] = [];
    let unsubFns: (() => void)[] = [];

    // React HooksはCallback内で呼び出せないので、
    // fetchFunctionsの関数を直接呼び出す
    Promise.all<{ data: DocData | CollectionData; key: number }>(
      queries.map(
        (query: Query, i: number) =>
          new Promise<{
            data: DocData | CollectionData;
            key: number;
          }>((resolve, reject) => {
            const { location, limit, where, order, cursor } = query;
            const queryConnects = query.connects === undefined ? connects : query.connects;
            const queryAcceptOutdated =
              query.acceptOutdated === undefined ? acceptOutdated : query.acceptOutdated;
            const queryCallback = query.callback;
            const isDocQuery = isDocPath(location);

            const onChange = (data: DocData | CollectionData) => {
              resolve({ data: data, key: i });
              if (callback !== undefined) callback(data);
              if (queryCallback !== undefined) queryCallback(data);
            };
            const onError = reject;
            const onListen = (): void => {
              /* do nothing */
            };

            if (isDocQuery && !queryConnects) {
              const load = () => getDoc(location, onChange, onError, queryAcceptOutdated);
              load();
              reloadFns.push(load);
            } else if (isDocQuery && queryConnects) {
              const unsub = subscribeDoc(hooksId, location, onChange, onError, onListen);
              unsubFns.push(unsub);
            } else if (!isDocQuery && !queryConnects) {
              const load = () =>
                getCollection(
                  location,
                  onChange,
                  onError,
                  { limit, where, order, cursor },
                  queryAcceptOutdated,
                );
              load();
              reloadFns.push(load);
            } else if (!isDocQuery && queryConnects) {
              const unsub = subscribeCollection(hooksId, location, onChange, onError, onListen, {
                limit,
                where,
                order,
                cursor,
              });
              unsubFns.push(unsub);
            }
          }),
      ),
    )
      .then(res => {
        setQueryData(res.sort((a, b) => a.key - b.key).map(r => r.data));
        setUnsubscribe({
          unsubscribe: () => unsubFns.forEach(fn => fn()),
          reload: () => reloadFns.forEach(fn => fn()),
        });
        setLoading(false);
      })
      .catch(err => {
        // throw Error(err);
        setLoading(false);
        setError(err);
      });
  };
  useEffect(() => {
    loadQuery();
    // loadQueryをexhaustive-depsから除外
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getHashCode(getFql)]);

  return [queryData, loading, error, unsubscribe];
}

type QueryData = Map<string, DocData | CollectionData | {}>;

export function useQuery(
  getFql: GetFql<ObjectQuery>,
): [QueryData, boolean, any, { unsubscribe: () => void; reload: () => void }] {
  assertRule(typeCheck.getFqlRule)(getFql, "getFql");
  const { queries } = getFql;

  const idxToKey = Object.keys(queries).reduce(
    (acc: any, key, i: number) => acc.set(i, key),
    Map(),
  );
  const arrayQueries = Object.values(queries);
  const arrayGetFql = {
    ...getFql,
    queries: arrayQueries,
  };
  const [queryData, loading, error, unsubscribe] = useArrayQuery(arrayGetFql);

  return [
    queryData.reduce((acc: any, queryDat, i) => acc.set(idxToKey.get(i), queryDat), Map()).toJS(),
    loading,
    error,
    unsubscribe,
  ];
}

function useGetMinMax(
  path: string,
  options: {
    callback?: () => void;
    acceptOutdated?: boolean;
  } & QueryOptions,
): [firestore.DocumentSnapshot | null, firestore.DocumentSnapshot | null, () => void, () => void] {
  const order = options.order as Order;
  const isDesc = order.direction === "desc";
  const minDocOption = {
    ...options,
    limit: 1,
  };
  const maxDocOption = {
    ...options,
    limit: 1,
    order: {
      ...order,
      direction: (isDesc ? "asc" : "desc") as OrderDirection,
    },
  };

  const [min, , , reloadMin] = useGetCollectionSnapshot(path, minDocOption);
  const [max, , , reloadMax] = useGetCollectionSnapshot(path, maxDocOption);
  return [
    min !== null && min[0] !== undefined ? min[0] : null,
    max !== null && max[0] !== undefined ? max[0] : null,
    reloadMin,
    reloadMax,
  ];
}

function reverseDirection(reverse: boolean, direction: OrderDirection = "asc"): OrderDirection {
  switch (direction) {
    case "asc":
      return !reverse ? "asc" : "desc";
    case "desc":
      return !reverse ? "asc" : "desc";
  }
}

function reverseOrder(reverse: boolean, order: Order | Order[]): Order | Order[] {
  return Array.isArray(order)
    ? order.map(o => ({ ...o, direction: reverseDirection(reverse, o.direction) }))
    : { ...order, direction: reverseDirection(reverse, order.direction) };
}
type PageHandler = {
  fn: () => void;
  enabled: boolean;
};
export function usePaginateCollection(
  path: string,
  options: {
    callback?: () => void;
    acceptOutdated?: boolean;
  } & QueryOptions,
): [CollectionData, boolean, any, PageHandler, PageHandler] {
  assertRule([
    {
      key: "path",
      fn: typeCheck.isString,
    },
    {
      key: "options",
      fn: matches(typeCheck.paginateOptionRule),
    },
  ])({ path, options }, "Argument");
  const order = options.order as Order;
  const [min, max, reloadMin, reloadMax] = useGetMinMax(path, options);
  const [first, setFirst] = useState<any>(null);
  const [last, setLast] = useState<any>(null);

  // 前のページに戻る際、 orderを反転させてクエリする必要がある
  // クエリ実行とデータ取得には遅延があるため、reversedを分ける
  const [queryReversed, setQueryReversed] = useState<boolean>(false);
  const [dataReversed, setDataReversed] = useState<boolean>(false);
  const [origin, setOrigin] = useState<any>(null);

  const optionsWithCursor =
    origin === null
      ? options
      : {
          ...options,
          // reversedを反映
          order: reverseOrder(queryReversed, order),
          // originを反映
          cursor: {
            origin,
            direction: "startAfter" as CursorDirection,
          },
          callback: () => {
            if (options.callback !== undefined) options.callback();
            setDataReversed(queryReversed);
          },
        };
  // first,minは同じCollectionに含まれる
  const remainsPrev = first !== null && min !== null && first.id !== min.id;
  const prevHandler = {
    fn: remainsPrev
      ? () => {
          setOrigin(first);
          setQueryReversed(true);
          reloadMin();
        }
      : (): void => {
          /* do nothing */
        },
    enabled: remainsPrev,
  };
  // last,maxは同じCollectionに含まれる
  const remainsNext = last !== null && max !== null && last.id !== max.id;
  const nextHandler = {
    fn: remainsNext
      ? () => {
          setOrigin(last);
          setQueryReversed(false);
          reloadMax();
        }
      : (): void => {
          /* do nothing */
        },
    enabled: remainsNext,
  };

  const [collection, loading, error] = useGetCollectionSnapshot(path, optionsWithCursor);
  const nextFirst = collection !== null && collection.length > 0 ? collection[0] : null;
  const nextFirstId = nextFirst !== null ? nextFirst.id : null;
  const nextLast =
    collection !== null && collection.length > 0 ? collection[collection.length - 1] : null;
  const nextLastId = nextLast !== null ? nextLast.id : null;

  useEffect(() => {
    setFirst(!queryReversed ? nextFirst : nextLast);
    setLast(!queryReversed ? nextLast : nextFirst);
    // [nextFirst, nextLast]の代わりに[nextFirstId, nextLastId]を使用
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextFirstId, nextLastId]);

  const collectionData = collection !== null ? createDataFromCollection(collection) : [];
  return [
    !dataReversed ? collectionData : collectionData.slice().reverse(),
    loading,
    error,
    prevHandler,
    nextHandler,
  ];
}

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
