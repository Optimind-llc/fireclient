---
id: hooks-useLazyGetDoc
title: useLazyGetDoc（ドキュメントの遅延取得）
---

`useGetDoc` に近い Hooks ですが、大きな違いとして `useLazyGetDoc` は関数を実行して初めてデータの取得を行います。

```js
[docData, loading, error, reloadFn] = useLazyGetDoc(path, option);
```

| Hooks   | 説明                                                                                                    |
| ------- | ------------------------------------------------------------------------------------------------------- |
| docData | Firestore から取得した Doc の内容であり、<br>初期値には `{ data: null, id: null }` が代入されています。 |
| loading | データを取得しているかどうかを表します。                                                                |
| error   | データ取得の際にエラーが発生した場合エラー内容が入力されます。<br>初期値には`null`が代入されています。  |
| loadFn  | データを取得するための関数です。                                                                        |

| option         | 説明                                                                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| callback       | データを取得する際に実行される関数を指定することができます。                                                                  |
| acceptOutdated | Fireclient では Subscribe 済み Doc を取得する際にキャッシュを利用しますが、<br>その機能を Get 済み Doc の取得にも適応します。 |

注意：Firestore 上のパスは `/Collection/Doc/Collection/Doc/...` となっていることに注意してください。

もし Collection を取得する場合は、代わりに `useLazyGetCollection` を使用してください。

# Example

```js
[cityData, loading, error, loadFn] = useLazyGetDoc("/cities/NewYork");
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
