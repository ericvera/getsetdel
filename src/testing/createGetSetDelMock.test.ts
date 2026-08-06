import { expect, it, vi } from 'vitest'
import { testGetMockIndexedDBData } from '../__mocks__/idb-keyval.js'
import {
  AllDetailsDB,
  PrivateDB1,
  PrivateDB2,
  PublicDB,
} from '../__test__/constants.js'
import * as actual from '../index.js'
import type { GetSetDelStoreToken } from '../index.js'
import { createGetSetDelMock } from './createGetSetDelMock.js'

it('reads back through the mock what was written through the mock', async () => {
  // Test prep: create a store and write through the mock
  const mock = createGetSetDelMock(actual)
  const db = await mock.createStore(PrivateDB1)

  await mock.set(db, 'some-key-1', { message: 'hello 1' })
  await mock.setMany(db, [['some-key-2', { message: 'hello 2' }]])

  // Test
  expect(await mock.get(db, 'some-key-1')).toMatchInlineSnapshot(`
    {
      "message": "hello 1",
    }
  `)
  expect(await mock.keys(db)).toMatchInlineSnapshot(`
    [
      "some-key-1",
      "some-key-2",
    ]
  `)
  expect(await mock.entries(db)).toMatchInlineSnapshot(`
    [
      [
        "some-key-1",
        {
          "message": "hello 1",
        },
      ],
      [
        "some-key-2",
        {
          "message": "hello 2",
        },
      ],
    ]
  `)
  expect(await mock.getMany(db, ['some-key-2', 'missing-key']))
    .toMatchInlineSnapshot(`
      [
        {
          "message": "hello 2",
        },
        undefined,
      ]
    `)
})

it('delegates deletes, meta, and clear to the real module', async () => {
  // Test prep: create a store with data and meta
  const mock = createGetSetDelMock(actual)
  const db = await mock.createStore(PrivateDB1)

  await mock.setMany(db, [
    ['some-key-1', 'value 1'],
    ['some-key-2', 'value 2'],
    ['some-key-3', 'value 3'],
  ])
  await mock.setMeta(db, { note: 'some note' })

  // Test: meta round trips
  expect(await mock.getMeta(db)).toMatchInlineSnapshot(`
    {
      "note": "some note",
    }
  `)

  // Test: deletes reach the store
  await mock.del(db, 'some-key-1')
  await mock.delMany(db, ['some-key-2'])

  expect(await mock.entries(db)).toMatchInlineSnapshot(`
    [
      [
        "some-key-3",
        "value 3",
      ],
    ]
  `)

  // Test: clear removes the store from the inventory
  await mock.clear(db)

  await expect(mock.entries(db)).rejects.toBeInstanceOf(
    actual.GetSetDelResetError,
  )
})

it('forwards queryInventory', async () => {
  // Test prep: create two stores
  const mock = createGetSetDelMock(actual)

  await mock.createStore(PrivateDB1)
  await mock.createStore(PublicDB)

  // Test
  const result = await mock.queryInventory({ name: 'public-db' })

  expect(result.map((token) => token.dbName)).toMatchInlineSnapshot(`
    [
      "getsetdel-public-db",
    ]
  `)
})

it('does not touch a store when the factory is called', () => {
  // Test
  const mock = createGetSetDelMock(actual)

  expect(typeof mock.entries).toBe('function')
  expect(testGetMockIndexedDBData()).toMatchInlineSnapshot(`{}`)
})

it('rejects entries with exactly the armed value', async () => {
  // Test prep: create a store with data
  const mock = createGetSetDelMock(actual)
  const db = await mock.createStore(PrivateDB1)

  await mock.set(db, 'some-key', 'some value')

  const armedError = new Error('read failed')

  // Test
  mock.failEntriesWith(armedError)

  await expect(mock.entries(db)).rejects.toBe(armedError)
})

it('leaves every other member on the real store while the fault is armed', async () => {
  // Test prep: create a store with data and arm the fault
  const mock = createGetSetDelMock(actual)
  const db = await mock.createStore(PrivateDB1)

  await mock.set(db, 'some-key', 'some value')
  await mock.setMeta(db, { note: 'some note' })

  mock.failEntriesWith(new Error('read failed'))

  // Test
  expect(await mock.get(db, 'some-key')).toBe('some value')
  expect(await mock.keys(db)).toStrictEqual(['some-key'])
  expect(await mock.getMany(db, ['some-key'])).toStrictEqual(['some value'])
  expect(await mock.getMeta(db)).toStrictEqual({ note: 'some note' })

  // Test: writes still reach the store
  await mock.set(db, 'other-key', 'other value')

  expect(await mock.get(db, 'other-key')).toBe('other value')
})

