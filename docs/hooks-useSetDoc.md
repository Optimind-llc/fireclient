---
id: hooks-useSetDoc
title: useSetDoc（ドキュメントの書き込み）
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

- **error**: `any`

  データ書き込みの際にエラーが発生した場合エラー内容が入力されます。初期値には`null`が代入されています。

### Hooks の引数

- **path**: `string`

  書き込み対象のドキュメントの Firestore 上のパスです。

- **query**: [`SetFql`](misc-type.md#setfql)

  ドキュメントに書き込む内容を宣言的に示すオブジェクトです。
  書き込む内容を Hooks を使う時点で確定させる[`StaticSetFql`](misc-type.md#staticsetfql)を用いたり、
  書き込む内容を `setFn` を呼び出す時点で確定させる[`DynamicSetFql`](misc-type.md#dynamicsetfql)を用いることができます.

* _`optional`_ **options**: `object`

  データを取得する際のオプションです。

### options の内容

- _`optional`_ **merge**: `boolean`

  書き込み時に、ドキュメントの既存のフィールドを上書きするかを指定します。

- _`optional`_ **mergeFields**: `string[]`

  書き込み時に、ドキュメントのどのフィールドを上書き対象にするかを指定します。

- _`optional`_ **callback**: `() => void`

  データを書き込む際に実行される関数を指定することができます。

# Example

### [`StaticSetFql`](misc-type.md#staticsetfql)を用いる場合

`fql` をオブジェクトで指定します。

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

次を実行することでデータが書き込まれます。

```js
setTokyo();
```

### [`DynamicSetFql`](misc-type.md#dynamicsetfql)を用いる場合

`fql` を関数で指定します。

```js
const fql = (countryName, populationCount) => ({
  fields: {
    country: countryName,
    name: "Tokyo",
    population: populationCount,
  },
});
const [setTokyo, writing, called, error] = useSetDoc("/cities/Tokyo", fql);
```

次を実行することでデータが書き込まれます。

```js
setTokyo("Japan", 35676000);
```

### View でのステータス表示

`writing`と`called`を組み合わせることで、書き込みに関するステータスを表現することができます。

```js
return (
  <>
  {}
  {!writing && called && error === null && }
  </>
)
```
