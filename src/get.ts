import { get as idbGet } from 'idb-keyval'
import { checkStoreState } from './internal/checkStoreState.js'
import { GetSetDelStoreToken } from './types.js'

/**
 * First checks that the store has not been reset by another instance. If the
 * store has been reset, the function throws a GetSetDelResetError. If the store
 * has not been reset, the function returns the value of the key in the store.
 */
export const get = async <T>(
  storeToken: GetSetDelStoreToken,
  key: string,
): Promise<T | undefined> => {
  await checkStoreState(storeToken)

  return idbGet(key, storeToken.store)
}
