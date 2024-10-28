import { entries as idbEntries } from 'idb-keyval'
import { checkStoreState } from './internal/checkStoreState.js'
import { GetSetValStoreToken } from './types.js'

/**
 * First checks that the store has not been reset by another instance. If the
 * store has been reset, the function throws a GetSetValResetError. If the store
 * has not been reset, the function returns all key-value pairs in the store.
 */
export const entries = async <T>(
  storeToken: GetSetValStoreToken,
): Promise<[string, T][]> => {
  await checkStoreState(storeToken)

  return idbEntries(storeToken.store)
}
