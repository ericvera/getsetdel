import { del as libDel } from 'idb-keyval'
import { GetSetValStoreInfo } from '../types.js'
import { InventoryStore } from './constants.js'
import { getDBName } from './getDBName.js'

export const removeFromInventory = async (
  storeInfo: GetSetValStoreInfo,
): Promise<void> => {
  // NOTE: DO NOT CALL getStore here as it will result in an infinite loop!
  await libDel(getDBName(storeInfo), InventoryStore)
}
