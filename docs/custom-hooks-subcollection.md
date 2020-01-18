---
id: custom-hooks-subcollection
title: 作成例：サブコレクションの参照
---

この例では、サブコレクションの内容を取得するための Hooks を作成します。

サブコレクションについて見てみましょう。
例えば Firestore が次のような構造になっているとします。

![](assets/subcollection-cities.png)
![](assets/subcollection-users.png)

```json
{
  "cities": {
    "NewYork": {
      "country": "United States",
      "name": "New York",
      "population": 19354922,
      "users": ["Baker", "Davis"]
    }
  },
  "users": {
    "Adams": { "name": "James Adams", "age": 22 },
    "Baker": { "name": "Mary Baker", "age": 19 },
    "Clark": { "name": "John Clark", "age": 25 },
    "Davis": { "name": "Patricia Davis", "age": 28 }
  }
}
```

サブコレクションの参照では、`NewYork`の`users`に含まれるユーザーの Doc を取得します。
つまり、上記の例では次のような内容を取得します。

```json
[
  { "name": "Baker", "age": 20 },
  { "name": "Davis", "age": 26 }
]
```
