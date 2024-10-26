import { setMany } from 'idb-keyval'
import { checkStoreState } from './internal/checkStoreState.js'
import { GetSetValStoreToken } from './types.js'

export const set = async <T>(
  storeToken: GetSetValStoreToken,
  entries: [string, T][],
): Promise<void> => {
  await checkStoreState(storeToken)

  return setMany(entries, storeToken.store)
}
