import type { UseStore } from 'idb-keyval'

export type { UseStore } from 'idb-keyval'

type MemoryStoreData = Record<string, unknown>
type MemoryDatabaseData = Record<string, MemoryStoreData | undefined>
type MemoryIndexedDBData = Record<string, MemoryDatabaseData | undefined>

interface StoreLocation {
  dbName: string
  storeName: string
}

const DiagnosticPrefix = "getsetdel's in-memory idb-keyval backend"

const DefaultDBName = 'keyval-store'
const DefaultStoreName = 'keyval'

/**
 * Every record holding runtime-supplied names — database names, store names,
 * and keys — is created without a prototype. A plain object literal would let
 * `Object.prototype` members leak in: `get('toString')` would resolve the
 * native function, `set('__proto__', value)` would reassign the record's
 * prototype instead of writing a key, and a database named `__proto__` would
 * look like it already existed.
 */
const createRecord = <T>(): Record<string, T> =>
  Object.create(null) as Record<string, T>

let data: MemoryIndexedDBData = createRecord()

/**
 * Creates the slot for a database/store pair if it does not exist yet and
 * returns it.
 */
const materializeStore = ({
  dbName,
  storeName,
}: StoreLocation): MemoryStoreData => {
  const database = data[dbName] ?? createRecord<MemoryStoreData | undefined>()
  data[dbName] = database

  const store = database[storeName] ?? createRecord<unknown>()
  database[storeName] = store

  return store
}

/**
 * Resolves the store handle back to the database/store names it carries. Data
 * is addressed by those names, never by the identity of the handle, because
 * getsetdel creates a fresh handle for every operation.
 */
const getStoreLocation = (customStore?: UseStore): StoreLocation => {
  if (customStore === undefined) {
    return { dbName: DefaultDBName, storeName: DefaultStoreName }
  }

  const { dbName, storeName } = customStore as unknown as Partial<StoreLocation>

  if (typeof dbName !== 'string' || typeof storeName !== 'string') {
    throw new Error(
      `${DiagnosticPrefix} received a store handle it did not create. Use the createStore exported by this module.`,
    )
  }

  return { dbName, storeName }
}

const getReadableStore = (
  customStore?: UseStore,
): MemoryStoreData | undefined => {
  const { dbName, storeName } = getStoreLocation(customStore)

  return data[dbName]?.[storeName]
}

const getWritableStore = (customStore?: UseStore): MemoryStoreData =>
  materializeStore(getStoreLocation(customStore))

const getStringKey = (key: IDBValidKey): string => {
  if (typeof key !== 'string') {
    throw new Error(
      `${DiagnosticPrefix} only supports string keys. Received a key of type '${typeof key}'.`,
    )
  }

  return key
}

/**
 * Runs a synchronous operation and reports it through a promise so that
 * failures (a DataCloneError for example) surface as rejections while the
 * result still settles on the microtask queue, without a timer or a real
 * event-loop turn.
 *
 * The Promise constructor runs its executor synchronously and turns a throw
 * from it into a rejection — the same thing an `async` wrapper did, on a
 * function that never awaits.
 */
const settle = <T>(operation: () => T): Promise<T> =>
  new Promise<T>((resolve) => {
    resolve(operation())
  })

export const createStore = (dbName: string, storeName: string): UseStore => {
  const database = data[dbName]

  if (database !== undefined && database[storeName] === undefined) {
    throw new Error('You cannot add a store to an existing db')
  }

  materializeStore({ dbName, storeName })

  const useStore = (): never => {
    throw new Error(
      `${DiagnosticPrefix} has no real IDBObjectStore, so the handle returned by createStore cannot be invoked.`,
    )
  }

  return Object.assign(useStore, { dbName, storeName })
}

export const promisifyRequest = <T = undefined>(
  _request: IDBRequest<T> | IDBTransaction,
): Promise<T> => {
  throw new Error(
    `${DiagnosticPrefix} has no real IDBRequest, so promisifyRequest cannot be used.`,
  )
}

export const get = <T = unknown>(
  key: IDBValidKey,
  customStore?: UseStore,
): Promise<T | undefined> =>
  settle(() => {
    const stringKey = getStringKey(key)
    const store = getReadableStore(customStore)

    if (store === undefined) {
      return undefined
    }

    const value = store[stringKey]

    return value === undefined ? undefined : (structuredClone(value) as T)
  })

