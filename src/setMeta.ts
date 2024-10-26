import { set } from 'idb-keyval'
import { checkStoreState } from './internal/checkStoreState.js'
import { createInventoryStore } from './internal/constants.js'
import { GetSetValStoreToken } from './types.js'

/**
 * Replaces the value of the specified property in the store's meta object.
 */
export const setMeta = async (
  storeToken: GetSetValStoreToken,
  meta: Record<string, unknown>,
): Promise<void> => {
  const storeDetails = await checkStoreState(storeToken)

  await set(
    storeToken.dbName,
    {
      ...storeDetails,
      meta,
    },
    createInventoryStore(),
  )
}
