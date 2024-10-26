import { expect, it, vi } from 'vitest'
import { AllDetailsDB } from './__test__/constants.js'
import { getMeta } from './getMeta.js'
import { clear, createStore, setMeta } from './index.js'

it('throws if store needs to be reset (due to creation time)', async () => {
  vi.useRealTimers()
  vi.useFakeTimers()

  // Test prep: create store
  const db = await createStore(AllDetailsDB)

  // Test prep: reset store
  await clear([db])

  vi.advanceTimersByTime(1000)

  // Test prep: init store
  await createStore(AllDetailsDB)

  // Test
  await expect(getMeta(db)).rejects.toThrowErrorMatchingInlineSnapshot(
    `[Error: A reset of the store 'getsetval-all-details-db--000' is required. (Reason: creation time mismatch)]`,
  )
})

it('works when metadata has not been set', async () => {
  // Test prep: create store
  const db = await createStore(AllDetailsDB)

  // Test
  await expect(getMeta(db)).resolves.toBeUndefined()
})

it('works when the metadata has been set', async () => {
  // Test prep: create store
  const db = await createStore(AllDetailsDB)

  // Test prep: set metadata
  await setMeta(db, { someMeta: 'some-meta' })

  // Test
  await expect(getMeta(db)).resolves.toMatchInlineSnapshot(`
    {
      "someMeta": "some-meta",
    }
  `)
})
