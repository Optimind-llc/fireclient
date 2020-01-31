---
id: hooks-usePaginateCollection
title: usePaginateCollection（ページネーションを用いたコレクション取得）
---

この Hooks を使用することで、Firestore 上のコレクションを使ったページ切り替えを簡単に行うことができます。

`useGetCollection`などとは異なり、この Hooks には `order` と `limit` を持った `options` が必須になっています。

```js
const [collectionData, loading, error, prevHandler, nextHandler] = usePaginateCollection(
  path,
  options
);
```

### Hooks の戻り値

- **collectionData**: [`CollectionData`](misc-type.md#collectiondata)

  Firestore から取得したコレクションの内容であり、初期値には `[]` が代入されています。

- **loading**: `boolean`

  データを取得しているかを表します。

- **error**: `any`

  データ取得の際にエラーが発生した場合エラー内容が入力されます。初期値には`null`が代入されています。

- **prevHandler**: `{fn: () => void, enabled: boolean}`

  前のページへ戻るための関数`prevHandler.fn`と前のページが存在するかを表す`prevHandler.enabled`を持ちます。

- **nextHandler**: `{fn: () => void, enabled: boolean}`

  前のページへ戻るための関数`nextHandler.fn`と前のページが存在するかを表す`nextHandler.enabled`を持ちます。

### Hooks の引数

- **path**: `string`

  取得対象のコレクションの Firestore 上のパスです。

- _`optional`_ **options**: `object`

  データを取得する際のオプションです。

### options の内容

- **limit**: [`Limit`](options-overview.md#limit)

  取得するコレクションの数を制限することができます。

- **order**: [`Order`](options-overview.md#order)

  コレクションをソートした状態で取得します。`limit` と組み合わせることで、上位 n 個を取得ということができます。

- **cursor**: [`Cursor`](options-overview.md#cursor)

  取得するコレクションの開始地点・終了地点を指定します。

- _`optional`_ **where**: [`Where`](options-overview.md#where)

  条件を付けてコレクションを取得することができます。

- _`optional`_ **acceptOutdated**: `boolean`

  Fireclient ではリッスンしているコレクションを取得する際にキャッシュを利用しますが、その機能を過去に取得したコレクションの再取得にも適応します。

# Example

```js
const options = {
  order: {
    by: "population",
  },
  limit: 2,
};
const [cities, loading, error, prevHandler, nextHandler] = usePaginateCollection(
  "/cities",
  options
);
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
