type InternalStore = Record<string, string | undefined>
type InternalStoreCollection = Record<string, InternalStore | undefined>
type InternalGlobalStore = Record<string, InternalStoreCollection | undefined>

let _store: InternalGlobalStore = {}

class Store {
  public dbName: string
  public storeName: string

  public constructor(dbName: string, storeName: string) {
    this.dbName = dbName
    this.storeName = storeName

    if (_store[dbName] === undefined) {
      _store[dbName] = {}
    }

    const dbRef = _store[dbName]

    if (typeof dbRef !== 'undefined' && dbRef[storeName] === undefined) {
      dbRef[storeName] = {}
    }
  }
}

export const createStore = (dbName: string, storeName: string): Store => {
  const dbRef = _store[dbName]

  if (dbRef !== undefined && dbRef[storeName] === undefined) {
    throw new Error('You cannot add a store to an existing db')
  }

  return new Store(dbName, storeName)
}

export const entries = async (store: Store): Promise<[string, unknown][]> => {
  return Promise.resolve(
    Object.entries(_store[store.dbName]?.[store.storeName] ?? {}).map(
      ([key, value]) => {
        return [key, typeof value === 'string' ? JSON.parse(value) : undefined]
      },
    ),
  )
}

export const get = async (key: string, store: Store): Promise<unknown> => {
  const value = _store[store.dbName]?.[store.storeName]?.[key]

  return Promise.resolve(
    typeof value !== 'string' ? undefined : JSON.parse(value),
  )
}

export const getMany = async (
  keys: string[],
  store: Store,
): Promise<unknown> => {
  return Promise.resolve(
    keys.map((key) => {
      const value = _store[store.dbName]?.[store.storeName]?.[key]
      return typeof value !== 'string'
        ? undefined
        : (JSON.parse(value) as unknown)
    }),
  )
}

export const set = async (
  key: string,
  value: unknown,
  store: Store,
): Promise<void> => {
  const itemRef = _store[store.dbName]?.[store.storeName]

  if (itemRef !== undefined) {
    itemRef[key] = JSON.stringify(value)
  }

  return Promise.resolve()
}

export const setMany = async (
  entries: [string, unknown][],
  store: Store,
): Promise<void> => {
  entries.forEach((entry) => {
    const itemRef = _store[store.dbName]?.[store.storeName]

    if (itemRef !== undefined) {
      const [key, value] = entry
      itemRef[key] = JSON.stringify(value)
    }
  })

  return Promise.resolve()
}

export const del = async (key: string, store: Store): Promise<void> => {
  const itemRef = _store[store.dbName]?.[store.storeName]

  if (itemRef?.[key] !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete itemRef[key]
  }

  return Promise.resolve()
}

export const delMany = async (keys: string[], store: Store): Promise<void> => {
  keys.forEach((key) => {
    const itemRef = _store[store.dbName]?.[store.storeName]

    if (itemRef?.[key] !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete itemRef[key]
    }
  })

  return Promise.resolve()
}

export const keys = async (store: Store): Promise<string[]> => {
  return Promise.resolve(
    Object.keys(_store[store.dbName]?.[store.storeName] ?? {}),
  )
}

export const clear = async (store: Store): Promise<void> => {
  const dbRef = _store[store.dbName]

  if (dbRef?.[store.storeName] !== undefined) {
    dbRef[store.storeName] = {}
  }

  return Promise.resolve()
}

export const testClearMockIndexedDB = () => {
  _store = {}

  globalThis.indexedDB = {
    deleteDatabase: (name: string) => {
      const result: InternalGlobalStore = {}

      for (const key in _store) {
        if (key !== name) {
          result[key] = _store[key]
        }
      }

      _store = result

      return {} as IDBOpenDBRequest
    },
  } as IDBFactory
}

export const testGetMockIndexedDBData = (): Record<string, unknown> => _store
