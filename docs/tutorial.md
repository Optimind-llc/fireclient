---
id: tutorial
title: チュートリアル
---

# Doc を取得する

Doc を取得するには `useGetDoc` を使用します。
`useGetDoc`については[クイックスタート](quick-start.md)でも用いられているので、合わせてご覧ください。

```js
const [tokyo, loading, error] = useGetDoc("/cities/Tokyo");
```

取得が完了すると、`tokyo`には次のようなオブジェクトが入っています。

```json
{
  "country": "Japan",
  "name": "Tokyo",
  "population": 35676000
}
```

これらの内容をコンポーネントに描写してみましょう。
読み込み中かどうかは`loading`を用いて確認することができます。

```jsx
return <>東京の人口：{loading ? "読み込み中..." : data.population}</>;
```

読み込み完了前

```
東京の人口：読み込み中...
```

読み込み完了後

```
東京の人口：35676000
```

# Collection を取得する

Collection を取得するには `useGetCollection` を使用します。

```js
const [cities, loading, error] = useGetCollection("/cities");
```

`useGetDoc`とは異なり、Collection の取得結果は配列になっています。

```json
[
  {
    "country": "Mexico",
    "name": "Mexico City",
    "population": 19028000
  },
  {
    "country": "India",
    "name": "Mumbai",
    "population": 18978000
  },
  {
    "country": "United States",
    "name": "New York",
    "population": 19354922
  },
  {
    "country": "Brazil",
    "name": "São Paulo",
    "population": 18845000
  },
  {
    "country": "Japan",
    "name": "Tokyo",
    "population": 35676000
  }
]
```

コンポーネントに描写してみましょう。

```jsx
return (
  <>
    {loading
      ? "読み込み中..."
      : cities.map(city => (
          <div>
            {city.name}：{city.population}
          </div>
        ))}
  </>
);
```

読み込み完了前

```
読み込み中...
```

読み込み完了後

```
Mexico City：19028000
Mumbai：18978000
New York：19354922
São Paulo：18845000
Tokyo：35676000
```

## Collection を ID 付きで取得する

`useGetCollection`にオプションを渡すことで、Doc を ID と共に取得できます。

```js
const option = {
  acceptOutdated: true;
};
const [cities, loading, error] = useGetCollection("/cities", option);
```

取得が完了すると、`cities`には次のようなオブジェクトが入っています。

```json
[
  {
    "data": {
      "country": "Mexico",
      "name": "Mexico City",
      "population": 19028000
    },
    "id": "MexicoCity"
  },
  {
    "data": {
      "country": "India",
      "name": "Mumbai",
      "population": 18978000
    },
    "id": "Mumbai"
  },
  {
    "data": {
      "country": "United States",
      "name": "New York",
      "population": 19354922
    },
    "id": "NewYork"
  },
  {
    "data": {
      "country": "Brazil",
      "name": "São Paulo",
      "population": 18845000
    },
    "id": "SaoPaulo"
  },
  {
    "data": {
      "country": "Japan",
      "name": "Tokyo",
      "population": 35676000
    },
    "id": "Tokyo"
  }
]
```

## Collection を条件付きで取得する

`useGetCollection`には`where`や`order`などの条件を付けることができます。

```js
const option = {
  where: {
    field: "population",
    operator: ">",
    value: 19000000,
  },
};
const [cities, loading, error] = useGetCollection("/cities", option);
```

取得が完了すると、`cities`には次のようなオブジェクトが入っています。

```json
[
  {
    "country": "Mexico",
    "name": "Mexico City",
    "population": 19028000
  },
  {
    "country": "United States",
    "name": "New York",
    "population": 19354922
  },
  {
    "country": "Japan",
    "name": "Tokyo",
    "population": 35676000
  }
]
```

また、条件は複数付けることもできます。

```js
const option = {
  where: [
    {
      field: "population",
      operator: ">",
      value: 19000000,
    },
    {
      field: "population",
      operator: "<",
      value: 20000000,
    },
  ],
};
const [cities, loading, error] = useGetCollection("/cities", option);
```

取得が完了すると、`cities`には次のようなオブジェクトが入っています。

```json
[
  {
    "country": "Mexico",
    "name": "Mexico City",
    "population": 19028000
  },
  {
    "country": "United States",
    "name": "New York",
    "population": 19354922
  }
]
```

その他のオプションについては[こちら](option-overview.md)にて紹介しています。

# Doc のリアルタイムアップデートを取得する

`useSubscribeDoc`を使用することで、Doc の変化を検出して、自動で値を取得することができます。

```js
const [tokyo, loading, error, unsubscribeFn] = useSubscribeDoc("/citie/tokyo");
```

リッスンする必要がなくなったら、
`unsubscribeFn()`を実行することで、リッスンを中断することができます。

# Collection のリアルタイムアップデートを取得する

Doc の場合と同様に、
`useSubscribeCollection`を使用することで自動で値を取得することができます。

```js
const [cities, loading, error, unsubscribeFn] = useSubscribeCollection("/cities");
```

リッスンする必要がなくなったら、
`unsubscribeFn()`を実行することで、リッスンを中断することができます。

# Firestore 上の複数箇所から値を取得する

ひとつのページで、Firestore 上の複数箇所からデータを取ってくる必要があることがあります。
そのような場合、`useQuery`を使用することを推奨します。

`useQuery`では、どの Doc や Collection をどのような条件で取得するのかをスキーマに定義します。

下記の例では `users`, `projects`, `tokyo` をそれぞれ別の箇所から取得しています。

```js
const querySchema = {
  connects: true,
  queries: {
    users: {
      location: "/users",
      connects: false,
    },
    projects: {
      location: "/projects",
      where: {
        field: "calculated",
        operator: "==",
        value: true,
      },
      order: {
        by: "updatedAt",
      },
    },
    tokyo: {
      location: "/cities/tokyo",
    },
  },
};
```

```js
const [queryData, loading, error] = useQuery(querySchema);
const { users, projects, tokyo } = queryData;
```

取得した`users`, `projects`, `tokyo`は次のようになります。

```
// users
[
  {
    "age": 25,
    "gender": "male",
    "name": "John Clark",
    "region": "CA"
  },
  {
    "age": 19,
    "gender": "female",
    "name": "Mary Baker",
    "region": "UK"
  },
  {
    "age": 22,
    "gender": "man",
    "name": "James Adams ",
    "region": "US"
  },
  {
    "age": 28,
    "gender": "female",
    "name": "Patricia Davis",
    "region": "US"
  }
]

// projects
[
  {
    "calculated": true,
    "createdAt": { "seconds": 1577425800, "nanoseconds": 0 },
    "updatedAt": { "seconds": 1577599500, "nanoseconds": 0 }
  }
]

// tokyo
{
  "country": "Japan",
  "name": "Tokyo",
  "population": 35676000
}
```
