import { keys as idbKeys } from 'idb-keyval'
import { checkStoreState } from './internal/checkStoreState.js'
import { GetSetDelStoreToken } from './types.js'

/**
 * First checks that the store has not been reset by another instance. If the
 * store has been reset, the function throws a GetSetDelResetError. If the store
 * has not been reset, the function returns all keys in the store.
 */
export const keys = async (
  storeToken: GetSetDelStoreToken,
): Promise<string[]> => {
  await checkStoreState(storeToken)

  return idbKeys(storeToken.store)
}
