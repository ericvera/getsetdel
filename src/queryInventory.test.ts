import { expect, it } from 'vitest'
import {
  AllDetailsDB,
  InfoDBWithKey1,
  InfoDBWithKey2,
  PrivateDB1,
  PrivateDB2,
  PublicDB,
} from './__test__/constants.js'
import { createStore, queryInventory } from './index.js'

it('works when there are no entries in inventory (no parameters)', async () => {
  const result = await queryInventory()

  expect(result).toMatchInlineSnapshot(`[]`)
})

it('works when there are no entries in inventory (with parameters)', async () => {
  const result = await queryInventory({
    name: 'test',
    includesAnyTag: ['tag1', 'tag2'],
  })

  expect(result).toMatchInlineSnapshot(`[]`)
})

it('works when there are entries in inventory (no parameters)', async () => {
  // Test prep: add a few entries to inventory
  await createStore(PrivateDB1)
  await createStore(PrivateDB2)
  await createStore(AllDetailsDB)

  // Test
  await expect(queryInventory()).resolves.toMatchInlineSnapshot(`
    [
      {
        "creation": 1732194735000,
        "dbName": "getsetval-private-db-1",
        "store": Store {
          "dbName": "getsetval-private-db-1",
          "storeName": "store",
        },
        "tags": [
          "private",
        ],
        "version": 1,
      },
      {
        "creation": 1732194735000,
        "dbName": "getsetval-private-db-2",
        "store": Store {
          "dbName": "getsetval-private-db-2",
          "storeName": "store",
        },
        "tags": [
          "private",
        ],
        "version": 1,
      },
      {
        "creation": 1732194735000,
        "dbName": "getsetval-all-details-db--000",
        "store": Store {
          "dbName": "getsetval-all-details-db--000",
          "storeName": "store",
        },
        "tags": [
          "private",
          "public",
        ],
        "version": 1,
      },
    ]
  `)
})

it('works when there are entries in inventory (with parameters) and there are no matches', async () => {
  // Test prep: add a few entries to inventory
  await createStore(PrivateDB1)
  await createStore(PrivateDB2)
  await createStore(AllDetailsDB)

  // Test
  await expect(
    queryInventory({
      includesAnyTag: ['tag1', 'tag2'],
    }),
  ).resolves.toMatchInlineSnapshot(`[]`)
})

it('works when there are entries in inventory (with tags) and there are matches', async () => {
  // Test prep: add a few entries to inventory
  await createStore(PrivateDB1)
  await createStore(PrivateDB2)
  await createStore(AllDetailsDB)
  await createStore(PublicDB)

  // Test
  await expect(
    queryInventory({
      includesAnyTag: ['private', 'tag2'],
    }),
  ).resolves.toMatchInlineSnapshot(`
    [
      {
        "creation": 1732194735000,
        "dbName": "getsetval-private-db-1",
        "store": Store {
          "dbName": "getsetval-private-db-1",
          "storeName": "store",
        },
        "tags": [
          "private",
        ],
        "version": 1,
      },
      {
        "creation": 1732194735000,
        "dbName": "getsetval-private-db-2",
        "store": Store {
          "dbName": "getsetval-private-db-2",
          "storeName": "store",
        },
        "tags": [
          "private",
        ],
        "version": 1,
      },
      {
        "creation": 1732194735000,
        "dbName": "getsetval-all-details-db--000",
        "store": Store {
          "dbName": "getsetval-all-details-db--000",
          "storeName": "store",
        },
        "tags": [
          "private",
          "public",
        ],
        "version": 1,
      },
    ]
  `)
})

it('works when there are entries in inventory (with name) and there are matches', async () => {
  // Test prep: add a few entries to inventory
  await createStore(PrivateDB1)
  await createStore(PrivateDB2)
  await createStore(AllDetailsDB)
  await createStore(PublicDB)
  await createStore(InfoDBWithKey1)
  await createStore(InfoDBWithKey2)

  // Test
  await expect(
    queryInventory({
      name: 'info-db',
    }),
  ).resolves.toMatchInlineSnapshot(`
    [
      {
        "creation": 1732194735000,
        "dbName": "getsetval-info-db--000",
        "store": Store {
          "dbName": "getsetval-info-db--000",
          "storeName": "store",
        },
      },
      {
        "creation": 1732194735000,
        "dbName": "getsetval-info-db--111",
        "store": Store {
          "dbName": "getsetval-info-db--111",
          "storeName": "store",
        },
      },
    ]
  `)
})

it('works when there are entries in inventory (with tags) and there are matches', async () => {
  // Test prep: add a few entries to inventory
  await createStore(PrivateDB1)
  await createStore(PrivateDB2)
  await createStore(AllDetailsDB)
  await createStore(PublicDB)
  await createStore(InfoDBWithKey1)
  await createStore(InfoDBWithKey2)

  // Test
  await expect(
    queryInventory({
      includesAllTags: ['private', 'public'],
    }),
  ).resolves.toMatchInlineSnapshot(`
    [
      {
        "creation": 1732194735000,
        "dbName": "getsetval-all-details-db--000",
        "store": Store {
          "dbName": "getsetval-all-details-db--000",
          "storeName": "store",
        },
        "tags": [
          "private",
          "public",
        ],
        "version": 1,
      },
    ]
  `)
})
