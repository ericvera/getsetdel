# getsetdel

**Key-value store implemented on top of IndexedDB with a small metadata layer to support store management.**

[![github license](https://img.shields.io/github/license/ericvera/getsetdel.svg?style=flat-square)](https://github.com/ericvera/getsetdel/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/getsetdel.svg?style=flat-square)](https://npmjs.org/package/getsetdel)

Features:

- Multiple named key-value stores
- Built on top of IndexedDB (using [idb-keyval](https://www.npmjs.com/package/idb-keyval))
- Keep track of created stores including a schema version and tags
- Auto-clear data on version or tag changes
- Support for custom store metadata
- Query inventory of stores by name or tags

## Design

GetSetVal is a key-value store with an small inventory layer on top of it.

It choses clearing the store and hydrating it from scratch over dealing with complex data migrations. This is enabled by the inventory layer which keeps track of details that would invalidate the data (data/schema version or tags) as well as custom metadata that you may need (e.g. last sync timestamp) to keep the data up to date.

### Storage Inventory Information

When creating a store (via `createStore`), you can provide an optional `version` (which can be used to keep track of schema changes) and an optional array `tags` (e.g. 'public', 'private' data). At the same time we keep track of `creation` which contains the time when the current instance of the store was created.

### Data Invalidation

Instead of dealing with data migrations, we just get rid of all the data and start over. This happens in two ways:

1. **During store creation (i.e. `createStore`):** At this time, if the data is invalidated, it is simply cleared (all data removed and inventory entry removed including all metadata).
2. **During calls to all data access/modification methods (e.g. `get`, `set`, `del`, `entries`, etc.):** At this time, if the data is invalidated, it will throw a `GetSetValResetError` exception which you can handle by clearing your state and starting over from `createStore`.

### Alternatives

If you would like to manage all your stores yourself or if you only need a single store, I suggest you use [idb-keyval](https://www.npmjs.com/package/idb-keyval) instead of this. If you need more complex IndexedDB functionality, idb-keyval suggests [IDB](https://www.npmjs.com/package/idb).

## Usage

### Creating (initializing) a store

```typescript
import { createStore } from 'getsetval'

// Option 1. Minimum required options
// This will result in an IndexedDB databased named
// 'getsetval-storename' with a store called 'store'
const storeToken = await createStore({
  name: 'store-name',
})

// Option 2. Store with all the options (name is the only
// required prop)
// This will result in an IndexedDB databased named
// 'getsetval-all-options-store--0001' with a store called 'store'
const allOptionsStoreToken = await createStore({
  name: 'all-options-store',
  // In case you want to store data about a specific entity (this
  // is behind the scenes just added to the IndexedDB name)
  key: '0001',
  // Data is cleared whenever createStore is called with different
  // values on the following:
  tags: ['private', 'other'],
  version: 1,
})
```

### Accessing/deleting data

```typescript
import { createStore, del, set } from 'getsetval'

const storeToken = await createStore({
  name: 'store-name',
})

// To add data you can use set or setMany
await set(storeToken, 'key1', { some: 'data', here: true })

// To get data you can use get, getMany (retrieve many keys
// at once), or entries (returns key-value pairs for all
// the entries in the store)
const key1Value = await get(storeToken, 'key1')
console.log(key1Value)

// To remove the data you can use del, delMany, or clear
// to fully remove the data and the store entry in the
// inventory.
await del(storeToken, 'key1')
```

### Metadata

```typescript
// Get the metadata
const metadata = await getMetadata(storeToken)

// Set the metadata (This is a full overwrite and not
// a merge)
await setMetadata(storeToken, {
  ...metadata,
  lastSync: Date.now(),
})
```

### Reset handling

GetSetVal provides a helper method to manage `GetSetValResetError`.

```typescript
const onStoreError = async () => {
  // Do what you need to reset the state of your code and
  // re-initialize the store by calling `createStore`
}

// Here is the `version`, `creation` timestamp, or `tags` have
// change, `onStoreError` is called. In the case of any other
// the exception is re-thrown.
await set(storeToken, 'key', { data: 'hello' }).handleResetError(onStoreError)
```

### Query Inventory

You can query the inventory by `name` or `tags`.

Example 1. Clear all the data tagged as `private` when a user logs out.

```typescript
const privateStoreTokens = await queryInventory({
  includesAnyTag: ['private'],
})

await Promise.all(privateStoreTokens.map((token) => clear(token)))
```

Example 2. For clearing multiple stores called `todo-items` with `key` that matches project ids (e.g. `{ name: 'todo-items', key: 'projectid0001'}` and `{ name: 'todo-items', key: 'projectid0002'}`).

```typescript
const privateStoreTokens = await queryInventory({
  name: 'todo-items',
})

await Promise.all(privateStoreTokens.map((token) => clear(token)))
```

# API Reference

See [docs](docs/README.md)
