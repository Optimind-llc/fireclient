---
id: hooks-useUpdateDoc
title: useUpdateDoc（ドキュメントの更新）
---

Firestore 上のドキュメントのデータを更新するのに用います。

```js
const [setFn, writing, called, error] = useUpdateDoc(path, fql, options);
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

  更新対象のドキュメントの Firestore 上のパスです。

- **fql**: [`SetFql`](misc-type.md#setfql)

  ドキュメントに書き込む内容を宣言的に示すオブジェクトです。

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
  fields: {
    population: 40000000,
  },
};
const [setTokyo, writing, called, error] = useSetDoc("/cities/Tokyo", fql);
```

更新前の Firestore が次のようになっているとします。

```
─── cities
    └── Tokyo
        ├── country: "Japan"
        ├── name: "Tokyo"
        └── population: 35676000
```

次を実行することでデータが更新されます。

```js
setTokyo();
```

更新後の Firestore は次のようになります。

```
─── cities
    └── Tokyo
        ├── country: "Japan"
        ├── name: "Tokyo"
        └── population: 40000000
```

# `useSetDoc`の`{merge:true}`との違いについて

`useSetDoc`と`useUpdateDoc`はそれぞれ`Firebase.firestore`の`ref.set()`と`ref.update()`に対応しています。

これらの大きな違いとしては、例えばドキュメント内に次のような`map`タイプのフィールドが存在していたとします。

```
─── cities
    └── Tokyo
        ├── country: "Japan"
        └── foo: { a: 0, b: 1 }
```

`foo.a`の内容を`2`に変更する場合、`useSetDoc`では次のように指定する必要があります。

```js
const fql = {
  fields: {
    foo: { a: 2 },
  },
};
const [setFn] = useSetDoc("cities/Tokyo", fql, { merge: true });
```

対して、`useUpdateDoc`では次のように指定することができます。

```js
const fql = {
  fields: {
    "foo.a": 2,
  },
};
const [setFn] = useUpdateDoc("cities/Tokyo", fql);
```

どちらの場合でも、`setFn()`の実行後は次のように書き換えられます。

```
─── cities
    └── Tokyo
        ├── country: "Japan"
        └── foo: { a: 2, b: 1 }
```
