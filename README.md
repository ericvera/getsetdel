# getsetdel

**Key-value store implemented on top of IndexedDB with a small metadata layer to support store management.**

[![github license](https://img.shields.io/github/license/ericvera/getsetdel.svg?style=flat-square)](https://github.com/ericvera/getsetdel/blob/main/LICENSE)
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
- 🧪 **Testing Included**: Ships an in-memory backend (`getsetdel/testing/idb-keyval`) and a mock factory (`getsetdel/testing`), so no `fake-indexeddb` is needed

## Requirements

- Node.js >= 24
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

// Automatically handle reset errors. `handleResetError(onReset)` returns an
// error handler you pass to `.catch`.
await set(storeToken, 'key', 'value').catch(handleResetError(onStoreReset))
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

#### `setMany<T>(token: GetSetDelStoreToken, entries: [string, T][]): Promise<void>`

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

#### `queryInventory(query?: GetSetDelInventoryQuery): Promise<GetSetDelStoreToken[]>`

Queries the store inventory to find stores matching the criteria. Omitted properties are not used to filter, so an empty query returns every store.

**Parameters:**

- `query.name` (string, optional): Exact name match
- `query.includesAnyTag` (string[], optional): Stores containing **any** of these tags
- `query.includesAllTags` (string[], optional): Stores containing **all** of these tags

#### `GetSetDelInventoryQuery`

The type of `queryInventory`'s parameter. Every property is optional.

- `name` (string, optional): Selects stores whose name matches exactly
- `includesAnyTag` (string[], optional): Selects stores tagged with at least one of these tags
- `includesAllTags` (string[], optional): Selects stores tagged with every one of these tags

### Error Handling

#### `handleResetError(onReset: () => Promise<void>): (error: unknown) => Promise<void>`

Returns an error handler (for use with `.catch`) that calls `onReset` when the error is a `GetSetDelResetError`, and rethrows any other error.

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

## Testing

Code that stores through getsetdel cannot be unit tested without an IndexedDB, and a hand-written fake of the store tends to drift away from the real API — which means it hides the bugs it was written to catch. getsetdel ships the two pieces you need instead:

- **`getsetdel/testing/idb-keyval`** — an in-memory stand-in for `idb-keyval`, the backend getsetdel stores through. You do not need `fake-indexeddb`.
- **`getsetdel/testing`** — `createGetSetDelMock`, a factory that wraps the real getsetdel module so every member still works, and adds a handful of switches for the failures you cannot provoke from the outside.

They are used together but they are separate imports and they live in different places: the backend goes in your test setup file, the factory in a `__mocks__` shim at your project root. The examples below use Vitest.

### Substituting the backend

```typescript
// vitest.setup.ts
import { testClearMockIndexedDB } from 'getsetdel/testing/idb-keyval'
import { beforeEach, vi } from 'vitest'

// `idb-keyval` is getsetdel's dependency, not yours — mocking it here swaps out
// the storage backend underneath getsetdel while getsetdel itself stays real.
vi.mock('idb-keyval', async () => import('getsetdel/testing/idb-keyval'))

beforeEach(() => {
  testClearMockIndexedDB()
})
```

The setup file is not enough on its own. Vitest externalizes packages that come from `node_modules`, so getsetdel's own `import 'idb-keyval'` would resolve natively and never see the mock above — your first `createStore` would fail with `ReferenceError: indexedDB is not defined` from inside `node_modules/idb-keyval`. Inlining getsetdel is what routes its `idb-keyval` import through your module mocks:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],

    // getsetdel must be inlined so its own `idb-keyval` import goes through the
    // mock in the setup file instead of loading the real one from node_modules.
    server: {
      deps: {
        inline: ['getsetdel'],
      },
    },
  },
})
```

Mocking a transitive dependency looks surprising in a setup file, but that is the point: your code under test keeps calling the real `createStore`, `set`, and `get`, and only the bytes underneath are in memory.

Do not skip the `beforeEach`. The backend holds its data in module scope, so without `testClearMockIndexedDB()` whatever one test case writes is still there for the next one. `testGetMockIndexedDBData()` is also available and returns a snapshot of everything stored, which is handy for a single assertion over the whole database.

### Sharing one mock per test file

The shim goes in a `__mocks__` directory at your project root, next to `node_modules` — not next to the test that uses it. Vitest resolves `__mocks__` for a bare package specifier from the project root, so a shim placed anywhere else is silently ignored: `vi.mock('getsetdel')` falls back to automocking the package, and the test fails on a confusing assertion instead of a wiring error.

```typescript
// __mocks__/getsetdel/index.ts
import { createGetSetDelMock } from 'getsetdel/testing'
import { vi } from 'vitest'

const mock = createGetSetDelMock(
  await vi.importActual<typeof import('getsetdel')>('getsetdel'),
)

