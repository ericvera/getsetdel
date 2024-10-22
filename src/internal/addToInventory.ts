import { set } from 'idb-keyval'
import { GetSetValStoreInfo } from '../types.js'
import { InventoryStore } from './constants.js'
import { getDBName } from './getDBName.js'

// NOTE: Firefox does not support indexedDB.databases() because of this we need
// to keep track of the created databases so that we can delete them on log-out.
export const addToInventory = async (
  storeInfo: GetSetValStoreInfo,
): Promise<void> => {
  // NOTE: DO NOT CALL getStore here as it will result in an infinite loop!
  await set(getDBName(storeInfo), storeInfo, InventoryStore)
}
