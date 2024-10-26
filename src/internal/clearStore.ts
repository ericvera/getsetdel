import { clear, createStore, del } from 'idb-keyval'
import { createInventoryStore, StoreName } from './constants.js'

export const clearStore = async (dbName: string): Promise<void> => {
  // Clear the data
  const storeToClear = createStore(dbName, StoreName)
  await clear(storeToClear)

  // Best-effort attempt to delete the database
  try {
    indexedDB.deleteDatabase(dbName)
  } catch {
    // Do nothing
  }

  // Delete the inventory entry
  await del(dbName, createInventoryStore())
}
