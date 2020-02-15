---
id: options-overview
title: 概要
---

`useGetCollection` や `useQuery` などでコレクションを取得する際に、フィルタリングやソートなどを行うことができます。

# Where

### 型 : `object`

### プロパティ

- **field**: `string`
- **operator**: [`Firestore.WhereFilterOp`](https://firebase.google.com/docs/reference/node/firebase.firestore.html?hl=ja#wherefilterop)
- **value**: `any`

Doc のフィールドの内容からコレクションをフィルタリングします。
次の例では `population` が `15000000` よりも大きいドキュメントのみを取得します。

```js
where: {
  field: "population",
  operator: ">",
  value: 15000000
}
```

# Limit

### 型 : `number`

取得するドキュメントの数を指定します。
次の例ではドキュメントを 100 個取得します。

```js
limit: 100;
```

# Order

### 型 : `object`

### プロパティ

- **by**: `string`
- <span class="highlight">optional</span> **direction**: `"asc" | "desc"`

クエリする際のドキュメントの並び順を指定します。
次の例では、`population` で降順にソートしています。
また、`limit` と組み合わせることで上位 n 個のような取得をすることも可能です。

```js
order: {
    by: "population",
    direction: "desc"
}
```

# Cursor

### 型 : `object`

### プロパティ

- **origin**: `any`
- **direction**: `"startAt" | "startAfter" | "endAt" | "endBefore"`

クエリの開始ポイントや終了ポイントを指定します。
次の例では`order` と組み合わせて使用することで、`population` が `15000000` 以上であるドキュメントを取得します。

```js
cursor: {
    origin: 15000000,
    direction: "startAt"
}
```
