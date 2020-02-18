---
id: concept
title: 3原則
---

Fireclient では優れたパフォーマンス、DX（developer experience）を実現するために以下の原則に従って設計されています。

**1. 宣言的なクエリ記法（declative query）**

**2. ステートの再利用性（reusability of data）**

**3. 安全かつシンプルなデータ操作（Safe yet simple data manipulation）**

## 1. 宣言的なクエリ記法

Fireclient ではクエリを宣言的に定義することを重視しています。複数のドキュメントを React component のマウント時に取得する場合を例に取って説明します。

<!--DOCUSAURUS_CODE_TABS-->
<!--Fireclient + React-->

```js
import React from "react";
import { useQuery } from "react-fireclient";

const query = {
  queries: {
    city: {
      location: "/cities/tokyo",
    },
    user: {
      location: "/users/taro",
    },
  },
};

function Profile() {
  const [{ city, user }, loading] = useQuery(query);
  return (
    <>
      {loading && <div>{city.data.name}在住</div>}
      {loading && <div>{user.data.name}</div>}
    </>
  );
}

export default Profile;
```

<!--Firebase + React-->

```js
import React, { useState, useEffect } from "react";
import { db } from ".";

function Profile() {
  const [tokyoCity, setTokyoCity] = useState(null);
  const [user, setUser] = useState(null);
  useEffect(() => {
    db.doc("cities/tokyo")
      .get()
      .then(doc => setTokyoCity(doc.data()));
    db.doc("users/taro")
      .get()
      .then(doc => setUser(doc.data()));
  }, []);
  return (
    <>
      {tokyoCity && <div>{tokyoCity.name}在住</div>}
      {user && <div>{user.name}</div>}
    </>
  );
}

export default Profile;
```

<!--END_DOCUSAURUS_CODE_TABS-->

このように Fireclient を用いるとドキュメントを取得する際のロジックを宣言的に記述することが可能になり、view からロジックを切り離すことが可能になります。

## 2. ステートの再利用性

Fireclient では無駄なデータの取得を極力減らすように設計されています。

例えば、あるコンポーネントでリッスン（サブスクライブ）しているデータを、別のコンポーネントで取得しようとしたとします。この場合、リッスンされているデータは最新のものであることが分かっているにも関わらず、再度同じデータをサーバーから取得するのは無駄であると言えます。
このような場合、Fireclient ではリッスンされているデータをそのまま、データを取得しようとした別のコンポーネントに渡すことでサーバーとの無駄な通信をなくしています。

> note
> 厳密にはこの機能は Firebase.js 側にも存在しますが、リッスンされているコレクションに含まれるドキュメントの取得など、対応されていない部分があります。

また、取得するデータの更新頻度が高くないと分かっている場合、`useGetDoc` や `useGetCollection` などではオプションで `{ acceptOutdated: true }` を指定することで、保存されたキャッシュを利用してネットワークアクセスを減らすことができます。

## 3. 安全かつシンプルなデータ操作

Fireclient が提供する安全かつシンプルなデータ操作について、React Redux と比較しながら見ていきましょう。
React Redux は非常に安全な状態管理用のライブラリです。Redux Saga や Redux Thunk などのミドルウェアを用いることで非同期処理も行うことができます。安全である一方で記述量が多くなりがちで、Firestore SDK 自体が提供しているデータへのシンプルなアクセスが失われていると感じていました。
そこで Fireclient は Firestore 由来の state を安全に管理しつつ、View からは直感的かつ最小限のコード量でデータを取得する目的で開発されました。

<!-- Firestore から city というドキュメントを取得する処理を例にとって見てみましょう。
React Redux を使用した場合

```js
// index.js
function View() {
  const { city } =
  return <div>{city.name}</div>;
}
``` -->
