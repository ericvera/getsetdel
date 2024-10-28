import { createStore, UseStore } from 'idb-keyval'

export const DBNamePrefix = 'getsetdel-'
export const DBNameSuffix = '--'
export const LocalDBStoreInventoryName = 'getsetdel-inventory'
export const StoreName = 'store'

export const createInventoryStore = (): UseStore =>
  createStore(LocalDBStoreInventoryName, StoreName)