it('replaces the armed value when failEntriesWith is called again', async () => {
  // Test prep: create a store and arm a first value
  const mock = createGetSetDelMock(actual)
  const db = await mock.createStore(PrivateDB1)

  const firstError = new Error('first failure')
  const secondError = new Error('second failure')

  mock.failEntriesWith(firstError)

  // Test
  mock.failEntriesWith(secondError)

  await expect(mock.entries(db)).rejects.toBe(secondError)
})

it('arms the fault with values that are falsy or are not errors', async () => {
  // Test prep: create a store
  const mock = createGetSetDelMock(actual)
  const db = await mock.createStore(PrivateDB1)

  // Test: a falsy value
  mock.failEntriesWith(0)

  await expect(mock.entries(db)).rejects.toBe(0)

  // Test: a value that is not an Error
  const armedValue = { code: 'QuotaExceeded' }

  mock.failEntriesWith(armedValue)

  await expect(mock.entries(db)).rejects.toBe(armedValue)
})

it('keeps an armed undefined distinct from nothing being armed', async () => {
  // Test prep: create a store with data, so a real read would resolve
  const mock = createGetSetDelMock(actual)
  const db = await mock.createStore(PrivateDB1)

  await mock.set(db, 'some-key', 'some value')

  // Test: entries rejects with undefined rather than reading the store
  mock.failEntriesWith(undefined)

  await expect(mock.entries(db)).rejects.toBeUndefined()

  // Test: clearing the fault is what makes entries read again
  mock.clearEntriesFault()

  expect(await mock.entries(db)).toStrictEqual([['some-key', 'some value']])
})

it('restores entries reads when the fault is cleared', async () => {
  // Test prep: create a store with data and arm the fault
  const mock = createGetSetDelMock(actual)
  const db = await mock.createStore(PrivateDB1)

  await mock.set(db, 'some-key', 'some value')

  mock.failEntriesWith(new Error('read failed'))

  // Test
  mock.clearEntriesFault()

  expect(await mock.entries(db)).toStrictEqual([['some-key', 'some value']])
})

it('leaves the store stubbed when the fault is cleared', async () => {
  // Test prep: create a store with data, then arm both controls
  const mock = createGetSetDelMock(actual)
  const db = await mock.createStore(PrivateDB1)

  await mock.set(db, 'some-key', 'some value')

  mock.failEntriesWith(new Error('read failed'))
  mock.stubStore()

  // Test: entries reads the stub rather than the store
  mock.clearEntriesFault()

  expect(await mock.entries(db)).toStrictEqual([])
  expect(await mock.get(db, 'some-key')).toBeUndefined()

  // Test: the store was there all along
  mock.resetGetSetDelMock()

  expect(await mock.entries(db)).toStrictEqual([['some-key', 'some value']])
})

it('resolves createStore to a stub token that echoes the store info', async () => {
  // Test prep: stub the store
  const mock = createGetSetDelMock(actual)

  mock.stubStore()

  // Test: the annotation is the compile-time assertion that no cast is needed
  const token: GetSetDelStoreToken = await mock.createStore(AllDetailsDB)

  expect(token).toMatchInlineSnapshot(`
    {
      "creation": 0,
      "dbName": "getsetdel-stubbed-store",
      "key": "000",
      "store": [Function],
      "tags": [
        "private",
        "public",
      ],
      "version": 1,
    }
  `)

  // Test: no database was opened
  expect(testGetMockIndexedDBData()).toMatchInlineSnapshot(`{}`)
})

it('omits the optional fields the store info did not carry from the stub token', async () => {
  // Test prep: stub the store
  const mock = createGetSetDelMock(actual)

  mock.stubStore()

  // Test
  const token = await mock.createStore(PublicDB)

  expect(token).toMatchInlineSnapshot(`
    {
      "creation": 0,
      "dbName": "getsetdel-stubbed-store",
      "store": [Function],
    }
  `)
  expect('key' in token).toBe(false)
  expect('version' in token).toBe(false)
  expect('tags' in token).toBe(false)
})

