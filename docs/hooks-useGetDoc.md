---
id: hooks-useGetDoc
title: useGetDoc（ドキュメントの取得）
---

Fireclient の中で最もベーシックな Hooks であり、Firestore 上のドキュメントを取得するのに用います。

React Hooks と同様に、各変数は任意の命名を与えることができます。

```js
const [docData, loading, error, reloadFn] = useGetDoc(path, options);
```

### Hooks の戻り値

- **docData**: [`DocData`](misc-type.md#docdata)

  Firestore から取得したドキュメントの内容であり、<br>初期値には `{ data: null, id: null }` が代入されています。

- **loading**: `boolean`

  データを取得しているかを表します。

- **error**: `Error`

  データ取得の際にエラーが発生した場合エラー内容が入力されます。<br>初期値には`null`が代入されています。

- **reloadFn**: `() => void`

  データを再取得するための関数です。

### Hooks の引数

- **path**: `string`

  取得対象のドキュメントの Firestore 上のパスです。

- <span class="highlight">optional</span> **options**: `object`

  データを取得する際のオプションです。

### options の内容

- <span class="highlight">optional</span> **callback**: `(`[`DocData`](misc-type.md#docdata)`) => void`

  データを取得する際に実行される関数を指定することができます。

- <span class="highlight">optional</span> **acceptOutdated**: `boolean`

  Fireclient ではリッスンしているドキュメントを取得する際にキャッシュを利用しますが、その機能を過去に取得したドキュメントの再取得にも適応するかを指定できます。

> 注意：Firestore 上のパスは `/Collection/Doc/Collection/Doc/...` となっていることに注意してください。
> もしコレクションを取得する場合は、代わりに [`useGetCollection`](hooks-useGetCollection.md) を使用してください。

# Example

```js
const [cityData, loading, error, reloadFn] = useGetDoc("/cities/NewYork");
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

次を実行することでデータの再取得を行えます。

```js
reloadFn();
```
