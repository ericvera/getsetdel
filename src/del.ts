import { delMany } from 'idb-keyval'
import { checkStoreState } from './internal/checkStoreState.js'
import { GetSetValStoreToken } from './types.js'

export const del = async (
  storeToken: GetSetValStoreToken,
  keys: string[],
): Promise<void> => {
  await checkStoreState(storeToken)

  return delMany(keys, storeToken.store)
}
