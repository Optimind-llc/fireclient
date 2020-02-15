---
id: misc-type
title: 型定義
---

# DocData

Fireclient で Firestore 上のドキュメントを取得した際の型であり、`useGetDoc` や `useSubscribeDoc` などで取得したデータは全てこの型になります。

### 型 : `object`

### プロパティ

- **data**: `{[field: string]: any}`

  取得したドキュメントの内容です。

- **id**: `string`

  取得したドキュメントの Firestore 上でのドキュメント ID です。<br>
  例えば、`/cities/Tokyo` に存在するドキュメントを取得した場合、`Tokyo` が **id** となります。

### 例

```js
{
  data: {
    name: "New York",
    population: 19354922,
    country: "United States",
  },
  id: "NewYork",
};
```

# CollectionData

Fireclient で Firestore 上のコレクションを取得した際の型であり、`useGetCollection` や `useSubscribeCollection` などで取得したデータは全てこの型になります。

### 型 : [`DocData`](misc-type.md#docdata)`[]`

### 例

```js
[
  {
    data: {
      name: "New York",
      population: 19354922,
      country: "United States",
    },
    id: "NewYork",
  },
  {
    data: {
      country: "Japan",
      name: "Tokyo",
      population: 35676000,
    },
    id: "Tokyo",
  },
];
```

# Query

特定のドキュメントやコレクションを取得するためのクエリです。

### 型 : `object`

### プロパティ

- **location**: `string`

  取得するドキュメント / コレクションの Firestore 上でのパスを指定します。

- <span class="highlight">optional</span>　**connects**: `boolean`

  ドキュメント / コレクション をリッスンするかどうかを指定することができます。

- <span class="highlight">optional</span>　**acceptOutdated**: `boolean`

  Fireclient ではリッスンしているドキュメントを取得する際にキャッシュを利用しますが、その機能を過去に取得したドキュメントの再取得にも適応するかを指定できます。

- <span class="highlight">optional</span>　**callback**: <code>([StaticSetFql](misc-type.md#staticsetfql) | [DynamicSetFql](misc-type.md#dynamicsetfql)) => void</code>

データを取得する際に実行される関数を指定することができます。

- <span class="highlight">optional</span>　**where**: [`Where`](options-overview.md#where)

  条件を付けてコレクションを取得することができます。

- <span class="highlight">optional</span>　**limit**: [`Limit`](options-overview.md#limit)

  取得するコレクションの数を制限することができます。

- <span class="highlight">optional</span>　**order**: [`Order`](options-overview.md#order)

  コレクションをソートした状態で取得します。`limit` と組み合わせることで、上位 n 個を取得ということができます。

- <span class="highlight">optional</span>　**cursor**: [`Cursor`](options-overview.md#cursor)

  取得するコレクションの開始地点・終了地点を指定します。

### 例

```js
{
  location: "/cities/NewYork",
  connects: true,
  acceptOutdated: true,
  callback: () => { ... },
  where: { ... },
  limit: 15,
  order: { ... },
  cursor: { ... }
};
```

# ObjectQuery

Firestore 上の複数の ドキュメント / コレクション を取得するためのクエリです。
`key` には自由に名前を指定することができ、`useQuery` ではこの `key` を保持した状態でデータが取得されます。

### 型 : `{[key: string]:`[`Query`](misc-type.md#query)`}`

### 例

```js
{
  newYork: {
    location: "/cities/NewYork",
  },
  tokyo: {
    location: "/cities/Tokyo",
    acceptOutdated: true
  }
}
```

# ArrayQuery

Firestore 上の複数の ドキュメント / コレクション を取得するためのクエリです。
`ObjectQuery` とは異なり、配列で指定することができます。

### 型 : [`Query`](misc-type.md#query)`[]`

### 例

```js
[
  {
    location: "/cities/NewYork",
  },
  {
    location: "/cities/Tokyo",
    acceptOutdated: true,
  },
];
```

# GetFql`<QueryType>`

`useQuery` や `useArrayQuery` などに渡すための FQL です。

### 型 : `object`

### プロパティ

- **queries**: `QueryType`

  Firestore 上の複数の ドキュメント / コレクション を取得するクエリを指定します。<br>
  `useQuery` では `ObjectQuery` 、`useArrayQuery` では `ArrayQuery` を指定します。

- <span class="highlight">optional</span>　**connects**: `boolean`

  ドキュメント / コレクション をリッスンするかどうかを指定することができます。

これは `queries` 全体に反映されますが、[`Query`](misc-type.md#query) 側にも指定されていた場合 [`Query`](misc-type.md#query) 側の値が優先されます。

- <span class="highlight">optional</span>　**acceptOutdated**: `boolean`

  Fireclient ではリッスンしているコレクションを取得する際にキャッシュを利用しますが、その機能を過去に取得したコレクションの再取得にも適応します。

  これは `queries` 全体に反映されますが、クエリ側にも指定されていた場合クエリ側の値が優先されます。

- <span class="highlight">optional</span>　**callback**: `() => void`

  全てのクエリを取得した際に実行される関数を指定することができます。

### 例

```js
{
  queries: {
    newYork: {
      location: "/cities/NewYork",
    },
    users: {
      location: "/users",
    },
  },
};
```

# SetFql

`useSetDoc`, `useUpdateDoc` などで書き込む内容を指定するためのクエリです。<br>
`StaticSetFql` は指定する時点で内容が決定しており、`DynamicSetFql` は書き込む関数を実行する時点で内容が決定します。

### 型 : <code>[StaticSetFql](misc-type.md#staticsetfql) |[DynamicSetFql](misc-type.md#dynamicsetfql)</code>

# StaticSetFql

### 型 : `object`

### プロパティ

- <span class="highlight">optional</span> **fields**: `{[field: string]: any}`

  書き込むドキュメントの内容をオブジェクトで指定します。

- <span class="highlight">optional</span> **subCollection**: `{[key: string]: StaticSetFql[]}`

  ドキュメントのサブコレクションを指定します。
  `key` でサブコレクション名を指定し、配列でサブコレクションに含まれるドキュメントを指定します。
  この時、指定するドキュメントに `id` が含まれていない場合はランダムなドキュメント ID が割り振られます。

- <span class="highlight">optional</span> **id**: `string`

  サブコレクションのドキュメントを指定する際、これを指定することでドキュメント ID を決めることができます。

### 例

```js
{
  fields: {
    country: "Japan",
    name: "Tokyo",
    population: 35676000,
  },
  subCollection: {
    users: [
      //  "/cities/Tokyo/users/adams"
      {
        id: "adams",
        fields: {
          name: "James Adams",
        },
      },
      //  "/cities/Tokyo/users/(Random ID)"
      {
        fields: {
          name: "guest",
        },
      },
    ],
  },
};
```

# DynamicSetFql

`StaticSetFql` とは異なり、書き込み関数に渡す引数を受け取って書き込み内容を確定させることができます。

### 型 : `(...args: any[]) => StaticSetFql`

### 例

```js
(tokyoPopulation) => ({
  fields: {
    country: "Japan",
    name: "Tokyo",
    population: tokyoPopulation,
  }),
}
```

# SetCollectionFql

### 型 : `SetFql[]`

### 例

```js
[
  (newPopulation, newWeather) => ({
    fields: {
      country: "Japan",
      name: "Tokyo",
      population: newPopulation,
      weather: newWeather,
    },
  }),
  {
    fields: {
      country: "United States",
      name: "New York",
      population: 19354922,
    },
  },
];
```
