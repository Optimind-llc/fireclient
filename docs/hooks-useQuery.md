---
id: hooks-useQuery
title: useQuery（クエリオプションを用いたドキュメント・コレクションの取得・監視）
---

Firestore 上の複数の箇所からデータを取得する必要がある場合、取得を一括に行うことができます。

```js
const [queryData, loading, error, fn] = useQuery(fql));
```

### Hooks の戻り値

- **queryData**: <code>([StaticSetFql](misc-type.md#staticsetfql) | [DynamicSetFql](misc-type.md#dynamicsetfql))[]</code>

  Firestore から取得したドキュメント/コレクションの内容です。

- **loading**: `boolean`

  データを取得しているかを表します。

- **error**: `Error`

  データ取得の際にエラーが発生した場合エラー内容が入力されます。
  初期値には`null`が代入されています。

- **fn**: `{reload: () => void, unsubscribe: () => void}`

  `fn.reload` で Get で取得したドキュメント/コレクションを再読込、<br>
  `fn.unsubscribe` で リッスンしているドキュメント/コレクションのリッスンを中断します。

### Hooks の引数

- **fql**: [`GetFql`](misc-type.md#getfql)

  Firestore 上のどの ドキュメント / コレクション を取得するかを宣言的に示すオブジェクトです。取得時のオプションなども指定することができます。

# Example

```js
const fql = {
  queries: {
    newYork: {
      location: "/cities/NewYork",
    },
    users: {
      location: "/users",
    },
  },
};

const [queryData, loading, error, queryData] = useQuery(fql);
const { newYork, users } = queryData;
```

`queryData` には次のような内容が代入されます。

```js
{
  newYork: {
    data: {
      country: "United States",
      name: "New York",
      population: 19354922,
    },
    id: "NewYork",
  },
  users: [
    {
      data: {
        age: 22,
        gender: "man",
        name: "James Adams",
      },
      id: "Adams",
    },
    {
      data: {
        age: 19,
        gender: "female",
        name: "Mary Baker",
      },
      id: "Baker",
    },
    {
      data: {
        age: 25,
        gender: "male",
        name: "John Clark",
      },
      id: "Clark",
    },
    {
      data: {
        age: 28,
        gender: "female",
        name: "Patricia Davis",
      },
      id: "Davis",
    },
  ],
}
```
