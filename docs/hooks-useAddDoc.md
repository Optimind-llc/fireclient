---
id: hooks-useAddDoc
title: useAddDoc（ドキュメントの追加）
---

Firestore 内に新しいドキュメントを追加するのに用います。

```js
const [setFn, writing, called, error] = useAddDoc(path, setFql);
```

### Hooks の戻り値

- **setFn**: `(...args: any[]) => void`

  データを書き込むための関数です。

- **writing**: `boolean`

  データを書き込んでいるかを表します。

- **called**: `boolean`

  `setFn` が呼ばれたかを表します。

- **error**: `any`

  データ書き込みの際にエラーが発生した場合エラー内容が入力されます。初期値には`null`が代入されています。

### Hooks の引数

- **path**: `string`

  追加対象のドキュメント / コレクションの Firestore 上のパスです。

  コレクションのパスを渡すと、ドキュメントの ID はランダムに決められます。

- **query**: [`SetFql`](misc-type.md#setfql)

  ドキュメントに書き込む内容を宣言的に示すオブジェクトです。

  書き込む内容を Hooks を使う時点で確定させる[`StaticSetFql`](misc-type.md#staticsetfql)を用いたり、

  書き込む内容を `setFn` を呼び出す時点で確定させる[`DynamicSetFql`](misc-type.md#dynamicsetfql)を用いることができます.

  具体的な違いについては `useSetDoc` の [Example](hooks-useSetDoc#example)を参照してください。

* _`optional`_ **options**: `object`

  データを取得する際のオプションです。

### options の内容

- _`optional`_ **callback**: `() => void`

  データを書き込む際に実行される関数を指定することができます。

# Example

### ドキュメントのパスを渡す場合

```js
const fql = {
  fields: {
    country: "Japan",
    name: "Tokyo",
    population: 35676000,
  },
};
const [setTokyo, writing, called, error] = useSetDoc("/cities/Tokyo", fql);
```

次を実行することでデータが追加されます。

```js
setTokyo();
```

書き込み結果は次のようになります。

```
─── cities
    └── Tokyo
        ├── country: "Japan"
        ├── name: "Tokyo"
        └── population: 35676000
```

### コレクションのパスを渡す場合

```js
const fql = {
  fields: {
    country: "Japan",
    name: "Tokyo",
    population: 35676000,
  },
};
const [setTokyo, writing, called, error] = useSetDoc("/cities", fql);
```

次を実行することでデータが追加されます。

```js
setTokyo();
```

書き込み結果は次のようになります。

```
─── cities
    └── kmgPSVMTCbDBUUm4efB1
        ├── country: "Japan"
        ├── name: "Tokyo"
        └── population: 35676000
```
