import { entries as idbEntries } from 'idb-keyval'
import { checkStoreState } from './internal/checkStoreState.js'
import { GetSetDelStoreToken } from './types.js'

/**
 * First checks that the store has not been reset by another instance. If the
 * store has been reset, the function throws a GetSetDelResetError. If the store
 * has not been reset, the function returns all key-value pairs in the store.
 */
export const entries = async <T>(
  storeToken: GetSetDelStoreToken,
): Promise<[string, T][]> => {
  await checkStoreState(storeToken)

  return idbEntries(storeToken.store)
}
