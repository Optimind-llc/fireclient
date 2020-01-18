---
id: hooks-usePaginateCollection
title: usePaginateCollection（ページネーションを用いたコレクション取得）
---

この Hooks を使用することで、Firestore 上の Collection を使ったページ切り替えを簡単に行うことができます。

`useGetCollection`などとは異なり、この Hooks には `order` と `limit` を持った `option` が必須になっています。

```js
[collectionData, loading, error, prevHandler, nextHandler] = usePaginateCollection(path, option);
```

| Hooks          | 説明                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| collectionData | Firestore から取得した Doc の内容であり、<br>初期値には `[]` が代入されています。                                   |
| loading        | データを取得しているかどうかを表します。                                                                            |
| error          | データ取得の際にエラーが発生した場合エラー内容が入力されます。<br>初期値には`null`が代入されています。              |
| prevHandler    | 前のページへ戻るための関数`prevHandler.fn`と<br>前のページが存在するかどうかを表す`prevHandler.enabled`を持ちます。 |
| nextHandler    | 次のページへ戻るための関数`nextHandler.fn`と<br>次のページが存在するかどうかを表す`nextHandler.enabled`を持ちます。 |

| option         | 説明                                                                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| acceptOutdated | Fireclient では Subscribe 済み Doc を取得する際にキャッシュを利用しますが、<br>その機能を Get 済み Doc の取得にも適応します。 |

# Example

```js
const option = {
  order: {
    by: "population",
  },
  limit: 2,
};
const [cities, loading, error, prevHandler, nextHandler] = usePaginateCollection("/cities", option);
```

次を実行することでページの切り替えを行えます。

```js
// 次のページに進む
nextHandler.fn();
// 前のページに戻る
prevHandler.fn();
```

`.enabled` でページ移動できるかを確認できるので、

例えばページ移動のボタン部分は次のようにして実装することができます。

```js
<button disabled={!prevHandler.enabled} onClick={prevHandler.fn}>
prev
</button>
<button disabled={!nextHandler.enabled} onClick={nextHandler.fn}>
next
</button>
```
