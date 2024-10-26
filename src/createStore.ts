import { get, createStore as idbCreateStore, set } from 'idb-keyval'
import { arraysContainSameValues } from './internal/arraysContainSameValues.js'
import { clearStore } from './internal/clearStore.js'
import { createInventoryStore, StoreName } from './internal/constants.js'
import { getDBName } from './internal/getDBName.js'
import {
  GetSetValStoreInfo,
  GetSetValStoreInfoData,
  GetSetValStoreToken,
} from './types.js'

/**
 * Creates a new store or updates an existing one and returns a token that can
 * be used to interact with the store. As part of the creation process, the
 * function checks if the store needs to be reset. A reset happens if the
 * version or the tags provided in storeInfo are different from the ones defined
 * in the inventory.
 * @param storeInfo Information about the store.
 */
export const createStore = async (storeInfo: GetSetValStoreInfo) => {
  const dbName = getDBName(storeInfo)
  const inventoryStore = createInventoryStore()

  // Get local inventory details
  let storeDetails = await get<GetSetValStoreInfoData>(
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

  // Create GetSetVal token
  const token: GetSetValStoreToken = {
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
