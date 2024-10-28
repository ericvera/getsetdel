import { set } from 'idb-keyval'
import { checkStoreState } from './internal/checkStoreState.js'
import { createInventoryStore } from './internal/constants.js'
import { GetSetValStoreToken } from './types.js'

/**
 * First checks that the store has not been reset by another instance. If the
 * store has been reset, the function throws a GetSetValResetError. If the store
 * has not been reset, the function sets the meta of the store. WARNING: It will
 * replace the existing meta with the new meta rather than merging the two.
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
