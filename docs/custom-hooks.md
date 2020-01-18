---
id: custom-hooks
title: カスタムHooksの作成
---

書くこと

- カスタム Hooks にするメリット
  - 同じコードを減らすことでメンテナンスを簡単にする → less bug
    - Reducer/Saga でのコードと比較
  - 埋め込まれていた非同期処理がなくなること → 全体のコードの見通しが良くなる
  - データベースや使用頻度に合わせた最適な処理を作ることができる → 更新されないとわかっている部分に関しては`acceptOutdated=true`でクエリ回数を減らすなど
- カスタム Hooks を作る際によく使う Function の紹介
  - useGetDoc
  - useGetCollection
  - useQuery
  - useArrayQuery
