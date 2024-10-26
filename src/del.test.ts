import { expect, it } from 'vitest'
import { testGetMockIndexedDBData } from './__mocks__/idb-keyval.js'
import { AllDetailsDB, PrivateDB2 } from './__test__/constants.js'
import { createStore, del, set } from './index.js'

it("throws if the store tags don't match", async () => {
  // Test prep: create a store with tags ['private']
  const db = await createStore(PrivateDB2)

  // Test prep: simulate a change in the store tags on a different instance
  // of the store
  await createStore({ ...PrivateDB2, tags: ['private', 'public'] })

  await expect(del(db, ['key1'])).rejects.toThrowErrorMatchingInlineSnapshot(
    `[Error: A reset of the store 'getsetval-private-db-2' is required. (Reason: tags mismatch)]`,
  )
})

it('can delete a key from a store', async () => {
  // Test prep: set some data
  const db = await createStore(PrivateDB2)
  await set(db, [
    ['key1', { message: 'hello' }],
    ['key2', { message: 'world' }],
  ])

  // Test
  await del(db, ['key1'])

  expect(testGetMockIndexedDBData()).toMatchInlineSnapshot(`
    {
      "getsetval-inventory": {
        "store": {
          "getsetval-private-db-2": "{"name":"private-db-2","tags":["private"],"version":1,"creation":1732194735000}",
        },
      },
      "getsetval-private-db-2": {
        "store": {
          "key2": "{"message":"world"}",
        },
      },
    }
  `)
})

it('does not affect other stores with same keys', async () => {
  // Test prep: set some data
  const db1 = await createStore(PrivateDB2)
  await set(db1, [
    ['key1', { message: 'hello' }],
    ['key2', { message: 'world' }],
  ])

  const db2 = await createStore(AllDetailsDB)
  await set(db2, [
    ['key1', { message: 'hello' }],
    ['key2', { message: 'world' }],
  ])

  // Test
  await del(db1, ['key1', 'key2'])
  expect(testGetMockIndexedDBData()).toMatchInlineSnapshot(`
    {
      "getsetval-all-details-db--000": {
        "store": {
          "key1": "{"message":"hello"}",
          "key2": "{"message":"world"}",
        },
      },
      "getsetval-inventory": {
        "store": {
          "getsetval-all-details-db--000": "{"name":"all-details-db","key":"000","tags":["private","public"],"version":1,"creation":1732194735000}",
          "getsetval-private-db-2": "{"name":"private-db-2","tags":["private"],"version":1,"creation":1732194735000}",
        },
      },
      "getsetval-private-db-2": {
        "store": {},
      },
    }
  `)
})

it('does not throw is a key does not exist', async () => {
  // Test prep: set some data
  const db = await createStore(PrivateDB2)
  await set(db, [
    ['key1', { message: 'hello' }],
    ['key2', { message: 'world' }],
  ])

  // Test
  await del(db, ['key3'])
  expect(testGetMockIndexedDBData()).toMatchInlineSnapshot(`
    {
      "getsetval-inventory": {
        "store": {
          "getsetval-private-db-2": "{"name":"private-db-2","tags":["private"],"version":1,"creation":1732194735000}",
        },
      },
      "getsetval-private-db-2": {
        "store": {
          "key1": "{"message":"hello"}",
          "key2": "{"message":"world"}",
        },
      },
    }
  `)
})
