import { firestore } from "firebase";
import "firebase/firestore";
import { fromJS, Map } from "immutable";
import * as pathlib from "path";
import { useEffect, useState } from "react";
import {
  ObjectQuery,
  ArrayQuery,
  CollectionData,
  createDataFromCollection,
  CursorDirection,
  DocData,
  Order,
  OrderDirection,
  Query,
  QueryOptions,
  QuerySchema,
} from ".";
import { getCollection, getDoc, subscribeCollection, subscribeDoc } from "./getFunctions";
import {
  generateHooksId,
  initialCollectionData,
  initialDocData,
  useGetCollectionSnapshot,
  useGetDoc,
} from "./getHooks";
import { isDocPath } from "./utils";
import * as validation from "./validation";
import { assert, assertRule, matches } from "./validation";

type ArrayQueryData = (DocData | CollectionData)[];

// TODO:
// https://firebase.google.com/docs/firestore/manage-data/transactions?hl=ja
// トランザクションを使用する
export function useArrayQuery(
  querySchema: QuerySchema<ArrayQuery>,
): [ArrayQueryData, boolean, any, { unsubscribeFn: () => void; reloadFn: () => void }] {
  assertRule(validation.arrayQuerySchemaRule)(querySchema, "querySchema");
  const { queries, callback, acceptOutdated } = querySchema;
  const connects = querySchema.connects ? querySchema.connects : false;
  const initialQueryData: ArrayQueryData = queries.map(query =>
    isDocPath(query.location) ? initialDocData : initialCollectionData,
  );

  // Subscribeする場合があるので、HooksのIdを持っておく
  const [hooksId] = useState(generateHooksId());

  const [error, setError] = useState(null);
  const [queryData, setQueryData] = useState<ArrayQueryData>(initialQueryData);
  const [loading, setLoading] = useState(false);
  const [unsubscribe, setUnsubscribe] = useState<{
    unsubscribeFn: () => void;
    reloadFn: () => void;
  }>({ unsubscribeFn: () => {}, reloadFn: () => {} });

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
            const isDocQuery = isDocPath(location);

            const onChange = (data: DocData | CollectionData) => {
              resolve({ data: data, key: i });
              if (callback !== undefined) callback();
            };
            const onError = reject;
            const onListen = () => {};

            if (isDocQuery && !queryConnects) {
              const load = () => getDoc(location, onChange, onError, acceptOutdated);
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
                  acceptOutdated,
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
          unsubscribeFn: () => unsubFns.forEach(fn => fn()),
          reloadFn: () => reloadFns.forEach(fn => fn()),
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

type QueryData = Map<string, DocData | CollectionData | {}>;

export function useQuery(
  querySchema: QuerySchema<ObjectQuery>,
): [QueryData, boolean, any, { unsubscribeFn: () => void; reloadFn: () => void }] {
  assertRule(validation.querySchemaRule)(querySchema, "querySchema");
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
  } & QueryOptions,
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

function reverseOrder(reverse: boolean, order: Order | Order[]): Order | Order[] {
  return Array.isArray(order)
    ? order.map(o => ({ ...o, direction: reverseDirection(reverse, o.direction) }))
    : { ...order, direction: reverseDirection(reverse, order.direction) };
}

export function usePaginateCollection(
  path: string,
  option: {
    callback?: () => void;
    acceptOutdated?: boolean;
  } & QueryOptions,
) {
  assertRule([
    {
      key: "path",
      fn: validation.isString,
    },
    {
      key: "option",
      fn: matches(
        validation.paginateOptionRule.concat(
          validation.callbackRule,
          validation.acceptOutdatedRule,
        ),
      ),
    },
  ])({ path, option }, "Argument");
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
          order: reverseOrder(queryReversed, order),
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
  assertRule([
    {
      key: "path",
      fn: validation.isString,
    },
    {
      key: "option",
      fn: matches(validation.subCollectionOptionRule.concat(validation.acceptOutdatedRule)),
    },
  ])({ path, option }, "Argument");
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
