---
id: hooks-useGetDoc
title: useGetDoc（ドキュメントの取得）
---

Fireclient の中で最もベーシックな Hooks であり、Firestore 上の Doc を取得するのに用います。

React Hooks と同様に、各変数は任意の命名を与えることができます。

```js
[docData, loading, error, reloadFn] = useGetDoc(docPath, option);
```

| Hooks    | 説明                                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------------- |
| docData  | Firestore から取得した Doc の内容であり、<br>初期値には `{ data: null, id: null }` が代入されています。 |
| loading  | データを取得しているかどうかを表します。                                                                |
| error    | データ取得の際にエラーが発生した場合エラー内容が入力されます。<br>初期値には`null`が代入されています。  |
| reloadFn | データを再取得するための関数です。                                                                      |

| option         | 説明                                                                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| callback       | データを取得する際に実行される関数を指定することができます。                                                                  |
| acceptOutdated | Fireclient では Subscribe 済み Doc を取得する際にキャッシュを利用しますが、<br>その機能を Get 済み Doc の取得にも適応します。 |

注意：Firestore 上のパスは `/Collection/Doc/Collection/Doc/...` となっていることに注意してください。

もし Collection を取得する場合は、代わりに `useGetCollection` を使用してください。

# Example

```js
[cityData, loading, error, reloadFn] = useGetDoc("/cities/NewYork");
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
