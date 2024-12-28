import { expect, it } from 'vitest'
import { testGetMockIndexedDBData } from './__mocks__/idb-keyval.js'
import {
  AllDetailsDB,
  InfoDBWithKey2,
  PrivateDB2,
  PublicDB,
} from './__test__/constants.js'
import { createStore, setMany, setMeta } from './index.js'

it('throws if store version does not match inventory', async () => {
  // Test prep: create a store
  const db = await createStore(AllDetailsDB)

  // Test prep: simulate a change in the store version on a different instance
  // of the store
  await createStore({ ...AllDetailsDB, version: 2 })

  // Test
  await expect(
    setMeta(db, { someMeta: 'some-meta' }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `[Error: A reset of the store 'getsetdel-all-details-db--000' is required. (Reason: version mismatch)]`,
  )
})

it('can set meta on a non-existing store', async () => {
  // Test prep: create a store
  const db = await createStore(AllDetailsDB)

  // Test
  await setMeta(db, { someMeta: 'some-meta', other: 123 })

  expect(testGetMockIndexedDBData()).toMatchInlineSnapshot(`
    {
      "getsetdel-all-details-db--000": {
        "store": {},
      },
      "getsetdel-inventory": {
        "store": {
          "getsetdel-all-details-db--000": "{"name":"all-details-db","creation":1732194735000,"key":"000","version":1,"tags":["private","public"],"meta":{"someMeta":"some-meta","other":123}}",
        },
      },
    }
  `)
})

it('can set meta on an existing store', async () => {
  const db1 = await createStore(PublicDB)
  await setMany(db1, [['some-key-1', { message: 'hello 1' }]])
  const db2 = await createStore(AllDetailsDB)
  await setMeta(db2, { someMeta: 'some-meta', other: 123 })

  expect(testGetMockIndexedDBData()).toMatchInlineSnapshot(`
    {
      "getsetdel-all-details-db--000": {
        "store": {},
      },
      "getsetdel-inventory": {
        "store": {
          "getsetdel-all-details-db--000": "{"name":"all-details-db","creation":1732194735000,"key":"000","version":1,"tags":["private","public"],"meta":{"someMeta":"some-meta","other":123}}",
          "getsetdel-public-db": "{"name":"public-db","creation":1732194735000}",
        },
      },
      "getsetdel-public-db": {
        "store": {
          "some-key-1": "{"message":"hello 1"}",
        },
      },
    }
  `)
})

it('can set meta multiple times which overwrites the previous one', async () => {
  // Test prep: set meta on test db and other
  const db1 = await createStore(PrivateDB2)
  await setMeta(db1, { someMeta: 'some-meta', other: 123 })
  const db2 = await createStore(InfoDBWithKey2)
  await setMeta(db2, { someMeta: 'some-meta', other: 123 })

  // Test
  await setMeta(db1, { other: 456 })

  // Expect: only the latest meta is stored
  expect(testGetMockIndexedDBData()).toMatchInlineSnapshot(`
    {
      "getsetdel-info-db--111": {
        "store": {},
      },
      "getsetdel-inventory": {
        "store": {
          "getsetdel-info-db--111": "{"name":"info-db","creation":1732194735000,"key":"111","version":0,"meta":{"someMeta":"some-meta","other":123}}",
          "getsetdel-private-db-2": "{"name":"private-db-2","creation":1732194735000,"version":1,"tags":["private"],"meta":{"other":456}}",
        },
      },
      "getsetdel-private-db-2": {
        "store": {},
      },
    }
  `)
})
