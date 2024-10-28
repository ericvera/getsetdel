import { delMany as idbDelMany } from 'idb-keyval'
import { checkStoreState } from './internal/checkStoreState.js'
import { GetSetValStoreToken } from './types.js'

/**
 * First checks that the store has not been reset by another instance. If the
 * store has been reset, the function throws a GetSetValResetError. If the store
 * has not been reset, the function deletes the keys from the store.
 */
export const delMany = async (
  storeToken: GetSetValStoreToken,
  keys: string[],
): Promise<void> => {
  await checkStoreState(storeToken)

  return idbDelMany(keys, storeToken.store)
}
