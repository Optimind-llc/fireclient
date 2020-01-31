---
id: misc-type
title: タイプ
---

# DocData

### 型 : `object`

### プロパティ

- **data**: `{[field: string]: any}`
- **id**: `string`

# CollectionData

### 型 : `DocData[]`

# Query

### 型 : `object`

### プロパティ

- **location**: `string`
- **connects**: `boolean`
- **acceptOutdated**: `boolean`
- **callback**: `() => void`
- **where**: [`Where`](options-overview.md#where)
- **limit**: [`Limit`](options-overview.md#limit)
- **order**: [`Order`](options-overview.md#order)
- **cursor**: [`Cursor`](options-overview.md#cursor)

# ObjectQuery

### 型 : `{[key: string]: Query}`

# ArrayQuery

### 型 : `Query[]`

# GetFql`<QueryType>`

### 型 : `object`

### プロパティ

- **queries**: `QueryType`
- **loading**: `boolean`
- **error**: `any`
- **loadFn**: `() => void`

# SetFql

### 型 : `StaticSetFql | DynamicSetFql`

# StaticSetFql

### 型 : `object`

### プロパティ

- _`optional`_ **id**: `string`
- _`optional`_ **fields**: `{[field: string]: any}`
- _`optional`_ **subCollection**: `{[key: string]: StaticSetFql[]}`

# DynamicSetFql

### 型 : `(...args: any[]) => StaticSetFql`
