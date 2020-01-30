---
id: hooks-useLazyGetCollection
title: useLazyGetCollection（コレクションの遅延取得）
---

`useGetCollection` に近い Hooks ですが、大きな違いとして `useLazyGetCollection` は関数を実行して初めてデータの取得を行います。

```js
const [collectionData, loading, error, loadFn] = useLazyGetCollection(path, option);
```

| Hooks          | 説明                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| collectionData | Firestore から取得したドキュメントの内容であり、<br>初期値には `[]` が代入されています。               |
| loading        | データを取得しているかどうかを表します。                                                               |
| error          | データ取得の際にエラーが発生した場合エラー内容が入力されます。<br>初期値には`null`が代入されています。 |
| loadFn         | データを取得するための関数です。                                                                       |

| option | 説明                                                                                                              |
| ------ | ----------------------------------------------------------------------------------------------------------------- |
| where  | 条件を付けてコレクションを取得することができます。                                                                |
| limit  | 取得するコレクションの数を制限することができます。                                                                |
| order  | コレクションをソートした状態で取得します。<br>`limit` と組み合わせることで、上位 n 個を取得ということができます。 |
| cursor | 取得するコレクションの開始地点・終了地点を指定します。                                                            |

| option         | 説明                                                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| callback       | データを取得する際に実行される関数を指定することができます。                                                                                |
| acceptOutdated | Fireclient では Subscribe 済みドキュメントを取得する際にキャッシュを利用しますが、<br>その機能を Get 済みドキュメントの取得にも適応します。 |

注意：Firestore 上のパスは `/Collection/Doc/Collection/Doc/...` となっていることに注意してください。

もしドキュメントを取得する場合は、代わりに `useLazyGetDoc` を使用してください。

# Example

```js
const [citiesData, loading, error, loadFn] = useLazyGetCollection("/cities");
```

次を実行することで初めてデータが取得されます。

```js
loadFn();
```

`citiesData` には次のような内容が代入されます。

```js
[
  {
    data: {
      country: "Mexico",
      name: "Mexico City",
      population: 19028000,
    },
    id: "MexicoCity",
  },
  {
    data: {
      country: "India",
      name: "Mumbai",
      population: 18978000,
    },
    id: "Mumbai",
  },
  {
    data: {
      country: "United States",
      name: "New York",
      population: 19354922,
      users: ["Baker", "Davis"],
    },
    id: "NewYork",
  },
  {
    data: {
      country: "Brazil",
      name: "São Paulo",
      population: 18845000,
    },
    id: "SaoPaulo",
  },
  {
    data: {
      country: "Japan",
      name: "Tokyo",
      population: 35676000,
    },
    id: "Tokyo",
  },
];
```
