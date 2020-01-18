---
id: option-useGetCollection
title: コレクションの取得での使用
---

クエリオプションを `useGetCollection` で試してみましょう。

条件などを `option` として定義します。次の例では Collection を `population` 順で並べて上から 2 つを取得する、ということを表しています。

```js
const option = {
  limit: 2,
  order: {
    by: "population",
  },
};
```

この `option` を `useGetCollection` の引数に渡すことで、`option` の内容が適応されます。

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

他にも `where`, `limit`, `order`, `cursor` などを `option` として指定することができます。
それぞれの内容については[概要](option-overview.md)を参照してください。

```js
const option = {
    where: { ... },
    limit: 100,
    order: { ... },
    cursor: { ... }
}
```
