import { keys as idbKeys } from 'idb-keyval'
import { checkStoreState } from './internal/checkStoreState.js'
import { GetSetValStoreToken } from './types.js'

export const keys = async (
  storeToken: GetSetValStoreToken,
): Promise<string[]> => {
  await checkStoreState(storeToken)

  return idbKeys(storeToken.store)
}
