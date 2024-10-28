import { setMany as idbSetMany } from 'idb-keyval'
import { checkStoreState } from './internal/checkStoreState.js'
import { GetSetValStoreToken } from './types.js'

/**
 * First checks that the store has not been reset by another instance. If the
 * store has been reset, the function throws a GetSetValResetError. If the store
 * has not been reset, the function sets the entries in the store.
 */
export const setMany = async <T>(
  storeToken: GetSetValStoreToken,
  entries: [string, T][],
): Promise<void> => {
  await checkStoreState(storeToken)

  return idbSetMany(entries, storeToken.store)
}
