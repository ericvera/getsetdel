import { expect, it } from 'vitest'
import { PrivateDB1 } from './__test__/constants.js'
import { createStore, get, set } from './index.js'

it('throws if the version is different', async () => {
  // Test prep: create a db
  const db = await createStore(PrivateDB1)

  // Test prep: set some values
  await createStore({ ...PrivateDB1, version: Date.now() })

  // Test
  await expect(get(db, ['key-1'])).rejects.toMatchInlineSnapshot(
    `[Error: A reset of the store 'getsetval-private-db-1' is required. (Reason: version mismatch)]`,
  )
})

it('does not throw if the keys are not set', async () => {
  // Test prep: create a db
  const db = await createStore(PrivateDB1)

  // Test
  await expect(get(db, ['key-1'])).resolves.toMatchInlineSnapshot(`
    [
      undefined,
    ]
  `)
})

it('returns the values for the given keys', async () => {
  // Test prep: create a db
  const db = await createStore(PrivateDB1)

  // Test prep: set some values
  await set(db, [
    ['key-1', { message: 'hello 1' }],
    ['key-2', { message: 'hello 2' }],
    ['key-3', { message: 'hello 3' }],
  ])

  // Test
  expect(await get(db, ['key-1', 'key-3'])).toMatchInlineSnapshot(`
    [
      {
        "message": "hello 1",
      },
      {
        "message": "hello 3",
      },
    ]
  `)
})
