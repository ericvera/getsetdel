import type * as IdbKeyval from 'idb-keyval'
import { beforeEach, expect, it, vi } from 'vitest'
import * as memoryIdbKeyval from './idbKeyval.js'
import {
  clear,
  createStore,
  del,
  delMany,
  entries,
  get,
  getMany,
  keys,
  promisifyRequest,
  set,
  setMany,
  testClearMockIndexedDB,
  testGetMockIndexedDBData,
  update,
  values,
} from './idbKeyval.js'

class Counter {
  public count: number

  public constructor(count: number) {
    this.count = count
  }

  public increment(): number {
    return this.count + 1
  }
}

beforeEach(() => {
  // vitest.setup.ts already resets this same module instance — src/__mocks__/
  // idb-keyval.ts is a bare re-export of it. Repeating the reset here keeps
  // this file self-contained rather than dependent on that indirection, and
  // the call is idempotent.
  testClearMockIndexedDB()
})

it('is assignable to the real idb-keyval module surface', () => {
  // Test: these declarations are the compile-time assertion; yarn build proves
  // them. The check runs in both directions because one direction alone is not
  // enough: a member declared narrower than the real one (Promise<T[]> where
  // idb-keyval resolves (T | undefined)[]) still assigns cleanly under array
  // covariance, so only the reverse direction catches that drift.
  const backend: typeof IdbKeyval = memoryIdbKeyval

  // The real module is only ever a type here, so it is shaped rather than
  // imported; the assignment itself is the assertion.
  const realShape: Pick<typeof memoryIdbKeyval, keyof typeof IdbKeyval> =
    {} as typeof IdbKeyval

  expect(typeof backend.createStore).toBe('function')
  expect(realShape).toBeDefined()
})

it('round-trips a value and shares data between handles with the same names', async () => {
  // Test prep: two independent handles for the same database and store
  const handleA = createStore('round-trip-db', 'store')
  const handleB = createStore('round-trip-db', 'store')

  // Test
  await set('key', { message: 'hello' }, handleA)

  expect(typeof handleA).toBe('function')
  expect(await get('key', handleB)).toEqual({ message: 'hello' })
})

it('keeps data in different databases isolated', async () => {
  // Test prep
  const first = createStore('isolated-db-1', 'store')
  const second = createStore('isolated-db-2', 'store')

  // Test
  await set('key', 'first', first)
  await set('key', 'second', second)

  expect(await get('key', first)).toBe('first')
  expect(await get('key', second)).toBe('second')
})

it('uses a single shared default store when no store is passed', async () => {
  // Test
  await set('key', 'value')

  expect(await get('key')).toBe('value')
  expect(await keys()).toEqual(['key'])
})

it('applies structuredClone semantics on write and read', async () => {
  // Test prep
  const store = createStore('clone-db', 'store')
  const date = new Date('2020-01-02T03:04:05.000Z')

  // Test
  await set('instance', new Counter(1), store)
  await set('date', date, store)
  await set('map', new Map([['a', 1]]), store)
  await set('set', new Set([1, 2]), store)

  const instance = await get('instance', store)
  const storedDate = await get('date', store)
  const storedMap = await get<Map<string, number>>('map', store)
  const storedSet = await get<Set<number>>('set', store)

  // A class instance comes back as a plain object without its methods
  expect(instance).toEqual({ count: 1 })
  expect(instance instanceof Counter).toBe(false)
  expect((instance as { increment?: unknown }).increment).toBeUndefined()

  // Asserted structurally because vitest.setup.ts installs a mock Date global,
  // which makes `instanceof Date` unreliable in this suite
  expect(Object.prototype.toString.call(storedDate)).toBe('[object Date]')
  expect((storedDate as Date).getTime()).toBe(date.getTime())

  expect(storedMap).toBeInstanceOf(Map)
  expect(storedMap?.get('a')).toBe(1)
  expect(storedSet).toBeInstanceOf(Set)
  expect(storedSet?.has(2)).toBe(true)
})

it('rejects a write carrying an own function property', async () => {
  // Test prep
  const store = createStore('unclonable-db', 'store')

  // Test
  await expect(
    set('key', { run: () => 'nope' }, store),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `[DataCloneError: () => "nope" could not be cloned.]`,
  )

  expect(await get('key', store)).toBeUndefined()
})

it('drops a symbol-keyed property instead of failing the write', async () => {
  // Test prep
  const store = createStore('symbol-key-db', 'store')

  // Test
  await set('key', { visible: 1, [Symbol('hidden')]: 2 }, store)

  expect(await get('key', store)).toEqual({ visible: 1 })
})

it('rejects a write carrying a symbol value', async () => {
  // Test prep
  const store = createStore('symbol-value-db', 'store')

  // Test: a symbol as a value is unclonable, unlike a symbol used as a key
  await expect(
    set('key', { hidden: Symbol('nope') }, store),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `[DataCloneError: Symbol(nope) could not be cloned.]`,
  )

  expect(await get('key', store)).toBeUndefined()
})

