import { expect, it } from 'vitest'
import { testGetMockIndexedDBData } from './__mocks__/idb-keyval.js'
import {
  AllDetailsDB,
  InfoDBWithKey1,
  InfoDBWithKey2,
  PublicDB,
} from './__test__/constants.js'
import { createStore, set } from './index.js'

it('clears store if version is different', async () => {
  // Test prep: create a store
  const db = await createStore(AllDetailsDB)

  // Test prep: add some data to the store
  await set(db, [['some-key', { message: 'hello' }]])

  // Test
  await createStore({ ...AllDetailsDB, version: 2 })

  expect(testGetMockIndexedDBData()).toMatchInlineSnapshot(`
    {
      "getsetval-all-details-db--000": {
        "store": {},
      },
      "getsetval-inventory": {
        "store": {
          "getsetval-all-details-db--000": "{"name":"all-details-db","key":"000","tags":["private","public"],"version":2,"creation":1732194735000}",
        },
      },
    }
  `)
})

it('clears store if tags are different', async () => {
  // Test prep: create a store
  const db = await createStore(AllDetailsDB)

  // Test prep: add some data to the store
  await set(db, [['some-key', { message: 'hello' }]])

  // Test
  await createStore({ ...AllDetailsDB, tags: ['tag1', 'tag2'] })

  // Expect no keys and tags updated to tag1 and tag2
  expect(testGetMockIndexedDBData()).toMatchInlineSnapshot(`
    {
      "getsetval-all-details-db--000": {
        "store": {},
      },
      "getsetval-inventory": {
        "store": {
          "getsetval-all-details-db--000": "{"name":"all-details-db","key":"000","tags":["tag1","tag2"],"version":1,"creation":1732194735000}",
        },
      },
    }
  `)
})

it('works when all data is valid and the store is new', async () => {
  await createStore(AllDetailsDB)

  expect(testGetMockIndexedDBData()).toMatchInlineSnapshot(`
    {
      "getsetval-all-details-db--000": {
        "store": {},
      },
      "getsetval-inventory": {
        "store": {
          "getsetval-all-details-db--000": "{"name":"all-details-db","key":"000","tags":["private","public"],"version":1,"creation":1732194735000}",
        },
      },
    }
  `)
})

it('works when all data is valid and the store already exists', async () => {
  // Test prep: create a couple of other stores
  await createStore(AllDetailsDB)
  await createStore(InfoDBWithKey2)
  await createStore(InfoDBWithKey1)
  await createStore(PublicDB)

  // Test
  const before = testGetMockIndexedDBData()

  await createStore(PublicDB)

  const after = testGetMockIndexedDBData()

  expect(before).toEqual(after)
})
