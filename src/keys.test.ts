import { expect, it } from 'vitest'
import {
  InfoDBWithKey1,
  InfoDBWithKey2,
  PrivateDB1,
  PrivateDB2,
} from './__test__/constants.js'
import { clear, createStore, keys, setMany } from './index.js'

it('throws if the db has been deleted', async () => {
  // Test prep: create a db
  const db = await createStore(PrivateDB1)

  // Test prep: delete the db
  await clear(db)

  // Test
  await expect(keys(db)).rejects.toMatchInlineSnapshot(
    `[Error: A reset of the store 'getsetdel-private-db-1' is required. (Reason: store was deleted)]`,
  )
})

it('returns all keys for a given db', async () => {
  // Test prep: set some values
  const db1 = await createStore(PrivateDB1)
  await setMany(db1, [
    ['some-key-1', { message: 'hello 1' }],
    ['some-key-2', { message: 'hello 2' }],
  ])

  const db2 = await createStore(PrivateDB2)
  await setMany(db2, [
    ['some-key-2', { message: 'hello 1' }],
    ['some-key-4', { message: 'hello 2' }],
  ])

  expect(await keys(db1)).toMatchInlineSnapshot(`
    [
      "some-key-1",
      "some-key-2",
    ]
  `)
  expect(await keys(db2)).toMatchInlineSnapshot(`
    [
      "some-key-2",
      "some-key-4",
    ]
  `)
})

it('returns all keys for a given db with appropriate key', async () => {
  const db1 = await createStore(InfoDBWithKey1)
  await setMany(db1, [
    ['some-key-1', { message: 'hello 1' }],
    ['some-key-2', { message: 'hello 2' }],
  ])
  const db2 = await createStore(InfoDBWithKey2)
  await setMany(db2, [
    ['some-key-2', { message: 'hello 1' }],
    ['some-key-4', { message: 'hello 2' }],
  ])

  await expect(keys(db2)).resolves.toMatchInlineSnapshot(`
      [
        "some-key-2",
        "some-key-4",
      ]
    `)
})
