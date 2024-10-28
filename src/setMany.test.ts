import { expect, it } from 'vitest'
import { testGetMockIndexedDBData } from './__mocks__/idb-keyval.js'
import { AllDetailsDB, PublicDB } from './__test__/constants.js'
import { createStore, setMany, setMeta } from './index.js'

it('can set multiple items', async () => {
  const db = await createStore(PublicDB)
  await setMany(db, [
    ['some-key-1', { message: 'hello 1' }],
    ['some-key-2', { message: 'hello 2' }],
  ])

  expect(testGetMockIndexedDBData()).toMatchInlineSnapshot(`
    {
      "getsetval-inventory": {
        "store": {
          "getsetval-public-db": "{"name":"public-db","creation":1732194735000}",
        },
      },
      "getsetval-public-db": {
        "store": {
          "some-key-1": "{"message":"hello 1"}",
          "some-key-2": "{"message":"hello 2"}",
        },
      },
    }
  `)
})

it('can set multiple items with keys', async () => {
  const db = await createStore(AllDetailsDB)
  await setMany(db, [
    ['some-key-1', { message: 'hello 1' }],
    ['some-key-2', { message: 'hello 2' }],
  ])

  expect(testGetMockIndexedDBData()).toMatchInlineSnapshot(`
    {
      "getsetval-all-details-db--000": {
        "store": {
          "some-key-1": "{"message":"hello 1"}",
          "some-key-2": "{"message":"hello 2"}",
        },
      },
      "getsetval-inventory": {
        "store": {
          "getsetval-all-details-db--000": "{"name":"all-details-db","key":"000","tags":["private","public"],"version":1,"creation":1732194735000}",
        },
      },
    }
  `)
})

it('can set multiple items after they are already set and does not clear meta', async () => {
  // Test prep: set some items
  const db1 = await createStore(AllDetailsDB)
  await setMany(db1, [['some-key-1', { message: 'hello 1' }]])

  // Test prep: set some meta
  await setMeta(db1, { someMeta: 'some-meta', other: 123 })

  // Test
  await setMany(db1, [
    ['some-key-1', { message: 'hello v2' }],
    ['some-key-2', { message: 'hello v1' }],
  ])

  expect(testGetMockIndexedDBData()).toMatchInlineSnapshot(`
    {
      "getsetval-all-details-db--000": {
        "store": {
          "some-key-1": "{"message":"hello v2"}",
          "some-key-2": "{"message":"hello v1"}",
        },
      },
      "getsetval-inventory": {
        "store": {
          "getsetval-all-details-db--000": "{"name":"all-details-db","key":"000","tags":["private","public"],"version":1,"creation":1732194735000,"meta":{"someMeta":"some-meta","other":123}}",
        },
      },
    }
  `)
})
