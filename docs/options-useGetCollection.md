---
id: options-useGetCollection
title: コレクションの取得での使用
---

クエリオプションを `useGetCollection` で試してみましょう。

条件などを `options` として定義します。次の例ではコレクションを `population` 順で並べて上から 2 つを取得する、ということを表しています。

```js
const options = {
  limit: 2,
  order: {
    by: "population",
  },
};
```

この `options` を `useGetCollection` の引数に渡すことで、`options` の内容が適応されます。

```js
[
  {
    data: {
      country: "Brazil",
      name: "São Paulo",
      population: 18845000,
    },
    id: "SaoPaulo",
  },
  {
    data: {
      country: "India",
      name: "Mumbai",
      population: 18978000,
    },
    id: "Mumbai",
  },
];
```

他にも `where`, `limit`, `order`, `cursor` などを `options` として指定することができます。
それぞれの内容については[概要](options-overview.md)を参照してください。

```js
const options = {
    where: { ... },
    limit: 100,
    order: { ... },
    cursor: { ... }
}
```
