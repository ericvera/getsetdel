import { get, createStore as idbCreateStore, set } from 'idb-keyval'
import { arraysContainSameValues } from './internal/arraysContainSameValues.js'
import { clearStore } from './internal/clearStore.js'
import { createInventoryStore, StoreName } from './internal/constants.js'
import { getDBName } from './internal/getDBName.js'
import {
  GetSetDelStoreInfo,
  GetSetDelStoreInfoData,
  GetSetDelStoreToken,
} from './types.js'

/**
 * If the store exists, the function checks if the store needs to be reset. A
 * reset happens if the version or the tags provided in storeInfo parameter are
 * different from the ones defined in the stores inventory. If a reset is
 * required, the function clears all data as well as its details stored in the
 * inventory. If the store does not exist, or if a reset was performed, the
 * function creates a new store and adds it to the inventory including a new
 * creation time. A token contianing the store reference and the creation time
 * is returned which is to be passed to all subsequent GetSetDel functions to
 * ensure that the underlying store has not been reset.
 * @param storeInfo Information about the store.
 */
export const createStore = async (storeInfo: GetSetDelStoreInfo) => {
  const dbName = getDBName(storeInfo)
  const inventoryStore = createInventoryStore()

  // Get local inventory details
  let storeDetails = await get<GetSetDelStoreInfoData>(
    dbName,
    createInventoryStore(),
  )

  if (storeDetails) {
    // Check if version or the tags are different in which case data needs to be
    // reset
    if (
      storeDetails.version !== storeInfo.version ||
      !arraysContainSameValues(storeDetails.tags, storeInfo.tags)
    ) {
      // Clear all data and remove from inventory
      await clearStore(dbName)

      storeDetails = undefined
    }
  }

  if (!storeDetails) {
    storeDetails = {
      ...storeInfo,
      creation: Date.now(),
    }

    // Add to the inventory
    await set(dbName, storeDetails, inventoryStore)
  }

  // Create IDB store
  const store = idbCreateStore(dbName, StoreName)

  // Create GetSetDel token
  const token: GetSetDelStoreToken = {
    dbName,
    store,
    creation: storeDetails.creation,
  }

  if (storeDetails.version !== undefined) {
    token.version = storeDetails.version
  }

  if (storeDetails.tags !== undefined) {
    token.tags = storeDetails.tags
  }

  return token
}
