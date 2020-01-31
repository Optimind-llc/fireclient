---
id: hooks-useSubscribeDoc
title: useSubscribeDoc（ドキュメントの監視）
---

この Hooks を使用することで、Firestore 上のドキュメントをリッスンすることができます。

Doc をリッスンすることで、Firestore 側でドキュメントの内容が書き換えられた場合データが自動で再取得され、
データを常に最新の状態に保つことができます。

```js
const [docData, loading, error, unsubscribeFn] = useSubscribeDoc(path, options);
```

### Hooks の戻り値

- **docData**: [`DocData`](misc-type.md#docdata)

  Firestore から取得したドキュメントの内容であり、<br>初期値には `{ data: null, id: null }` が代入されています。

- **loading**: `boolean`

  データを取得しているかを表します。

- **error**: `any`

  データ取得の際にエラーが発生した場合エラー内容が入力されます。<br>初期値には`null`が代入されています。

- **unsubscribeFn**: `() => void`

  ドキュメントのリッスンを中断するための関数です。

### Hooks の引数

- **path**: `string`

  監視対象のドキュメントの Firestore 上のパスです。

- _`optional`_ **options**: `object`

  データを取得する際のオプションです。

### options の内容

- _`optional`_ **callback**: `(DocData) => void`

  データを取得する際に実行される関数を指定することができます。

> 注意：Firestore 上のパスは `/Collection/Doc/Collection/Doc/...` となっていることに注意してください。
> もしコレクションを取得する場合は、代わりに [`useSubscribeCollection`](hooks-useSubscribeCollection.md) を使用してください。

# Example

```js
const [cityData, loading, error, unsubscribeFn] = useSubscribeDoc("/cities/NewYork");
```

`cityData` には次のような内容が代入されます。

```js
{
  "name": "New York",
  "population": 19354922,
  "country": "United States"
}
```

次を実行することでドキュメントのリッスンを中断できます。

```js
unsubscribeFn();
```
