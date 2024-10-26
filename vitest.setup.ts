import { beforeEach, vi } from 'vitest'
import { testClearMockIndexedDB } from './src/__mocks__/idb-keyval.js'

vi.mock('idb-keyval', async () => import('./src/__mocks__/idb-keyval.js'))

beforeEach(() => {
  testClearMockIndexedDB()

  vi.useRealTimers()

  // Set system time to ensure consistent test results as created is set based
  // on the current time.
  vi.setSystemTime('2024-11-21T13:12:15.000Z')
})