export const {
  // getsetdel's own surface, delegating to the real implementation
  clear,
  createStore,
  del,
  delMany,
  entries,
  get,
  getMany,
  getMeta,
  GetSetDelResetError,
  handleResetError,
  keys,
  queryInventory,
  set,
  setMany,
  setMeta,

  // the test controls
  failEntriesWith,
  clearEntriesFault,
  stubStore,
  simulateStoreReset,
  resetGetSetDelMock,
} = mock
```

The factory is called once, at module scope, and that single call is what makes the shim work. Fault state is private to each `createGetSetDelMock` call, so one call per module means every importer in a test file — your test, and the code it is testing — shares the same set of switches. Call the factory inside a test or a helper instead and each caller gets its own switches, so arming a fault in the test would have no effect on the subject.

A bare `vi.mock('getsetdel')` in the test file is what activates the shim:

```typescript
// src/dataCache.test.ts
import { createStore, set } from 'getsetdel'
import { beforeEach, expect, it, vi } from 'vitest'
import {
  failEntriesWith,
  resetGetSetDelMock,
} from '../__mocks__/getsetdel/index.js'
import { loadAll } from './dataCache.js'

// Picks up __mocks__/getsetdel/ at the project root
vi.mock('getsetdel')

beforeEach(() => {
  resetGetSetDelMock()
})

it('falls back to the network when the cached read fails', async () => {
  const token = await createStore({ name: 'data-cache', version: 1 })
  await set(token, 'a', 1)

  failEntriesWith(new Error('read failed'))

  await expect(loadAll(token)).resolves.toEqual({ source: 'network' })
})
```

### The controls

- **`failEntriesWith(error)`** — makes every subsequent `entries` call reject with exactly this value, identity and type preserved. Any value works, including one that is falsy or is not an `Error`. Only `entries` sees it; every other member behaves as it would with nothing armed. Reach for it when you want a read to blow up while the rest of the store keeps working.
- **`clearEntriesFault()`** — disarms that fault and changes nothing else. Use it when the case under test is supposed to recover partway through.
- **`stubStore()`** — takes the store out of play for all 13 store-touching members: `createStore` resolves to a placeholder token, `entries`/`keys`/`queryInventory` resolve `[]`, `get`/`getMeta` resolve `undefined`, `getMany` resolves an array of `undefined` matching the key count, and the writes no-op. Only `resetGetSetDelMock()` disarms it.
- **`await simulateStoreReset(token)`** — wipes that store the way another browser tab would. Afterwards every reset-guarded member called with the token throws a genuine `GetSetDelResetError`, raised by getsetdel's own store-state check rather than by a stub. This is the one asynchronous control — it returns a promise, where the other four are synchronous and return `void`, so it has to be awaited. Drop the `await` and the reset has not landed by the time the next call runs: a read comes back empty instead of throwing, and the case passes for the wrong reason.
- **`resetGetSetDelMock()`** — disarms the fault and the stub, returning the mock to full delegation. Put it in a `beforeEach`. It does not undo a simulated reset or restore data; clearing data is `testClearMockIndexedDB()`'s job.

The read fault and store stubbing are deliberately two controls rather than one, because tests want them in different combinations. A test whose subject recovers mid-case wants the fault cleared with the store still stubbed; a test with no fake timers wants the fault without giving up the real store. Stubbing earns its keep when you are driving a retry loop under fake timers — a cache that retries a reset with exponential backoff calls `createStore` on every attempt, and faulting only the read would leave it reopening a real store each time around. Every stubbed result settles on the microtask queue, so a fake-timer loop is never left waiting on a real event-loop turn.

When more than one control is armed, they resolve in a strict order: **fault > stub > reset**. An armed read fault wins over stubbing, and stubbing wins over a simulated reset, so an error you asked for is never masked by one you did not.

### Values come back as plain data

Anything written to a store is structured-cloned, which means prototypes and methods do not survive the round trip. A value with behavior on it has to be revived on read:

```typescript
await set(token, 'lastSync', Timestamp.now())

const stored = await get<{ seconds: number; nanoseconds: number }>(
  token,
  'lastSync',
)

// stored is a plain object, not a Timestamp — stored.toDate() does not exist
const lastSync = stored
  ? new Timestamp(stored.seconds, stored.nanoseconds)
  : undefined
```

This is what a real IndexedDB does, and the in-memory backend reproduces it on purpose. Backing the tests with a plain `Map` would hand your methods back and let this class of bug reach production unseen — which is exactly why getsetdel ships a faithful backend rather than a trivial one.

### Backend boundaries

The in-memory backend covers the whole `idb-keyval` surface, with three edges worth knowing before you meet them at runtime:

- **Keys are strings.** A non-string key rejects with a message naming the backend. getsetdel only ever uses string keys.
- **`promisifyRequest` and an invoked `UseStore` handle exist for type compatibility only.** They are there so the module is assignable to `typeof import('idb-keyval')`, and they throw if you actually call them.
- **One store name per database.** Asking for a second store name inside a database that already exists throws immediately. Real `idb-keyval` does not support this either — its `createStore` opens with `indexedDB.open(dbName)` and no version, so `onupgradeneeded` never fires for a database that already exists and the second object store is never created; the handle you get back fails at first use with a `NotFoundError`. The backend only differs in failing sooner and more clearly. Give each store its own database name instead.

## Alternatives

If you would like to manage all your stores yourself or if you only need a single store, consider using [idb-keyval](https://www.npmjs.com/package/idb-keyval) instead. For more complex IndexedDB functionality, idb-keyval suggests [IDB](https://www.npmjs.com/package/idb).

## License

MIT License - see the LICENSE file for details.
