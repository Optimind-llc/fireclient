---
id: hooks-useDeleteDoc
title: useDeleteDoc（ドキュメントの削除）
---

Firestore 上のドキュメントを削除するのに用います。

```js
const [deleteFn, deleting, called, error] = useDeleteDoc(path, options);
```

### Hooks の戻り値

- **deleteFn**: `() => void`

  ドキュメントを削除するための関数です。

- **deleting**: `boolean`

  ドキュメントを削除しているかを表します。

- **called**: `boolean`

  `deleteFn` が呼び出されたかどうかを表します。

- **error**: `Error`

  データ書き込みの際にエラーが発生した場合エラー内容が入力されます。初期値には`null`が代入されています。

### Hooks の引数

- **path**: `string`

  書き込み対象のドキュメントの Firestore 上のパスです。

- <span class="highlight">optional</span> **options**: `object`

  データを取得する際のオプションです。

### options の内容

- <span class="highlight">optional</span> **callback**: `() => void`

  データを削除する際に実行される関数を指定することができます。

- <span class="highlight">optional</span> **saveToState**: `boolean`

  データを取得する際に、取得したデータをキャッシュに保存するかどうかを指定することができます。

# Example

```js
const [deleteAdams, deleting, called, error] = useDeleteDoc("/users/Adams");
```

次を実行することでドキュメントを削除できます。

```js
deleteAdams();
```

### View でのステータス表示

`deleting`と`called`を組み合わせることで、削除に関するステータスを表現することができます。

```js
return (
  <>
    {!called && <div>Before call deleteFn</div>}
    {deleting && <div>Deleting...</div>}
    {error !== null && <div>Error</div>}
    {!deleting && called && error === null && <div>Completed</div>}
  </>
);
```
