import { expect, it } from 'vitest'
import {
  set as setInBackend,
  testGetMockIndexedDBData,
} from './__mocks__/idb-keyval.js'
import {
  AllDetailsDB,
  InfoDBWithKey1,
  InfoDBWithKey2,
  PrivateDB1,
  PrivateDB2,
  PublicDB,
} from './__test__/constants.js'
import { createStore, GetSetDelStoreToken, queryInventory } from './index.js'

const ProbeKey = 'handle-probe'

type MockIndexedDBData = Record<
  string,
  Record<string, Record<string, unknown> | undefined> | undefined
>

const getProbeValue = (dbName: string) => `probe for ${dbName}`

/**
 * Drops the store handle. It is an opaque function, so a snapshot cannot show
 * which database it addresses. `expectHandlesToAddressTheirDatabases` covers
 * that instead.
 */
const withoutStore = ({
  store,
  ...token
}: GetSetDelStoreToken): Omit<GetSetDelStoreToken, 'store'> => token

/**
 * Confirms every token's store handle addresses the database that the token
 * names: a probe written through the handle has to land under that database
 * name in the backing data.
 */
const expectHandlesToAddressTheirDatabases = async (
  tokens: GetSetDelStoreToken[],
): Promise<void> => {
  for (const token of tokens) {
    await setInBackend(ProbeKey, getProbeValue(token.dbName), token.store)
  }

  const data = testGetMockIndexedDBData() as MockIndexedDBData

  expect(
    tokens.map((token) => data[token.dbName]?.['store']?.[ProbeKey]),
  ).toEqual(tokens.map((token) => getProbeValue(token.dbName)))
}

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
  const result = await queryInventory()

  expect(result.map(withoutStore)).toMatchInlineSnapshot(`
    [
      {
        "creation": 1732194735000,
        "dbName": "getsetdel-private-db-1",
        "tags": [
          "private",
        ],
        "version": 1,
      },
      {
        "creation": 1732194735000,
        "dbName": "getsetdel-private-db-2",
        "tags": [
          "private",
        ],
        "version": 1,
      },
      {
        "creation": 1732194735000,
        "dbName": "getsetdel-all-details-db--000",
        "key": "000",
        "tags": [
          "private",
          "public",
        ],
        "version": 1,
      },
    ]
  `)

  await expectHandlesToAddressTheirDatabases(result)
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
  const result = await queryInventory({
    includesAnyTag: ['private', 'tag2'],
  })

  expect(result.map(withoutStore)).toMatchInlineSnapshot(`
    [
      {
        "creation": 1732194735000,
        "dbName": "getsetdel-private-db-1",
        "tags": [
          "private",
        ],
        "version": 1,
      },
      {
        "creation": 1732194735000,
        "dbName": "getsetdel-private-db-2",
        "tags": [
          "private",
        ],
        "version": 1,
      },
      {
        "creation": 1732194735000,
        "dbName": "getsetdel-all-details-db--000",
        "key": "000",
        "tags": [
          "private",
          "public",
        ],
        "version": 1,
      },
    ]
  `)

  await expectHandlesToAddressTheirDatabases(result)
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
  const result = await queryInventory({
    name: 'info-db',
  })

  expect(result.map(withoutStore)).toMatchInlineSnapshot(`
    [
      {
        "creation": 1732194735000,
        "dbName": "getsetdel-info-db--000",
        "key": "000",
      },
      {
        "creation": 1732194735000,
        "dbName": "getsetdel-info-db--111",
        "key": "111",
      },
    ]
  `)

  await expectHandlesToAddressTheirDatabases(result)
})

it('works when there are entries in inventory (with all tags) and there are matches', async () => {
  // Test prep: add a few entries to inventory
  await createStore(PrivateDB1)
  await createStore(PrivateDB2)
  await createStore(AllDetailsDB)
  await createStore(PublicDB)
  await createStore(InfoDBWithKey1)
  await createStore(InfoDBWithKey2)

  // Test
  const result = await queryInventory({
    includesAllTags: ['private', 'public'],
  })

  expect(result.map(withoutStore)).toMatchInlineSnapshot(`
    [
      {
        "creation": 1732194735000,
        "dbName": "getsetdel-all-details-db--000",
        "key": "000",
        "tags": [
          "private",
          "public",
        ],
        "version": 1,
      },
    ]
  `)

  await expectHandlesToAddressTheirDatabases(result)
})

it('works when there are entries in inventory (with key) and there are matches', async () => {
  // Test prep: add a few entries to inventory
  await createStore(PrivateDB1)
  await createStore(PrivateDB2)
  await createStore(AllDetailsDB)
  await createStore(PublicDB)
  await createStore(InfoDBWithKey1)
  await createStore(InfoDBWithKey2)

  // Test
  const result = await queryInventory({
    name: InfoDBWithKey1.name,
  })

  expect(result.map(withoutStore)).toMatchInlineSnapshot(`
    [
      {
        "creation": 1732194735000,
        "dbName": "getsetdel-info-db--000",
        "key": "000",
      },
      {
        "creation": 1732194735000,
        "dbName": "getsetdel-info-db--111",
        "key": "111",
      },
    ]
  `)

  await expectHandlesToAddressTheirDatabases(result)
})
