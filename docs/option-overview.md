---
id: option-overview
title: 概要
---

`useGetCollection` や `useQuery` などで Collection を取得する際に、フィルタリングやソートなどを行うことができます。

# Where

Doc のフィールドの内容から Collection をフィルタリングします。
次の例では `population` が `15000000` よりも大きい Doc のみを取得します。

```js
where: {
    field: "population",
    operator: ">",
    value: 15000000
}
```

# Limit

取得する Doc の数を指定します。
次の例では Doc を 100 個取得します。

```js
limit: 100;
```

# Order

クエリする際の Doc の並び順を指定します。
次の例では、`population` で降順にソートしています。
また、`limit` と組み合わせることで上位 n 個のような取得をすることも可能です。

```js
order: {
    by: "population",
    direction: "desc"
}
```

# Cursor

クエリの開始ポイントや終了ポイントを指定します。
次の例では`order` と組み合わせて使用することで、`population` が `15000000` 以上である Doc を取得します。

```js
cursor: {
    origin: 15000000,
    direction: "startAt"
}
```
