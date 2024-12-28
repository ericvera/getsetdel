import { expect, it } from 'vitest'
import { testGetMockIndexedDBData } from './__mocks__/idb-keyval.js'
import { AllDetailsDB, PublicDB } from './__test__/constants.js'
import { createStore, set, setMeta } from './index.js'

it('can set single item (key did not exist before)', async () => {
  const db = await createStore(PublicDB)
  await set(db, 'some-key-1', { message: 'hello 1' })

  expect(testGetMockIndexedDBData()).toMatchInlineSnapshot(`
    {
      "getsetdel-inventory": {
        "store": {
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

it('can set multiple item', async () => {
  const db = await createStore(AllDetailsDB)
  await set(db, 'some-key-1', { message: 'hello 1' })
  await set(db, 'some-key-2', { message: 'hello 2' })

  expect(testGetMockIndexedDBData()).toMatchInlineSnapshot(`
    {
      "getsetdel-all-details-db--000": {
        "store": {
          "some-key-1": "{"message":"hello 1"}",
          "some-key-2": "{"message":"hello 2"}",
        },
      },
      "getsetdel-inventory": {
        "store": {
          "getsetdel-all-details-db--000": "{"name":"all-details-db","creation":1732194735000,"key":"000","version":1,"tags":["private","public"]}",
        },
      },
    }
  `)
})

it('can set multiple items after they are already set and does not clear meta', async () => {
  // Test prep: set some items
  const db1 = await createStore(AllDetailsDB)
  await set(db1, 'some-key-1', { message: 'hello key 1 v1' })
  await set(db1, 'some-key-2', { message: 'hello key 2 v1' })

  // Test prep: set some meta
  await setMeta(db1, { someMeta: 'some-meta', other: 123 })

  // Test
  await set(db1, 'some-key-1', { message: 'hello key 1 v2' })

  expect(testGetMockIndexedDBData()).toMatchInlineSnapshot(`
    {
      "getsetdel-all-details-db--000": {
        "store": {
          "some-key-1": "{"message":"hello key 1 v2"}",
          "some-key-2": "{"message":"hello key 2 v1"}",
        },
      },
      "getsetdel-inventory": {
        "store": {
          "getsetdel-all-details-db--000": "{"name":"all-details-db","creation":1732194735000,"key":"000","version":1,"tags":["private","public"],"meta":{"someMeta":"some-meta","other":123}}",
        },
      },
    }
  `)
})
