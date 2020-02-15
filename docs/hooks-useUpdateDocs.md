---
id: hooks-useUpdateDocs
title: useUpdateDocs（ドキュメントの一括更新）
---

Firestore 上のドキュメントのデータを更新するのに用います。

```js
const [setFn, writing, called, error] = useUpdateDocs(fql, options);
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

- **fql**: `{[key: string]: SetFql}`

  ドキュメントに書き込む内容を宣言的に示すオブジェクトです。<br>
  `key` は Firestore 上の ドキュメント / コレクション のパスを表しています。

  書き込む内容を Hooks を使う時点で確定させる[`StaticSetFql`](misc-type.md#staticsetfql)を用いたり、<br>
  書き込む内容を `setFn` を呼び出す時点で確定させる[`DynamicSetFql`](misc-type.md#dynamicsetfql)を用いることができます.<br>
  具体的な違いについては `useSetDoc` の [Example](hooks-useSetDoc#example)を参照してください。

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
      population: 40000000,
    },
  },
  "/users/adams": {
    fields: {
      age: 23,
    },
  },
};
const [setFn, writing, called, error] = useSetDocs(fql);
```

更新前の Firestore が次のようになっているとします。

```
├── cities
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

次を実行することでデータが更新されます。

```js
setTokyo();
```

更新後の Firestore は次のようになります。

```
├── cities
│   └── Tokyo
│       ├── country: "Japan"
│       ├── name: "Tokyo"
│       └── population: 40000000
└── users
    └── adams
        ├── age: 23
        ├── gender: "man"
        └── name: "James Adams"
```
