import { getMany as idbGetMany } from 'idb-keyval'
import { checkStoreState } from './internal/checkStoreState.js'
import { GetSetValStoreToken } from './types.js'

/**
 * First checks that the store has not been reset by another instance. If the
 * store has been reset, the function throws a GetSetValResetError. If the store
 * has not been reset, the function returns the values of the keys in the store.
 */
export const getMany = async <T>(
  storeToken: GetSetValStoreToken,
  keys: string[],
): Promise<T[]> => {
  await checkStoreState(storeToken)

  return idbGetMany(keys, storeToken.store)
}