it('fails with a diagnostic when the stub token store handle is invoked', async () => {
  // Test prep: stub the store
  const mock = createGetSetDelMock(actual)

  mock.stubStore()

  const token = await mock.createStore(PrivateDB1)

  // Test
  expect(() =>
    token.store('readonly', () => undefined),
  ).toThrowErrorMatchingInlineSnapshot(
    `[Error: The getsetdel mock is stubbing the store, so the token returned for 'private-db-1' has no IDBObjectStore and its store handle cannot be invoked.]`,
  )
})

it('keeps the stub token creation fixed across calls and clock changes', async () => {
  // Test prep: stub the store
  const mock = createGetSetDelMock(actual)

  mock.stubStore()

  const first = await mock.createStore(PrivateDB1)

  // Test
  vi.setSystemTime('2030-06-15T08:00:00.000Z')

  const second = await mock.createStore(PrivateDB1)

  expect(second.creation).toBe(first.creation)
  expect(second.creation).toBe(0)
})

it('resolves stubbed reads without consulting the store', async () => {
  // Test prep: create a store with data and meta, then stub the store
  const mock = createGetSetDelMock(actual)
  const db = await mock.createStore(PrivateDB1)

  await mock.set(db, 'some-key', 'some value')
  await mock.setMeta(db, { note: 'some note' })

  mock.stubStore()

  // Test
  expect(await mock.entries(db)).toStrictEqual([])
  expect(await mock.keys(db)).toStrictEqual([])
  expect(await mock.queryInventory()).toStrictEqual([])
  expect(await mock.get(db, 'some-key')).toBeUndefined()
  expect(await mock.getMeta(db)).toBeUndefined()

  // Test: getMany returns one slot per requested key
  expect(await mock.getMany(db, ['some-key', 'other-key', 'third-key']))
    .toMatchInlineSnapshot(`
      [
        undefined,
        undefined,
        undefined,
      ]
    `)
})

it('changes no stored data while the store is stubbed', async () => {
  // Test prep: create a store with data and meta, then stub the store
  const mock = createGetSetDelMock(actual)
  const db = await mock.createStore(PrivateDB1)

  await mock.set(db, 'some-key', 'some value')
  await mock.setMeta(db, { note: 'some note' })

  mock.stubStore()

  // Test: every write resolves
  await mock.set(db, 'some-key', 'changed value')
  await mock.setMany(db, [['other-key', 'other value']])
  await mock.del(db, 'some-key')
  await mock.delMany(db, ['some-key'])
  await mock.setMeta(db, { note: 'changed note' })
  await mock.clear(db)

  // Test: the store is untouched, inventory entry included
  mock.resetGetSetDelMock()

  expect(await mock.entries(db)).toStrictEqual([['some-key', 'some value']])
  expect(await mock.getMeta(db)).toStrictEqual({ note: 'some note' })
})

it('makes reset-guarded members reject with a genuine reset error', async () => {
  // Test prep: create a store with data
  const mock = createGetSetDelMock(actual)
  const db = await mock.createStore(PrivateDB1)

  await mock.set(db, 'some-key', 'some value')

  // Test
  await mock.simulateStoreReset(db)

  const rejection = mock.entries(db)

  await expect(rejection).rejects.toBeInstanceOf(actual.GetSetDelResetError)
  await expect(rejection).rejects.toMatchInlineSnapshot(
    `[Error: A reset of the store 'getsetdel-private-db-1' is required. (Reason: store was deleted)]`,
  )

  // Test: the real reset-recovery path handles it
  let handled = false
  const onResetError = (): Promise<void> => {
    handled = true

    return Promise.resolve()
  }

  await mock.entries(db).catch(actual.handleResetError(onResetError))

  expect(handled).toBe(true)
})

it('exposes the reset error class and the reset handler through the mock', async () => {
  // Test prep: create a store and wipe it, so a genuine reset error is raised
  const mock = createGetSetDelMock(actual)
  const db = await mock.createStore(PrivateDB1)

  await mock.simulateStoreReset(db)

  // Test: the error read back through the mock satisfies the mock's class
  await expect(mock.entries(db)).rejects.toBeInstanceOf(
    mock.GetSetDelResetError,
  )

  // Test: the mock's handler routes a reset error to the recovery callback
  let handled = false
  const onResetError = (): Promise<void> => {
    handled = true

    return Promise.resolve()
  }

  await mock.entries(db).catch(mock.handleResetError(onResetError))

  expect(handled).toBe(true)

  // Test: the mock's handler rethrows anything that is not a reset error
  handled = false

  const otherError = new Error('not a reset')

  await expect(mock.handleResetError(onResetError)(otherError)).rejects.toBe(
    otherError,
  )
  expect(handled).toBe(false)
})

