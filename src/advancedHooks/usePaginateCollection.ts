import { firestore } from "firebase";
import "firebase/firestore";
import { useEffect, useState } from "react";
import {
  CollectionData,
  createDataFromCollection,
  CursorDirection,
  Order,
  OrderDirection,
  QueryOptions,
} from "..";
import { useGetCollectionSnapshot } from "../getHooks/useGetCollection";
import * as typeCheck from "../typeCheck";
import { assertRule, matches } from "../typeCheck";

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
      : () => {},
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
      : () => {},
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
