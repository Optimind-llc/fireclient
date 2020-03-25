---
id: hooks-useLazyGetDoc
title: useLazyGetDoc（ドキュメントの遅延取得）
---

`useGetDoc` に近い Hooks ですが、大きな違いとして `useLazyGetDoc` は関数を実行して初めてデータの取得を行います。

```js
const [docData, loading, error, loadFn] = useLazyGetDoc(path, options);
```

### Hooks の戻り値

- **docData**: [`DocData`](misc-type.md#docdata)

  Firestore から取得したドキュメントの内容であり、<br>初期値には `{ data: null, id: null }` が代入されています。

- **loading**: `boolean`

  データを取得しているかを表します。

- **error**: `Error`

  データ取得の際にエラーが発生した場合エラー内容が入力されます。<br>初期値には`null`が代入されています。

- **loadFn**: `() => void`

  データを取得するための関数です。

### Hooks の引数

- **path**: `string`

  取得対象のドキュメントの Firestore 上のパスです。

- <span class="highlight">optional</span> **options**: `object`

  データを取得する際のオプションです。

### options の内容

- <span class="highlight">optional</span> **callback**: `(DocData) => void`

  データを取得する際に実行される関数を指定することができます。

- <span class="highlight">optional</span> **acceptOutdated**: `boolean`

  Fireclient ではリッスンしているドキュメントを取得する際にキャッシュを利用しますが、その機能を過去に取得したドキュメントの再取得にも適応します。

- <span class="highlight">optional</span> **saveToState**: `boolean`

  データを取得する際に、取得したデータをキャッシュに保存するかどうかを指定することができます。

> 注意：Firestore 上のパスは `/Collection/Doc/Collection/Doc/...` となっていることに注意してください。
> もしコレクションを取得する場合は、代わりに [`useLazyGetCollection`](hooks-useLazyGetCollection.md) を使用してください。

# Example

```js
const [cityData, loading, error, loadFn] = useLazyGetDoc("/cities/NewYork");
```

次を実行することで初めてデータが取得されます。

```js
loadFn();
```

`cityData` には次のような内容が代入されます。

```js
{
  data: {
    "name": "New York",
    "population": 19354922,
    "country": "United States"
  },
  id: "NewYork"
}
```