it('leaves the store untouched when a setMany batch has an unclonable value', async () => {
  // Test prep
  const store = createStore('set-many-db', 'store')
  await set('existing', 'kept', store)

  // Test
  await expect(
    setMany(
      [
        ['a', 1],
        ['b', { run: () => 1 }],
      ],
      store,
    ),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `[DataCloneError: () => 1 could not be cloned.]`,
  )

  expect(await entries(store)).toEqual([['existing', 'kept']])
})

it('isolates stored data from mutations of the written and the read value', async () => {
  // Test prep
  const store = createStore('mutation-db', 'store')
  const original = { nested: { count: 1 } }

  // Test: mutating the written value does not change what was stored
  await set('key', original, store)
  original.nested.count = 99

  const firstRead = (await get('key', store)) as { nested: { count: number } }

  expect(firstRead.nested.count).toBe(1)

  // Test: mutating the read value does not change what was stored
  firstRead.nested.count = 42

  expect(await get('key', store)).toEqual({ nested: { count: 1 } })
})

it('resolves undefined for a missing key and empty results for an untouched store', async () => {
  // Test prep
  const store = createStore('untouched-db', 'store')

  // Test
  expect(await get('missing', store)).toBeUndefined()
  expect(await keys(store)).toEqual([])
  expect(await entries(store)).toEqual([])
  expect(await values(store)).toEqual([])
  expect(await getMany(['a', 'b'], store)).toEqual([undefined, undefined])
})

it('returns getMany values in the requested order with holes for missing keys', async () => {
  // Test prep
  const store = createStore('get-many-db', 'store')
  await setMany(
    [
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ],
    store,
  )

  // Test
  expect(await getMany(['c', 'missing', 'a'], store)).toEqual([3, undefined, 1])
})

it('does not expose Object.prototype members as stored keys', async () => {
  // Test prep
  const store = createStore('prototype-key-db', 'store')

  // Test: an untouched store has none of Object.prototype's members
  expect(await get('toString', store)).toBeUndefined()
  expect(await get('constructor', store)).toBeUndefined()
  expect(await get('hasOwnProperty', store)).toBeUndefined()
  expect(await getMany(['toString', 'constructor'], store)).toEqual([
    undefined,
    undefined,
  ])
  expect(await keys(store)).toEqual([])
  expect(await values(store)).toEqual([])
  expect(await entries(store)).toEqual([])

  // Test: update sees undefined rather than the inherited native function
  let seen: string | undefined = 'not called'
  await update<string>(
    'toString',
    (oldValue) => {
      seen = oldValue

      return 'replaced'
    },
    store,
  )

  expect(seen).toBeUndefined()
  expect(await get('toString', store)).toBe('replaced')
  expect(await keys(store)).toEqual(['toString'])
})

it('stores __proto__ as an ordinary key', async () => {
  // Test prep
  const store = createStore('proto-key-db', 'store')

  // Test
  await set('__proto__', { flag: true }, store)

  expect(await keys(store)).toEqual(['__proto__'])
  expect(await get('__proto__', store)).toEqual({ flag: true })
  expect(await entries(store)).toEqual([['__proto__', { flag: true }]])

  await del('__proto__', store)

  expect(await keys(store)).toEqual([])
  expect(await get('__proto__', store)).toBeUndefined()
})

it('supports database and store names that collide with Object.prototype members', async () => {
  // Test prep
  const protoDb = createStore('__proto__', 'store')
  const toStringDb = createStore('toString', 'toString')

  // Test
  await set('key', 'from proto db', protoDb)
  await set('key', 'from toString db', toStringDb)

  expect(await get('key', protoDb)).toBe('from proto db')
  expect(await get('key', toStringDb)).toBe('from toString db')

  // A second handle for the same names reaches the same slot
  expect(await get('key', createStore('__proto__', 'store'))).toBe(
    'from proto db',
  )

  // The writes landed in this backend, not on a shared native object. The
  // natives are read through their descriptors so referencing them does not
  // trip @typescript-eslint/unbound-method.
  const readNative = (owner: object, name: string): object =>
    Object.getOwnPropertyDescriptor(owner, name)?.value as object

  expect(
    Object.getOwnPropertyNames(readNative(Object.prototype, 'toString')),
  ).not.toContain('key')
  expect(
    Object.getOwnPropertyNames(readNative(Function.prototype, 'toString')),
  ).not.toContain('key')
  expect(testGetMockIndexedDBData()).toMatchInlineSnapshot(`
    {
      "__proto__": {
        "store": {
          "key": "from proto db",
        },
      },
      "toString": {
        "toString": {
          "key": "from toString db",
        },
      },
    }
  `)
})

it('accepts the same update call shape as real idb-keyval', async () => {
  // Test prep
  const store = createStore('update-inference-db', 'store')

  // Test: this call would not compile if update's generic default regressed to
  // unknown, which narrows to {} under ??
  /* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-plus-operands -- the point of this case is that the `any`-defaulted updater shape real idb-keyval accepts still compiles here */
  await update('counter', (oldValue) => (oldValue ?? 0) + 1, store)
  await update('counter', (oldValue) => (oldValue ?? 0) + 1, store)
  /* eslint-enable @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-plus-operands */

  expect(await get('counter', store)).toBe(2)
})

