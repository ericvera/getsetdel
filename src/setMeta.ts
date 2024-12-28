import { set } from 'idb-keyval'
import { checkStoreState } from './internal/checkStoreState.js'
import { createInventoryStore } from './internal/constants.js'
import { GetSetDelStoreToken } from './types.js'

/**
 * First checks that the store has not been reset by another instance. If the
 * store has been reset, the function throws a GetSetDelResetError. If the store
 * has not been reset, the function sets the meta of the store. WARNING: It will
 * replace the existing meta with the new meta rather than merging the two.
 */
// Disable this rule because we need to use the type parameter to ensure that
// the meta object is a valid type (known edge case in the rules documentation).
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const setMeta = async <T>(
  storeToken: GetSetDelStoreToken,
  meta: T,
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
