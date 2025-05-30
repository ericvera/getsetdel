# getsetdel

**Key-value store implemented on top of IndexedDB with a small metadata layer to support store management.**

[![github license](https://img.shields.io/github/license/ericvera/getsetdel.svg?style=flat-square)](https://github.com/ericvera/getsetdel/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/getsetdel.svg?style=flat-square)](https://npmjs.org/package/getsetdel)

## Features

- 🗂️ **Multiple Named Stores**: Create and manage multiple isolated key-value stores
- 🔄 **Auto-Reset on Changes**: Automatically clear data when version or tags change
- 🏷️ **Tagging System**: Organize stores with tags for easy querying and management
- 📊 **Store Inventory**: Built-in inventory system to track all stores and metadata
- 🔍 **Query Support**: Find stores by name or tags
- 💾 **Metadata Support**: Store custom metadata alongside your data
- ⚡ **IndexedDB Powered**: Built on top of [idb-keyval](https://www.npmjs.com/package/idb-keyval) for performance
- 🔒 **Type-Safe**: Written in TypeScript with full type definitions
- 🪶 **Lightweight**: Minimal overhead with a small API surface

## Requirements

- Node.js >= 20
- Modern browser with IndexedDB support

## Installation

```bash
npm install getsetdel
# or
yarn add getsetdel
# or
pnpm add getsetdel
```

## Design Philosophy

GetSetDel is a key-value store with a small inventory layer on top of it. It chooses clearing the store and hydrating it from scratch over dealing with complex data migrations. This is enabled by the inventory layer which keeps track of details that would invalidate the data (data/schema version or tags) as well as custom metadata that you may need (e.g. last sync timestamp) to keep the data up to date.

### Data Invalidation

Instead of dealing with data migrations, we just get rid of all the data and start over. This happens in two ways:

1. **During store creation (`createStore`)**: If the data is invalidated, it is simply cleared (all data removed and inventory entry removed including all metadata).
2. **During data access/modification**: If the data is invalidated, it will throw a `GetSetDelResetError` exception which you can handle by clearing your state and starting over from `createStore`.

## Basic Usage

### Creating a Store

```typescript
import { createStore } from 'getsetdel'

// Minimum required options
const storeToken = await createStore({
  name: 'my-store',
})

// Store with all options
const storeToken = await createStore({
  name: 'user-data',
  key: 'user-123', // Optional: for entity-specific stores
  version: 1, // Optional: schema version
  tags: ['private', 'user'], // Optional: for categorization
})
```

### Storing and Retrieving Data

```typescript
import { createStore, set, get, del } from 'getsetdel'

const storeToken = await createStore({
  name: 'app-data',
})

// Store data
await set(storeToken, 'user-preferences', { theme: 'dark', language: 'en' })

// Retrieve data
const preferences = await get(storeToken, 'user-preferences')
console.log(preferences) // { theme: 'dark', language: 'en' }

// Delete data
await del(storeToken, 'user-preferences')
```

### Working with Multiple Keys

```typescript
// Store multiple key-value pairs at once
await setMany(storeToken, [
  ['key1', 'value1'],
  ['key2', { complex: 'object' }],
  ['key3', [1, 2, 3]],
])

// Retrieve multiple keys at once
const values = await getMany(storeToken, ['key1', 'key2'])
console.log(values) // ['value1', { complex: 'object' }]

// Get all entries in the store
const allEntries = await entries(storeToken)
console.log(allEntries) // [['key1', 'value1'], ['key2', { complex: 'object' }], ...]

// Delete multiple keys
await delMany(storeToken, ['key1', 'key2'])
```

### Managing Metadata

```typescript
// Set custom metadata for the store
await setMeta(storeToken, {
  lastSync: Date.now(),
  syncVersion: '2.1',
  customField: 'custom-value',
})

// Retrieve metadata
const metadata = await getMeta(storeToken)
console.log(metadata.lastSync) // timestamp

// Update metadata (full overwrite)
await setMeta(storeToken, {
  ...metadata,
  lastSync: Date.now(),
})
```

### Error Handling with Reset Detection

```typescript
import { handleResetError } from 'getsetdel'

const onStoreReset = async () => {
  // Clear your application state
  // Re-initialize the store
  const newStoreToken = await createStore({
    name: 'my-store',
    version: 1,
  })
  // Reload your data
}

// Automatically handle reset errors
await handleResetError(() => set(storeToken, 'key', 'value'), onStoreReset)
```

### Querying Store Inventory

```typescript
import { queryInventory, clear } from 'getsetdel'

// Find all stores with specific tags
const privateStores = await queryInventory({
  includesAnyTag: ['private'],
})

// Clear all private data when user logs out
await Promise.all(privateStores.map((token) => clear(token)))

// Find stores by name pattern
const todoStores = await queryInventory({
  name: 'todo-items',
})
```

## API Reference

### Core Functions

#### `createStore(storeInfo: GetSetDelStoreInfo): Promise<GetSetDelStoreToken>`

Creates or initializes a store. If the store exists but has different version/tags, it will be cleared and recreated.

**Parameters:**

- `storeInfo.name` (string, required): Name of the store
- `storeInfo.key` (string, optional): Entity-specific identifier
- `storeInfo.version` (number, optional): Schema version for invalidation
- `storeInfo.tags` (string[], optional): Tags for categorization

**Returns:** Store token for use with other functions

#### `set(token: GetSetDelStoreToken, key: string, value: any): Promise<void>`

Stores a value with the given key.

#### `get<T>(token: GetSetDelStoreToken, key: string): Promise<T | undefined>`

Retrieves a value by key. Returns `undefined` if key doesn't exist.

#### `del(token: GetSetDelStoreToken, key: string): Promise<void>`

Deletes a key-value pair from the store.

#### `clear(token: GetSetDelStoreToken): Promise<void>`

Clears all data from the store and removes it from the inventory.

### Batch Operations

#### `setMany(token: GetSetDelStoreToken, entries: [string, any][]): Promise<void>`

Stores multiple key-value pairs at once.

#### `getMany<T>(token: GetSetDelStoreToken, keys: string[]): Promise<(T | undefined)[]>`

Retrieves multiple values by their keys.

#### `delMany(token: GetSetDelStoreToken, keys: string[]): Promise<void>`

Deletes multiple keys from the store.

### Store Inspection

#### `entries<T>(token: GetSetDelStoreToken): Promise<[string, T][]>`

Returns all key-value pairs in the store.

#### `keys(token: GetSetDelStoreToken): Promise<string[]>`

Returns all keys in the store.

### Metadata Management

#### `setMeta<T>(token: GetSetDelStoreToken, metadata: T): Promise<void>`

Sets custom metadata for the store (full overwrite).

#### `getMeta<T>(token: GetSetDelStoreToken): Promise<T | undefined>`

Retrieves the custom metadata for the store.

### Inventory and Querying

#### `queryInventory(query: { name?: string, includesAnyTag?: string[] }): Promise<GetSetDelStoreToken[]>`

Queries the store inventory to find stores matching the criteria.

**Parameters:**

- `query.name` (string, optional): Exact name match
- `query.includesAnyTag` (string[], optional): Stores containing any of these tags

### Error Handling

#### `handleResetError<T>(operation: () => Promise<T>, onReset: () => Promise<void>): Promise<T>`

Executes an operation and handles `GetSetDelResetError` by calling the reset handler.

#### `GetSetDelResetError`

Exception thrown when store data has been invalidated due to version or tag changes.

## Advanced Examples

### Multi-tenant Application

```typescript
// Create stores for different users
const userStore = await createStore({
  name: 'user-data',
  key: userId,
  version: 1,
  tags: ['private', 'user'],
})

const sharedStore = await createStore({
  name: 'shared-data',
  version: 1,
  tags: ['public', 'shared'],
})
```

### Data Versioning

```typescript
// When you need to change your data schema
const storeToken = await createStore({
  name: 'app-data',
  version: 2, // Increment version to clear old data
})
```

### Cleanup on Logout

```typescript
const cleanup = async () => {
  // Clear all private user data
  const privateStores = await queryInventory({
    includesAnyTag: ['private'],
  })

  await Promise.all(privateStores.map((token) => clear(token)))
}
```

## Alternatives

If you would like to manage all your stores yourself or if you only need a single store, consider using [idb-keyval](https://www.npmjs.com/package/idb-keyval) instead. For more complex IndexedDB functionality, idb-keyval suggests [IDB](https://www.npmjs.com/package/idb).

## License

MIT License - see the LICENSE file for details.
