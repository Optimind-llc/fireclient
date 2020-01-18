---
id: hooks-useSubscribeCollection
title: useSubscribeCollection（コレクションの監視）
---

この Hooks を使用することで、Firestore 上の Collection をリッスンすることができます。

Collection をリッスンすることで、Firestore 側で Collection の内容が書き換えられた場合データが自動で再取得され、
データを常に最新の状態に保つことができます。

```js
[collectionData, loading, error, unsubscribeFn] = useSubscribeCollection(path, option);
```

| Hooks          | 説明                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| collectionData | Firestore から取得した Doc の内容であり、<br>初期値には `[]` が代入されています。                      |
| loading        | データを取得しているかどうかを表します。                                                               |
| error          | データ取得の際にエラーが発生した場合エラー内容が入力されます。<br>初期値には`null`が代入されています。 |
| loadFn         | Doc のリッスンを中断するための関数です。                                                               |

| option | 説明                                                                                                             |
| ------ | ---------------------------------------------------------------------------------------------------------------- |
| where  | 条件を付けて Collection を取得することができます。                                                               |
| limit  | 取得する Collection の数を制限することができます。                                                               |
| order  | Collection をソートした状態で取得します。<br>`limit` と組み合わせることで、上位 n 個を取得ということができます。 |
| cursor | 取得する Collection の開始地点・終了地点を指定します。                                                           |

| option   | 説明                                                         |
| -------- | ------------------------------------------------------------ |
| callback | データを取得する際に実行される関数を指定することができます。 |

注意：Firestore 上のパスは `/Collection/Doc/Collection/Doc/...` となっていることに注意してください。

もし Doc を取得する場合は、代わりに `useSubscribeDoc` を使用してください。

# Example

```js
[citiesData, loading, error, unsubscribeFn] = useSubscribeCollection("/cities");
```

`citiesData` には次のような内容が代入されます。

```js
[
  {
    name: "New York",
    population: 19354922,
    country: "United States",
  },
  {
    name: "São Paulo",
    population: 18845000,
    country: "Brazil",
  },
  {
    name: "Tokyo",
    population: 35676000,
    country: "Japan",
  },
  {
    name: "Mumbai",
    population: 18978000,
    country: "India",
  },
  {
    name: "Mexico City",
    population: 19028000,
    country: "Mexico",
  },
];
```

次を実行することで Collection のリッスンを中断できます。

```js
unsubscribeFn();
```