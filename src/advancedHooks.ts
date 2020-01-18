import { firestore } from "firebase";
import "firebase/firestore";
import { fromJS, Map } from "immutable";
import * as pathlib from "path";
import { useEffect, useState } from "react";
import {
  ArrayQuerySchema,
  createDataFromCollection,
  createDataFromDoc,
  CursorDirection,
  FireclientDoc,
  Order,
  OrderDirection,
  Query,
  QueryOption,
  QuerySchema,
} from ".";
import { getCollection, getDoc, subscribeCollection, subscribeDoc } from "./fetchFunctions";
import {
  generateHooksId,
  initialCollectionData,
  initialDocData,
  useGetCollectionSnapshot,
  useGetDoc,
} from "./hooks";
import {
  assert,
  assertArrayQuerySchema,
  assertPaginateOption,
  assertPath,
  assertQuerySchema,
  assertSubCollectionOption,
} from "./validation";

function isDoc(path: string): boolean {
  const p = pathlib.resolve(path);
  return p.split("/").length % 2 === 1;
}

type ArrayQueryData = (FireclientDoc | FireclientDoc[])[];

export function useArrayQuery(
  querySchema: ArrayQuerySchema,
): [ArrayQueryData, boolean, any, { unsubscribe: () => void; reload: () => void }] {
  assertArrayQuerySchema(querySchema);
  const { queries, callback, acceptOutdated } = querySchema;
  const connects = querySchema.connects ? querySchema.connects : false;
  const initialQueryData: ArrayQueryData = queries.map(query =>
    isDoc(query.location) ? initialDocData : initialCollectionData,
  );

  // Subscribeする場合があるので、HooksのIdを持っておく
  const [hooksId] = useState(generateHooksId());

  const [error, setError] = useState(null);
  const [queryData, setQueryData] = useState<ArrayQueryData>(initialQueryData);
  const [loading, setLoading] = useState(false);
  const [unsubscribe, setUnsubscribe] = useState<{
    unsubscribe: () => void;
    reload: () => void;
  }>({ unsubscribe: () => {}, reload: () => {} });

  const loadQuery = () => {
    setLoading(true);
    let reloads: (() => void)[] = [];
    let unsubFns: (() => void)[] = [];

    // React HooksはCallback内で呼び出せないので、
    // fetchFunctionsの関数を直接呼び出す
    Promise.all<{ data: FireclientDoc | FireclientDoc[]; key: number }>(
      queries.map(
        (query: Query, i: number) =>
          new Promise<{
            data: FireclientDoc | FireclientDoc[];
            key: number;
          }>((resolve, reject) => {
            const { location, limit, where, order, cursor } = query;
            const queryConnects = query.connects === undefined ? connects : query.connects;
            const isDocQuery = isDoc(location);

            const onFetchDoc = (doc: firestore.DocumentSnapshot) => {
              resolve({ data: createDataFromDoc(doc), key: i });
              if (callback !== undefined) callback();
            };
            const onFetchCollection = (collection: firestore.DocumentSnapshot[]) => {
              resolve({ data: createDataFromCollection(collection), key: i });
              if (callback !== undefined) callback();
            };
            const onError = reject;

            if (isDocQuery && !queryConnects) {
              const load = () => getDoc(location, onFetchDoc, onError, acceptOutdated);
              load();
              reloads.push(load);
            } else if (isDocQuery && queryConnects) {
              const unsub = subscribeDoc(hooksId, location, onFetchDoc, onError);
              unsubFns.push(unsub);
            } else if (!isDocQuery && !queryConnects) {
              const load = () =>
                getCollection(
                  location,
                  { limit, where, order, cursor },
                  onFetchCollection,
                  onError,
                  acceptOutdated,
                );
              load();
              reloads.push(load);
            } else if (!isDocQuery && queryConnects) {
              const unsub = subscribeCollection(
                hooksId,
                location,
                { limit, where, order, cursor },
                onFetchCollection,
                onError,
              );
              unsubFns.push(unsub);
            }
          }),
      ),
    )
      .then(res => {
        setQueryData(res.sort((a, b) => a.key - b.key).map(r => r.data));
        setUnsubscribe({
          unsubscribe: () => unsubFns.forEach(fn => fn()),
          reload: () => reloads.forEach(fn => fn()),
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
  }, [fromJS(querySchema).hashCode()]);

  return [queryData, loading, error, unsubscribe];
}

type QueryData = Map<string, FireclientDoc | FireclientDoc[] | {}>;

export function useQuery(
  querySchema: QuerySchema,
): [QueryData, boolean, any, { unsubscribe: () => void; reload: () => void }] {
  assertQuerySchema(querySchema);
  const { queries } = querySchema;

  const idxToKey = Object.keys(queries).reduce(
    (acc: any, key, i: number) => acc.set(i, key),
    Map(),
  );
  const arrayQueries = Object.values(queries);
  const schema = {
    ...querySchema,
    queries: arrayQueries,
  };
  const [queryData, loading, error, unsubscribe] = useArrayQuery(schema);

  return [
    queryData.reduce((acc: any, queryDat, i) => acc.set(idxToKey.get(i), queryDat), Map()).toJS(),
    loading,
    error,
    unsubscribe,
  ];
}

function useGetMinMax(
  path: string,
  option: {
    callback?: () => void;
    acceptOutdated?: boolean;
  } & QueryOption,
): [firestore.DocumentSnapshot | null, firestore.DocumentSnapshot | null, () => void, () => void] {
  const order = option.order as Order;
  const isDesc = order.direction === "desc";
  const minDocOption = {
    ...option,
    limit: 1,
  };
  const maxDocOption = {
    ...option,
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

export function usePaginateCollection(
  path: string,
  option: {
    callback?: () => void;
    acceptOutdated?: boolean;
  } & QueryOption,
) {
  assertPath(path);
  assertPaginateOption(option);
  const order = option.order as Order;
  const [min, max, reloadMin, reloadMax] = useGetMinMax(path, option);
  const [first, setFirst] = useState<any>(null);
  const [last, setLast] = useState<any>(null);

  // 前のページに戻る際、 orderを反転させてクエリする必要がある
  // クエリ実行とデータ取得には遅延があるため、reversedを分ける
  const [queryReversed, setQueryReversed] = useState<boolean>(false);
  const [dataReversed, setDataReversed] = useState<boolean>(false);
  const [origin, setOrigin] = useState<any>(null);

  const optionWithCursor =
    origin === null
      ? option
      : {
          ...option,
          // reversedを反映
          order: {
            ...order,
            direction: reverseDirection(queryReversed, order.direction),
          },
          // originを反映
          cursor: {
            origin,
            direction: "startAfter" as CursorDirection,
          },
          callback: () => {
            if (option.callback !== undefined) option.callback();
            setDataReversed(queryReversed);
          },
        };
  // first,minは同じCollectionに含まれる
  const remainsPrev = first !== null && min !== null && first.id !== min.id;
  const handlePrev = {
    fn: remainsPrev
      ? () => {
          setOrigin(first);
          setQueryReversed(true);
          reloadMin();
        }
      : () => {},
    enabled: remainsPrev,
  };
  // last,maxは同じCollectionに含まれる
  const remainsNext = last !== null && max !== null && last.id !== max.id;
  const handleNext = {
    fn: remainsNext
      ? () => {
          setOrigin(last);
          setQueryReversed(false);
          reloadMax();
        }
      : () => {},
    enabled: remainsNext,
  };

  const [collection, loading, error]: any[] = useGetCollectionSnapshot(path, optionWithCursor);
  const nextFirst = collection !== null && collection.length > 0 ? collection[0] : null;
  const nextLast =
    collection !== null && collection.length > 0 ? collection[collection.length - 1] : null;

  useEffect(() => {
    setFirst(!queryReversed ? nextFirst : nextLast);
    setLast(!queryReversed ? nextLast : nextFirst);
  }, [nextFirst !== null ? nextFirst.id : null, nextLast !== null ? nextLast.id : null]);

  const collectionData = collection !== null ? createDataFromCollection(collection) : [];

  return [
    !dataReversed ? collectionData : collectionData.slice().reverse(),
    loading,
    error,
    handlePrev,
    handleNext,
  ];
}

export function useGetSubCollection(
  path: string,
  option: { field: string; collectionPath: string; acceptOutdated?: boolean },
) {
  assertPath(path);
  assertSubCollectionOption(option);
  const { field, collectionPath, acceptOutdated } = option;
  const [docData, docLoading, docError, reloadDoc] = useGetDoc(path);
  // null -> データ取得前, undfeined -> fieldが存在しない（エラー）
  const docIds = docData.data !== null ? docData.data[field] : null;
  // 取得したDocが field プロパティを持つこと
  assert(docIds !== undefined, `${path} does not contain field "${field}"`);
  // 取得したデータが string[] であること
  assert(
    docIds === null || // データ未取得
      (docIds instanceof Array && docIds.every((docId: any) => typeof docId === "string")),
    `Value of ${field} should be string array.`,
  );
  const queries =
    docIds === null
      ? []
      : docIds.map((docId: string) => ({
          location: pathlib.resolve(collectionPath, docId),
        }));
  const [docDataArray, loading, error] = useArrayQuery({
    acceptOutdated,
    queries,
  });
  return [docDataArray, docLoading || loading, error, reloadDoc];
}
