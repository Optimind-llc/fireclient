---
id: custom-hooks-paginate
title: 作成例：ページ切り替え
---

この例では、簡易的なページ切り替えを行うための Hooks を作成します。
作成する Hooks は次の機能を持ちます。

- 特定のページに含まれるデータの取得
- ページ移動のハンドリング

# Cursor を使用した Collection の取得

まず、Collection の取得の際に Doc の範囲指定をすることを考えて見ましょう。

カーソルを使ってクエリを行うために、Option には

- limit
- order
- cursor

の 3 つの要素が含まれている必要があります。

実際に Cursor を用いて Collection を取得してみましょう。

```js
const [originSnapshot] = useGetDocSnapshot("/cities/city9");
const option = {
  limit: 3,
  order: {
    by: "population",
  },
  cursor: {
    origin: originDocSnapshot,
    direction: "startAfter",
  },
};
const [collectionData] = useGetCollection("/cities", option);
```

これにより、例えば`"/cities"`に含まれる Doc を`population`でソートして

```text
- city5 : { population : 17000000 }
- city8 : { population : 18000000 }
- city9 : { population : 19000000 }
- city4 : { population : 20000000 }
- city1 : { population : 21000000 }
- city2 : { population : 22000000 }
- city6 : { population : 23000000 }
```

のようになっていた場合、`city4`, `city1`, `city2`を取得します。
`city9`よりも`population`が大きい 3 つの Doc を取得していることが分かります。

```text
- city4 : { population : 20000000 }
- city1 : { population : 21000000 }
- city2 : { population : 22000000 }
```

注意：`startAfter` の場合 origin の値は含まれません。含めるには `startAt` を使用します。

# Origin を変化させる

ページを前方向にすすめてみましょう。

まず、現在表示している Doc の範囲を保持しておく必要があります。初期値には`null`をセットしておきます。

```js
const [last, setLast] = useState(null);
```

そして、データを取得したら last の内容を更新します。

```js
const option = { limit: 3 };
const [collection, loading, error] = useGetCollectionSnapshot(path, option);
const nextLast =
  collection !== null && collection.length > 0 ? collection[collection.length - 1] : null;
useEffect(() => {
  setLast(nextLast);
}, [nextLast]);
```

ここで、`last`は`cursor.origin`に適応するのでスナップショットになっている必要があり、Collection の取得には`useGetCollection`ではなく、`useGetCollectionSnapshot`を用います。

代わりに Hooks の返り値には`createDataFromCollection`を適応したものを入れます。これにより、`useGetCollection`で取得したものと同じになります。

この時点での全体のコードは次のようになります。

```js
import { createDataFromCollection } from "react-fireclient";

function usePaginate(path, option) {
  const [last, setLast] = useState(null);
  const option = { limit: 3 };

  const [collection, loading, error] = useGetCollectionSnapshot(path, option);
  const nextLast =
    collection !== null && collection.length > 0 ? collection[collection.length - 1] : null;
  useEffect(() => {
    setLast(nextLast);
  }, [nextLast]);

  return [createDataFromCollection(collection), loading, error];
}
```

また、cursor の origin にあたる部分も保持しておく必要があります。
これは`useGetCollection`に渡され、どの範囲で Doc を参照するべきなのかを管理します。

```js
const [origin, setOrigin] = useState(null);
```

すると`useGetCollection`の部分は次のように書き換えられます。

注意：初回のデータ取得では `option` は `null` になっており、1, 2, ..., `option.limit` 番目の Doc が取得されます。

```js
const option = {
    last === null
    ? option
    : {
      ...option
      cursor: {
        origin,
        direction: "startAfter"
      }
    }
  }
```

「ページを切り替える」とは origin を変化させることを指します。
そのため、ボタンなどのアクションに応じて`origin`の内容を更新します。

```js
const handleNext = () => setOrigin(last);
```

この時点での全体のコードは次のようになります。

```js
function usePaginate(path, option) {
  const { order } = option;
  const criterion = order.by;
  const [last, setLast] = useState(null);
  const [origin, setOrigin] = useState(null);
  const option = {
    last === null
    ? option
    : {
      ...option
      cursor: {
        origin,
        direction: "startAfter"
      }
    }
  }
  const [collectionData] = useGetCollection(path, option);
  const nextLast = collectionData.length > 0 ? collectionData[collectionData.length - 1][criterion] : null;
  const handleNext = () => setOrigin(last);
  useEffect(() => {
    setLast(nextLast);
  }, [nextLast]);
  return [collectionData, handleNext];
}
```

また、コンポーネント側からは次のように使うことができます。

```js
const [cities, handleNext] = usePaginate("/cities", {
  order: {
    by: "population",
    direction: "asc",
  },
  limit: 2,
});
return (
  <>
    <button onClick={handleNext}>next</button>
    <pre>{JSON.stringify(cities, null, 4)}</pre>
  </>
);
```

また、今回作った Hooks を拡張したものがライブラリに組み込まれているので、
次のようにしてページ切り替えの Hooks を試すことができます。

```js
import { usePaginateCollection } from "react-fireclient";
```

```js
const [cities, loading, error, prevHandler, prevHandler] = usePaginateCollection("/cities", {
  order: {
    by: "population",
    direction: "asc",
  },
  limit: 2,
});
return (
  <>
    <button disabled={!prevHandler.enabled} onClick={prevHandler.fn}>
      prev
    </button>
    <button disabled={!prevHandler.enabled} onClick={prevHandler.fn}>
      next
    </button>
    <pre>{JSON.stringify(cities, null, 4)}</pre>
  </>
);
```