export const set = (
  key: IDBValidKey,
  value: unknown,
  customStore?: UseStore,
): Promise<void> =>
  settle(() => {
    const stringKey = getStringKey(key)
    const clone = structuredClone(value)

    getWritableStore(customStore)[stringKey] = clone
  })

export const setMany = (
  entries: [IDBValidKey, unknown][],
  customStore?: UseStore,
): Promise<void> =>
  settle(() => {
    // Clone everything before committing anything so the batch stays
    // all-or-nothing, as idb-keyval documents.
    const cloned = entries.map<[string, unknown]>(([key, value]) => [
      getStringKey(key),
      structuredClone(value),
    ])

    const store = getWritableStore(customStore)

    for (const [key, value] of cloned) {
      store[key] = value
    }
  })

export const getMany = <T = unknown>(
  keys: IDBValidKey[],
  customStore?: UseStore,
): Promise<(T | undefined)[]> =>
  settle(() => {
    const stringKeys = keys.map(getStringKey)
    const store = getReadableStore(customStore)

    return stringKeys.map((key) => {
      const value = store?.[key]

      return value === undefined ? undefined : structuredClone(value)
    }) as (T | undefined)[]
  })

export const update = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- unlike the other members, update's T has no inference site outside the updater, so it always falls back to its default; `unknown` would narrow to `{}` under `??` and reject `(oldValue) => (oldValue ?? 0) + 1`, which real idb-keyval accepts
  T = any,
>(
  key: IDBValidKey,
  updater: (oldValue: T | undefined) => T,
  customStore?: UseStore,
): Promise<void> =>
  settle(() => {
    const stringKey = getStringKey(key)
    const store = getWritableStore(customStore)
    const current = store[stringKey]
    const next = updater(
      current === undefined ? undefined : (structuredClone(current) as T),
    )

    store[stringKey] = structuredClone(next)
  })

export const del = (key: IDBValidKey, customStore?: UseStore): Promise<void> =>
  settle(() => {
    const stringKey = getStringKey(key)
    const store = getReadableStore(customStore)

    if (store !== undefined) {
      Reflect.deleteProperty(store, stringKey)
    }
  })

export const delMany = (
  keys: IDBValidKey[],
  customStore?: UseStore,
): Promise<void> =>
  settle(() => {
    const stringKeys = keys.map(getStringKey)
    const store = getReadableStore(customStore)

    if (store === undefined) {
      return
    }

    for (const key of stringKeys) {
      Reflect.deleteProperty(store, key)
    }
  })

export const clear = (customStore?: UseStore): Promise<void> =>
  settle(() => {
    const { dbName, storeName } = getStoreLocation(customStore)
    const database = data[dbName]

    // Emptying the store keeps its slot, matching what a cleared IndexedDB
    // object store looks like.
    if (database?.[storeName] !== undefined) {
      database[storeName] = createRecord<unknown>()
    }
  })

export const keys = <KeyType extends IDBValidKey>(
  customStore?: UseStore,
): Promise<KeyType[]> =>
  settle(() => Object.keys(getReadableStore(customStore) ?? {}) as KeyType[])

export const values = <T = unknown>(customStore?: UseStore): Promise<T[]> =>
  settle(
    () =>
      Object.values(getReadableStore(customStore) ?? {}).map((value) =>
        structuredClone(value),
      ) as T[],
  )

export const entries = <KeyType extends IDBValidKey, ValueType = unknown>(
  customStore?: UseStore,
): Promise<[KeyType, ValueType][]> =>
  settle(() =>
    Object.entries(getReadableStore(customStore) ?? {}).map<
      [KeyType, ValueType]
    >(([key, value]) => [key as KeyType, structuredClone(value) as ValueType]),
  )

/**
 * Discards every database, store, and value held by this backend. Call it
 * before each test so cases stay independent.
 */
export const testClearMockIndexedDB = (): void => {
  data = createRecord()
}

/**
 * Returns an independent snapshot of everything this backend holds, shaped as
 * `database name -> store name -> key -> value`. `structuredClone` rebuilds
 * the internal null-prototype records as ordinary objects, so the result
 * serializes the way a test snapshot expects.
 */
export const testGetMockIndexedDBData = (): Record<string, unknown> =>
  structuredClone(data)
