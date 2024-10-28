import { get } from 'idb-keyval'
import { GetSetDelResetError } from '../GetSetDelResetError.js'
import { GetSetDelStoreInfoData, GetSetDelStoreToken } from '../types.js'
import { arraysContainSameValues } from './arraysContainSameValues.js'
import { createInventoryStore } from './constants.js'

/**
 * Checks if the store needs to be reset. A reset happens if the version, the
 * tags, or the creation time contained in the store token are different from
 * the ones defined in the inventory.
 * @param storeToken Token that represents the store and the details at the time
 * of creation.
 * @throws {GetSetDelResetError} If the store needs to be reset.
 * @returns The store details.
 */
export const checkStoreState = async <TMeta = Record<string, unknown>>(
  storeToken: GetSetDelStoreToken,
) => {
  // Get current inventory info
  const storeDetails = await get<GetSetDelStoreInfoData<TMeta>>(
    storeToken.dbName,
    createInventoryStore(),
  )

  // Check if the version or the tags are different
  if (!storeDetails) {
    // Reset required
    throw new GetSetDelResetError(storeToken.dbName, 'store was deleted')
  }

  if (storeDetails.version !== storeToken.version) {
    // Reset required
    throw new GetSetDelResetError(storeToken.dbName, 'version mismatch')
  }

  if (storeDetails.creation !== storeToken.creation) {
    // Reset required
    throw new GetSetDelResetError(storeToken.dbName, 'creation time mismatch')
  }

  if (!arraysContainSameValues(storeDetails.tags, storeToken.tags)) {
    // Reset required
    throw new GetSetDelResetError(storeToken.dbName, 'tags mismatch')
  }

  return storeDetails
}
