---
id: option-useQuery
title: useQueryでの使用
---

クエリオプションを `useQuery` で試してみましょう。
`useQuery` では取得する Doc や Collection をクエリスキーマに定義していました。

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
```

この中に次のようにしてクエリオプションを定義することができます。

```js
const querySchema = {
  queries: {
    newYork: {
      location: "/cities/NewYork",
    },
    adams: {
      location: "/users",
      where: {
        field: "age",
        operator: ">",
        value: 20,
      },
    },
  },
};
```

このクエリスキーマを `useQuery` に渡してみましょう。

```js
[queryData, loading, error, queryData] = useQuery(querySchema);
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

他にも `where`, `limit`, `order`, `cursor` などを `option` として指定することができます。
それぞれの内容については[概要](option-overview.md)を参照してください。

```js
const querySchema = {
  queries: {
    adams: {
      location: "/users",
      where: { ... },
      limit: 100,
      order: { ... },
      cursor: { ... }
    },
  },
};
```
