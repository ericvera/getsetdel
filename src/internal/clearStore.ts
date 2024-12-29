import { clear, createStore, del } from 'idb-keyval'
import { createInventoryStore, StoreName } from './constants.js'

export const clearStore = async (dbName: string): Promise<void> => {
  // Clear the data
  const storeToClear = createStore(dbName, StoreName)
  await clear(storeToClear)

  // NOTE: This may be called as part of resetting a store because for example
  // the version or tags have changed. In this case, we want to clear the data,
  // but not delete the database as this will block any further actions on the
  // database.

  // Delete the inventory entry
  await del(dbName, createInventoryStore())
}
