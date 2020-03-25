---
id: hooks-useLazyGetCollection
title: useLazyGetCollection（コレクションの遅延取得）
---

`useGetCollection` に近い Hooks ですが、大きな違いとして `useLazyGetCollection` は関数を実行して初めてデータの取得を行います。

```js
const [collectionData, loading, error, loadFn] = useLazyGetCollection(path, options);
```

### Hooks の戻り値

- **collectionData**: [`CollectionData`](misc-type.md#collectiondata)

  Firestore から取得したコレクションの内容であり、<br>初期値には `[]` が代入されています。

- **loading**: `boolean`

  データを取得しているかを表します。

- **error**: `Error`

  データ取得の際にエラーが発生した場合エラー内容が入力されます。<br>初期値には`null`が代入されています。

- **loadFn**: `() => void`

  データを取得するための関数です。

### Hooks の引数

- **path**: `string`

  取得対象のコレクションの Firestore 上のパスです。

- <span class="highlight">optional</span> **options**: `object`

  データを取得する際のオプションです。

### options の内容

- <span class="highlight">optional</span> **callback**: `(DocData) => void`

  データを取得する際に実行される関数を指定することができます。

- <span class="highlight">optional</span> **acceptOutdated**: `boolean`

  Fireclient ではリッスンしているコレクションを取得する際にキャッシュを利用しますが、その機能を過去に取得したコレクションの再取得にも適応します。

- <span class="highlight">optional</span> **saveToState**: `boolean`

  データを取得する際に、取得したデータをキャッシュに保存するかどうかを指定することができます。

- <span class="highlight">optional</span> **where**: [`Where`](options-overview.md#where)

  条件を付けてコレクションを取得することができます。

- <span class="highlight">optional</span> **limit**: [`Limit`](options-overview.md#limit)

  取得するコレクションの数を制限することができます。

- <span class="highlight">optional</span> **order**: [`Order`](options-overview.md#order)

  コレクションをソートした状態で取得します。`limit` と組み合わせることで、上位 n 個を取得ということができます。

- <span class="highlight">optional</span> **cursor**: [`Cursor`](options-overview.md#cursor)

  取得するコレクションの開始地点・終了地点を指定します。

> 注意：Firestore 上のパスは `/Collection/Doc/Collection/Doc/...` となっていることに注意してください。
> もしドキュメントを取得する場合は、代わりに [`useLazyGetDoc`](hooks-useLazyGetDoc.md) を使用してください。

# Example

```js
const [citiesData, loading, error, loadFn] = useLazyGetCollection("/cities");
```

次を実行することで初めてデータが取得されます。

```js
loadFn();
```

`citiesData` には次のような内容が代入されます。

```js
[
  {
    data: {
      country: "Mexico",
      name: "Mexico City",
      population: 19028000,
    },
    id: "MexicoCity",
  },
  {
    data: {
      country: "India",
      name: "Mumbai",
      population: 18978000,
    },
    id: "Mumbai",
  },
  {
    data: {
      country: "United States",
      name: "New York",
      population: 19354922,
      users: ["Baker", "Davis"],
    },
    id: "NewYork",
  },
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
      country: "Japan",
      name: "Tokyo",
      population: 35676000,
    },
    id: "Tokyo",
  },
];
```
