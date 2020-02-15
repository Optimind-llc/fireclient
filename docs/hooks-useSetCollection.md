---
id: hooks-useSetCollection
title: useSetCollection（コレクションの書き込み）
---

Firestore 上のドキュメントにデータを書き込むのに用います。

```js
const [setFn, writing, called, error] = useSetCollection(path, fql, options);
```

### Hooks の戻り値

- **setFn**: `(...args: any[]) => void`

  データを書き込むための関数です。

- **writing**: `boolean`

  データを書き込んでいるかを表します。

- **called**: `boolean`

  `setFn` が呼び出されたかどうかを表します。

- **error**: `Error`

  データ書き込みの際にエラーが発生した場合エラー内容が入力されます。初期値には`null`が代入されています。

### Hooks の引数

- **path**: `string`

  書き込み対象のコレクションの Firestore 上のパスです。

- **fql**: [`SetCollectionFql`](misc-type.md#setcollectionfql)

  コレクションに書き込む内容を宣言的に示すオブジェクトです。
  書き込む内容を Hooks を使う時点で確定させる[`StaticSetFql`](misc-type.md#staticsetfql)を用いたり、
  書き込む内容を `setFn` を呼び出す時点で確定させる[`DynamicSetFql`](misc-type.md#dynamicsetfql)を用いることができます.

* <span class="highlight">optional</span> **options**: `object`

  データを取得する際のオプションです。

### options の内容

- <span class="highlight">optional</span> **merge**: `boolean`

  書き込み時に、ドキュメントの既存のフィールドを上書きするかを指定します。

- <span class="highlight">optional</span> **mergeFields**: `string[]`

  書き込み時に、ドキュメントのどのフィールドを上書き対象にするかを指定します。

- <span class="highlight">optional</span> **callback**: `() => void`

  データを書き込む際に実行される関数を指定することができます。

# Example

```js
const fql = [
  {
    id: "NewYork",
    fields: {
      country: "United States",
      name: "New York",
      population: 19354922
    },
  },
  arg => ({
    id: "Tokyo"
    fields: {
      country: "Japan",
      name: "Tokyo",
      population: 35676000,
      argValue: arg
    },
  }),
];
const [setTokyo, writing, called, error] = useSetCollection("/cities", fql);
```

次を実行することでデータが追加されます。

```js
setTokyo(123);
```

書き込み結果は次のようになります。

```
─── cities
    ├── NewYork
    │   ├── country: "United States"
    │   ├── name: "New York"
    │   └── population: 19354922
    └── Tokyo
        ├── country: "Japan"
        ├── name: "Tokyo"
        ├── population: 35676000
        └── argValue: 123
```
