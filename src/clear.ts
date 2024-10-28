import { clearStore } from './internal/clearStore.js'
import { GetSetDelStoreToken } from './types.js'

/**
 * Clears all data from the specified store and removes it from the
 * inventory. Since the data is being removed, there is no check about the state
 * of the store.
 */
export const clear = async (storeToken: GetSetDelStoreToken): Promise<void> => {
  await clearStore(storeToken.dbName)
}