it('supports update and values', async () => {
  // Test prep
  const store = createStore('update-db', 'store')

  // Test
  await update<number>('counter', (oldValue) => (oldValue ?? 0) + 1, store)
  await update<number>('counter', (oldValue) => (oldValue ?? 0) + 1, store)
  await set('other', 'value', store)

  expect(await get('counter', store)).toBe(2)
  expect(await values(store)).toEqual([2, 'value'])
})

it('deletes single and multiple keys', async () => {
  // Test prep
  const store = createStore('delete-db', 'store')
  await setMany(
    [
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ],
    store,
  )

  // Test
  await del('a', store)
  await delMany(['b'], store)

  expect(await keys(store)).toEqual(['c'])
})

it('throws for promisifyRequest and for an invoked store handle', () => {
  // Test prep
  const store = createStore('diagnostic-db', 'store')

  // Test
  expect(() =>
    promisifyRequest({} as IDBRequest<undefined>),
  ).toThrowErrorMatchingInlineSnapshot(
    `[Error: getsetdel's in-memory idb-keyval backend has no real IDBRequest, so promisifyRequest cannot be used.]`,
  )
  expect(() =>
    store('readonly', () => undefined),
  ).toThrowErrorMatchingInlineSnapshot(
    `[Error: getsetdel's in-memory idb-keyval backend has no real IDBObjectStore, so the handle returned by createStore cannot be invoked.]`,
  )
})

it('rejects a non-string key', async () => {
  // Test prep
  const store = createStore('key-type-db', 'store')

  // Test
  await expect(
    set(1, 'value', store),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `[Error: getsetdel's in-memory idb-keyval backend only supports string keys. Received a key of type 'number'.]`,
  )
  await expect(get(1, store)).rejects.toThrowErrorMatchingInlineSnapshot(
    `[Error: getsetdel's in-memory idb-keyval backend only supports string keys. Received a key of type 'number'.]`,
  )
})

it('throws synchronously when a second store name is added to an existing database', () => {
  // Test prep
  createStore('single-store-db', 'store')

  // Test
  expect(() =>
    createStore('single-store-db', 'other'),
  ).toThrowErrorMatchingInlineSnapshot(
    `[Error: You cannot add a store to an existing db]`,
  )
})

it('shows a freshly created store as an empty slot before any write', () => {
  // Test
  createStore('fresh-db', 'store')

  expect(testGetMockIndexedDBData()).toMatchInlineSnapshot(`
    {
      "fresh-db": {
        "store": {},
      },
    }
  `)
})

it('empties a store on clear but keeps its slot', async () => {
  // Test prep
  const store = createStore('clear-db', 'store')
  await set('key', 'value', store)

  // Test
  await clear(store)

  expect(testGetMockIndexedDBData()).toMatchInlineSnapshot(`
    {
      "clear-db": {
        "store": {},
      },
    }
  `)
})

it('clears the data without touching globalThis.indexedDB', async () => {
  // Test prep
  const store = createStore('clear-helper-db', 'store')
  await set('key', 'value', store)
  const indexedDBBefore = globalThis.indexedDB

  // Test
  testClearMockIndexedDB()

  expect(testGetMockIndexedDBData()).toEqual({})
  expect(globalThis.indexedDB).toBe(indexedDBBefore)
})

it('returns an inspector snapshot that later writes do not change', async () => {
  // Test prep
  const store = createStore('snapshot-db', 'store')
  await set('key', 'first', store)

  // Test
  const snapshot = testGetMockIndexedDBData()
  await set('key', 'second', store)

  expect(snapshot).toEqual({ 'snapshot-db': { store: { key: 'first' } } })
})

it('returns an inspector snapshot that mutating does not write back', async () => {
  // Test prep
  const store = createStore('snapshot-mutation-db', 'store')
  await set('key', { message: 'first' }, store)

  // Test: mutate the snapshot at every level — the store keeps its own copy
  const snapshot = testGetMockIndexedDBData() as Record<
    string,
    Record<string, Record<string, unknown> | undefined> | undefined
  >

  const stored = snapshot['snapshot-mutation-db']?.['store']?.['key'] as {
    message: string
  }

  stored.message = 'mutated'
  Reflect.deleteProperty(snapshot, 'snapshot-mutation-db')

  expect(await get('key', store)).toEqual({ message: 'first' })
})

it('settles operations without advancing fake timers', async () => {
  // Test prep: with timers frozen, anything needing a real event-loop turn
  // would hang instead of resolving
  vi.useFakeTimers()
  const store = createStore('fake-timer-db', 'store')

  // Test
  await set('key', 'value', store)
  const value = await get('key', store)

  expect(value).toBe('value')

  vi.useRealTimers()
})
