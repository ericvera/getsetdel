import { createStore, UseStore } from 'idb-keyval'

export const DBNamePrefix = 'getsetval-'
export const DBNameSuffix = '--'
export const LocalDBStoreInventoryName = 'getsetval-inventory'
export const StoreName = 'store'

export const createInventoryStore = (): UseStore =>
  createStore(LocalDBStoreInventoryName, StoreName)
