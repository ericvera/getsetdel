import { expect, it } from 'vitest'
import { testGetMockIndexedDBData } from './__mocks__/idb-keyval.js'
import { AllDetailsDB, PrivateDB2, PublicDB } from './__test__/constants.js'
import { clear, createStore } from './index.js'

it("does not throw if the store tags don't match", async () => {
  // Test prep: create a store with tags ['private']
  const db = await createStore(PrivateDB2)

  // Test prep: simulate a change in the store tags on a different instance
  // of the store
  await createStore({ ...PrivateDB2, tags: ['private', 'public'] })

  await clear(db)

  expect(testGetMockIndexedDBData()).toMatchInlineSnapshot(`
    {
      "getsetdel-inventory": {
        "store": {},
      },
      "getsetdel-private-db-2": {
        "store": {},
      },
    }
  `)
})

it('can clear multiple stores', async () => {
  // Test prep: create a store with tags ['private']
  const db1 = await createStore(PrivateDB2)

  // Test prep: create a store with tags ['public']
  await createStore(PublicDB)

  // Test prep: create a store with all details
  const db3 = await createStore(AllDetailsDB)

  // Test
  await clear(db1)
  await clear(db3)

  expect(testGetMockIndexedDBData()).toMatchInlineSnapshot(`
    {
      "getsetdel-all-details-db--000": {
        "store": {},
      },
      "getsetdel-inventory": {
        "store": {
          "getsetdel-public-db": "{"name":"public-db","creation":1732194735000}",
        },
      },
      "getsetdel-private-db-2": {
        "store": {},
      },
      "getsetdel-public-db": {
        "store": {},
      },
    }
  `)
})

it('does not throw if the store does not exist', async () => {
  // Test prep: create a store with tags ['private']
  const db = await createStore(PrivateDB2)

  // Test
  await clear(db)

  expect(testGetMockIndexedDBData()).toMatchInlineSnapshot(`
    {
      "getsetdel-inventory": {
        "store": {},
      },
      "getsetdel-private-db-2": {
        "store": {},
      },
    }
  `)
})
