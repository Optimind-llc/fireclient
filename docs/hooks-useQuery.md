---
id: hooks-useQuery
title: useQuery（クエリオプションを用いたドキュメント・コレクションの取得・監視）
---

Firestore 上の複数の箇所からデータを取得する必要がある場合、取得を一括に行うことができます。

```js
const [queryData, loading, error, fn] = useQuery(querySchema));
```

| Hooks     | 説明                                                                                                                                                      |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| queryData | Firestore から取得したドキュメント/コレクションの内容です。                                                                                               |
| loading   | データを取得しているかどうかを表します。                                                                                                                  |
| error     | データ取得の際にエラーが発生した場合エラー内容が入力されます。<br>初期値には`null`が代入されています。                                                    |
| fn        | `fn.reload` で Get で取得したドキュメント/コレクションを再読込、<br>`fn.unsubscribe` で リッスンしているドキュメント/コレクションのリッスンを中断します。 |

# Example

```js
const querySchema = {
  queries: {
    newYork: {
      location: "/cities/NewYork",
    },
    adams: {
      location: "/users",
    },
  },
};

const [queryData, loading, error, queryData] = useQuery(querySchema);
```

`queryData` には次のような内容が代入されます。

```json
{
    "newYork": {
        "data": {
            "country": "United States",
            "name": "New York",
            "population": 19354922,
        },
        "id": "NewYork"
    },
    "adams": [
        {
            "data": {
                "age": 22,
                "gender": "man",
                "name": "James Adams"
            },
            "id": "Adams"
        },
        {
            "data": {
                "age": 19,
                "gender": "female",
                "name": "Mary Baker"
            },
            "id": "Baker"
        },
        {
            "data": {
                "age": 25,
                "gender": "male",
                "name": "John Clark"
            },
            "id": "Clark"
        },
        {
            "data": {
                "age": 28,
                "gender": "female",
                "name": "Patricia Davis"
            },
            "id": "Davis"
        }
    ]
},
```
