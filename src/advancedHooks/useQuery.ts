import { Map } from "immutable";
import { useEffect, useState } from "react";
import {
  ArrayQuery,
  CollectionData,
  DocData,
  GetFql,
  initialCollectionData,
  initialDocData,
  ObjectQuery,
  Query,
} from "..";
import { getCollection, getDoc, subscribeCollection, subscribeDoc } from "../getFunctions";
import useIsMounted from "../isMounted";
import * as typeCheck from "../typeCheck";
import { assertRule } from "../typeCheck";
import { generateHooksId, getHashCode, isDocPath } from "../utils";

type ArrayQueryData = (DocData | CollectionData)[];

export function useArrayQuery(
  getFql: GetFql<ArrayQuery>,
): [ArrayQueryData, boolean, any, { unsubscribe: () => void; reload: () => void }] {
  assertRule(typeCheck.arrayGetFqlRule)(getFql, "getFql");
  const { queries, callback } = getFql;
  const connects = !!getFql.connects; // getFql.connects can be undefined
  const acceptOutdated = !!getFql.acceptOutdated; // getFql.acceptOutdated can be undefined
  const initialQueryData: ArrayQueryData = queries.map(query =>
    isDocPath(query.location) ? initialDocData : initialCollectionData,
  );

  const isMounted = useIsMounted();
  const [hooksId] = useState(generateHooksId());
  const [error, setError] = useState<Error | null>(null);
  const [queryData, setQueryData] = useState<ArrayQueryData>(initialQueryData);
  const [loading, setLoading] = useState(true);
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

  const loadQuery = (): void => {
    setLoading(true);
    const reloadFns: (() => void)[] = [];
    const unsubFns: (() => void)[] = [];

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
            const queryConnects = query.connects ? query.connects : connects;
            const queryAcceptOutdated = query.acceptOutdated
              ? query.acceptOutdated
              : acceptOutdated;
            const queryCallback = query.callback;
            const isDocQuery = isDocPath(location);

            const onChange = (data: DocData | CollectionData): void => {
              resolve({ data: data, key: i });
              if (callback) callback(data);
              if (queryCallback) queryCallback(data);
            };
            const onError = reject;
            const onListen = (): void => {
              /* do nothing */
            };

            if (isDocQuery && !queryConnects) {
              const load = (): void => getDoc(location, onChange, onError, queryAcceptOutdated);
              load();
              reloadFns.push(load);
            } else if (isDocQuery && queryConnects) {
              const unsub = subscribeDoc(hooksId, location, onChange, onError, onListen);
              unsubFns.push(unsub);
            } else if (!isDocQuery && !queryConnects) {
              const load = (): void =>
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
        if (isMounted.current) {
          setQueryData(res.sort((a, b) => a.key - b.key).map(r => r.data));
          setUnsubscribe({
            unsubscribe: () => unsubFns.forEach(fn => fn()),
            reload: () => reloadFns.forEach(fn => fn()),
          });
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted.current) {
          setLoading(false);
          setError(err);
        }
      });
  };
  useEffect(loadQuery, [getHashCode(getFql)]);

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
