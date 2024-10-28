import { set as idbSet } from 'idb-keyval'
import { checkStoreState } from './internal/checkStoreState.js'
import { GetSetDelStoreToken } from './types.js'

/**
 * First checks that the store has not been reset by another instance. If the
 * store has been reset, the function throws a GetSetDelResetError. If the store
 * has not been reset, the function sets the value of the key in the store.
 */
export const set = async (
  storeToken: GetSetDelStoreToken,
  key: string,
  value: unknown,
): Promise<void> => {
  await checkStoreState(storeToken)

  return idbSet(key, value, storeToken.store)
}
