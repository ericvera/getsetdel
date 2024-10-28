import { del as idbDel } from 'idb-keyval'
import { checkStoreState } from './internal/checkStoreState.js'
import { GetSetValStoreToken } from './types.js'

/**
 * First checks that the store has not been reset by another instance. If the
 * store has been reset, the function throws a GetSetValResetError. If the store
 * has not been reset, the function deletes the key from the store.
 */
export const del = async (
  storeToken: GetSetValStoreToken,
  key: string,
): Promise<void> => {
  await checkStoreState(storeToken)

  return idbDel(key, storeToken.store)
}
