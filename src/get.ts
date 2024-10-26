import { getMany } from 'idb-keyval'
import { checkStoreState } from './internal/checkStoreState.js'
import { GetSetValStoreToken } from './types.js'

export const get = async <T>(
  storeToken: GetSetValStoreToken,
  keys: string[],
): Promise<T[]> => {
  await checkStoreState(storeToken)

  return getMany(keys, storeToken.store)
}
