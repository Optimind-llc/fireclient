---
id: hooks-useSubscribeDoc
title: useSubscribeDoc（ドキュメントの監視）
---

この Hooks を使用することで、Firestore 上の Doc をリッスンすることができます。

Doc をリッスンすることで、Firestore 側で Doc の内容が書き換えられた場合データが自動で再取得され、
データを常に最新の状態に保つことができます。

```js
[docData, loading, error, unsubscribeFn] = useSubscribeDoc(path, option);
```

| Hooks         | 説明                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| docData       | Firestore から取得した Doc の内容であり、<br>初期値には `{ data: null, id: null }` が代入されています。 |
| loading       | データを取得しているかどうかを表します。                                                                |
| error         | データ取得の際にエラーが発生した場合エラー内容が入力されます。<br>初期値には`null`が代入されています。  |
| unsubscribeFn | Doc のリッスンを中断するための関数です。                                                                |

| option   | 説明                                                         |
| -------- | ------------------------------------------------------------ |
| callback | データを取得する際に実行される関数を指定することができます。 |

注意：Firestore 上のパスは `/Collection/Doc/Collection/Doc/...` となっていることに注意してください。

もし Collection を取得する場合は、代わりに `useSubscribeCollection` を使用してください。

# Example

```js
[cityData, loading, error, unsubscribeFn] = useSubscribeDoc("/cities/NewYork");
```

`cityData` には次のような内容が代入されます。

```js
{
  "name": "New York",
  "population": 19354922,
  "country": "United States"
}
```

次を実行することで Doc のリッスンを中断できます。

```js
unsubscribeFn();
```
