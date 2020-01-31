---
id: options-useQuery
title: useQueryでの使用
---

クエリオプションを `useQuery` で試してみましょう。
`useQuery` では取得するドキュメントやコレクションを GetFQL に定義していました。

```js
const getFql = {
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
const getFql = {
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

この GetFQL を `useQuery` に渡してみましょう。

```js
const [queryData, loading, error, queryData] = useQuery(getFql);
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
  adams: [
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
};
```

他にも `where`, `limit`, `order`, `cursor` などを `options` として指定することができます。
それぞれの内容については[概要](options-overview.md)を参照してください。

```js
const getFql = {
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
