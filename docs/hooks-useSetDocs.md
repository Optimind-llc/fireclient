---
id: hooks-useSetDocs
title: useSetDocs（ドキュメントの一括書き込み）
---

Firestore 上のドキュメントにデータを書き込むのに用います。

```js
const [setFn, writing, called, error] = useSetDoc(path, query, options);
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

  書き込み対象のドキュメントの Firestore 上のパスです。

- **query**: [`SetFql`](misc-type.md#setfql)

  ドキュメントに書き込む内容を宣言的に示すオブジェクトです。
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
const fql = {
  "/cities/Tokyo": {
    fields: {
      country: "Japan",
      population: 35676000,
    },
  },
  "/users/adams": {
    fields: {
      age: 22,
      gender: "man",
      name: "James Adams",
    },
  },
};
const [setFn, writing, called, error] = useSetDocs(fql);
```

更新前の Firestore が次のようになっているとします。

```
─── cities
    ├── MexicoCity
    │   ├── country: "Mexico"
    │   ├── name: "Mexico City"
    │   └── population: 19028000
    └── NewYork
        ├── country: "United States"
        ├── name: "New York"
        └── population: 19354922
```

次を実行することでデータが更新されます。

```js
setTokyo();
```

更新後の Firestore は次のようになります。

```
├── cities
│   ├── MexicoCity
│   │   ├── country: "Mexico"
│   │   ├── name: "Mexico City"
│   │   └── population: 19028000
│   ├── NewYork
│   │   ├── country: "United States"
│   │   ├── name: "New York"
│   │   └── population: 19354922
│   └── Tokyo
│       ├── country: "Japan"
│       ├── name: "Tokyo"
│       └── population: 35676000
└── users
    └── adams
        ├── age: 22
        ├── gender: "man"
        └── name: "James Adams"
```