it('affects only the store named by simulateStoreReset', async () => {
  // Test prep: create two stores with data
  const mock = createGetSetDelMock(actual)
  const db1 = await mock.createStore(PrivateDB1)
  const db2 = await mock.createStore(PrivateDB2)

  await mock.set(db1, 'some-key', 'value 1')
  await mock.set(db2, 'some-key', 'value 2')

  // Test
  await mock.simulateStoreReset(db1)

  await expect(mock.entries(db1)).rejects.toBeInstanceOf(
    actual.GetSetDelResetError,
  )
  expect(await mock.entries(db2)).toStrictEqual([['some-key', 'value 2']])
})

it('yields a usable fresh token when the store is created after a reset', async () => {
  // Test prep: create a store with data and reset it
  const mock = createGetSetDelMock(actual)
  const db = await mock.createStore(PrivateDB1)

  await mock.set(db, 'some-key', 'some value')
  await mock.simulateStoreReset(db)

  // Test
  const freshDB = await mock.createStore(PrivateDB1)

  expect(await mock.entries(freshDB)).toStrictEqual([])

  await mock.set(freshDB, 'other-key', 'other value')

  expect(await mock.entries(freshDB)).toStrictEqual([
    ['other-key', 'other value'],
  ])
})

it('rejects entries with the armed value while the store is stubbed', async () => {
  // Test prep: create a store, arm the fault, and stub the store
  const mock = createGetSetDelMock(actual)
  const db = await mock.createStore(PrivateDB1)

  const armedError = new Error('read failed')

  mock.failEntriesWith(armedError)
  mock.stubStore()

  // Test
  await expect(mock.entries(db)).rejects.toBe(armedError)
})

it('returns stubbed results for every other member while the fault is armed', async () => {
  // Test prep: create a store with data and meta, arm the fault, stub the store
  const mock = createGetSetDelMock(actual)
  const db = await mock.createStore(PrivateDB1)

  await mock.set(db, 'some-key', 'some value')
  await mock.setMeta(db, { note: 'some note' })

  mock.failEntriesWith(new Error('read failed'))
  mock.stubStore()

  // Test: reads answer from the stub rather than rejecting with the fault
  const token = await mock.createStore(PrivateDB1)

  expect(token.dbName).toBe('getsetdel-stubbed-store')
  expect(await mock.get(db, 'some-key')).toBeUndefined()
  expect(await mock.getMany(db, ['some-key', 'other-key'])).toStrictEqual([
    undefined,
    undefined,
  ])
  expect(await mock.getMeta(db)).toBeUndefined()
  expect(await mock.keys(db)).toStrictEqual([])
  expect(await mock.queryInventory()).toStrictEqual([])

  // Test: writes resolve without touching the store
  await mock.set(db, 'some-key', 'changed value')
  await mock.setMany(db, [['other-key', 'other value']])
  await mock.del(db, 'some-key')
  await mock.delMany(db, ['some-key'])
  await mock.setMeta(db, { note: 'changed note' })
  await mock.clear(db)

  mock.resetGetSetDelMock()

  expect(await mock.entries(db)).toStrictEqual([['some-key', 'some value']])
  expect(await mock.getMeta(db)).toStrictEqual({ note: 'some note' })
})

it('returns stubbed results after a simulated reset', async () => {
  // Test prep: create a store with data and reset it
  const mock = createGetSetDelMock(actual)
  const db = await mock.createStore(PrivateDB1)

  await mock.set(db, 'some-key', 'some value')
  await mock.simulateStoreReset(db)

  // Test
  mock.stubStore()

  expect(await mock.entries(db)).toStrictEqual([])
  expect(await mock.keys(db)).toStrictEqual([])
  expect(await mock.get(db, 'some-key')).toBeUndefined()
  expect(await mock.getMany(db, ['some-key'])).toStrictEqual([undefined])
  expect(await mock.getMeta(db)).toBeUndefined()

  await mock.set(db, 'some-key', 'changed value')
  await mock.setMany(db, [['other-key', 'other value']])
  await mock.del(db, 'some-key')
  await mock.delMany(db, ['some-key'])
  await mock.setMeta(db, { note: 'some note' })
  await mock.clear(db)
})

