import { expect, it } from 'vitest'
import { PrivateDB1 } from './__test__/constants.js'
import { clear, createStore, entries, set } from './index.js'

it('throws if the db has been deleted', async () => {
  // Test prep: create a db
  const db = await createStore(PrivateDB1)

  // Test prep: delete the db
  await clear([db])

  // Test
  await expect(entries(db)).rejects.toMatchInlineSnapshot(
    `[Error: A reset of the store 'getsetval-private-db-1' is required. (Reason: store was deleted)]`,
  )
})

it('returns empty array when no keys are set', async () => {
  // Test prep: create a db
  const db = await createStore(PrivateDB1)

  // Test
  expect(await entries(db)).toMatchInlineSnapshot(`[]`)
})

it('returns all entries for a given db', async () => {
  // Test prep: set some values
  const db = await createStore(PrivateDB1)

  await set(db, [
    ['some-key-1', { message: 'hello 1' }],
    ['some-key-2', { message: 'hello 2' }],
    ['some-key-3', { message: 'hello 3', version: 42 }],
  ])

  // Test
  expect(await entries(db)).toMatchInlineSnapshot(`
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
      [
        "some-key-3",
        {
          "message": "hello 3",
          "version": 42,
        },
      ],
    ]
  `)
})
