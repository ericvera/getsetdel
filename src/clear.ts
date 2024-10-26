import { clearStore } from './internal/clearStore.js'
import { GetSetValStoreToken } from './types.js'

/**
 * Clears all data from the specified stores and removes them from the
 * inventory. Since the data is being removed, there is no check about the state
 * of the store.
 */
export const clear = async (
  storeTokens: GetSetValStoreToken[],
): Promise<void> => {
  await Promise.all(storeTokens.map(async (token) => clearStore(token.dbName)))
}