it('keeps rejecting the other guarded members after a reset while the fault is armed', async () => {
  // Test prep: create a store, reset it, and arm the fault
  const mock = createGetSetDelMock(actual)
  const db = await mock.createStore(PrivateDB1)

  await mock.simulateStoreReset(db)

  const armedError = new Error('read failed')

  mock.failEntriesWith(armedError)

  // Test: entries rejects with the armed value
  await expect(mock.entries(db)).rejects.toBe(armedError)

  // Test: the other nine guarded members still reject with the reset error
  const guardedCalls: [string, () => Promise<unknown>][] = [
    ['del', () => mock.del(db, 'some-key')],
    ['delMany', () => mock.delMany(db, ['some-key'])],
    ['get', () => mock.get(db, 'some-key')],
    ['getMany', () => mock.getMany(db, ['some-key'])],
    ['getMeta', () => mock.getMeta(db)],
    ['keys', () => mock.keys(db)],
    ['set', () => mock.set(db, 'some-key', 'some value')],
    ['setMany', () => mock.setMany(db, [['some-key', 'some value']])],
    ['setMeta', () => mock.setMeta(db, { note: 'some note' })],
  ]

  for (const [name, call] of guardedCalls) {
    await expect(call(), name).rejects.toBeInstanceOf(
      actual.GetSetDelResetError,
    )
  }
})

it('acts on the backing store when simulateStoreReset runs while stubbed', async () => {
  // Test prep: create a store with data and stub the store
  const mock = createGetSetDelMock(actual)
  const db = await mock.createStore(PrivateDB1)

  await mock.set(db, 'some-key', 'some value')

  mock.stubStore()

  // Test: the stub keeps answering
  await mock.simulateStoreReset(db)

  expect(await mock.entries(db)).toStrictEqual([])

  // Test: the reset is visible once stubbing is disarmed
  mock.resetGetSetDelMock()

  await expect(mock.entries(db)).rejects.toBeInstanceOf(
    actual.GetSetDelResetError,
  )
})

it('disarms both controls and restores no data on resetGetSetDelMock', async () => {
  // Test prep: it is safe to call with nothing armed
  const mock = createGetSetDelMock(actual)

  mock.resetGetSetDelMock()

  const db = await mock.createStore(PrivateDB1)

  await mock.set(db, 'some-key', 'some value')

  // Test prep: arm both controls and reset the store
  mock.failEntriesWith(new Error('read failed'))
  mock.stubStore()
  await mock.simulateStoreReset(db)

  // Test
  mock.resetGetSetDelMock()

  // Test: both controls are disarmed, so the reset error surfaces
  await expect(mock.entries(db)).rejects.toBeInstanceOf(
    actual.GetSetDelResetError,
  )

  // Test: the data is gone rather than restored
  const freshDB = await mock.createStore(PrivateDB1)

  expect(await mock.entries(freshDB)).toStrictEqual([])
})

it('keeps fault state independent between factory instances', async () => {
  // Test prep: create two mocks over the same module
  const mockA = createGetSetDelMock(actual)
  const mockB = createGetSetDelMock(actual)

  const db = await mockA.createStore(PrivateDB1)

  await mockA.set(db, 'some-key', 'some value')

  // Test
  mockA.failEntriesWith(new Error('read failed'))
  mockA.stubStore()

  expect(await mockB.entries(db)).toStrictEqual([['some-key', 'some value']])
  expect(await mockB.get(db, 'some-key')).toBe('some value')

  const tokenB = await mockB.createStore(PrivateDB1)

  expect(tokenB.dbName).toBe('getsetdel-private-db-1')
})

it('holds stubbing across a retry loop driven by fake timers', async () => {
  // Test prep: stub the store with fake timers installed
  const mock = createGetSetDelMock(actual)

  vi.useFakeTimers()
  mock.stubStore()

  // Test: the loop settles without advancing timers
  const attempts: string[] = []

  for (let attempt = 0; attempt < 5; attempt++) {
    const token = await mock.createStore(PrivateDB1)
    const storeEntries = await mock.entries(token)
    const value = await mock.get(token, 'some-key')

    attempts.push(
      `${token.dbName}:${String(storeEntries.length)}:${String(value)}`,
    )
  }

  expect(attempts).toStrictEqual([
    'getsetdel-stubbed-store:0:undefined',
    'getsetdel-stubbed-store:0:undefined',
    'getsetdel-stubbed-store:0:undefined',
    'getsetdel-stubbed-store:0:undefined',
    'getsetdel-stubbed-store:0:undefined',
  ])
  expect(testGetMockIndexedDBData()).toMatchInlineSnapshot(`{}`)
})
