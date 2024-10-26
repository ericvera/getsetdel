import { entries as idbEntries } from 'idb-keyval'
import { checkStoreState } from './internal/checkStoreState.js'
import { GetSetValStoreToken } from './types.js'

export const entries = async <T>(
  storeToken: GetSetValStoreToken,
): Promise<[string, T][]> => {
  await checkStoreState(storeToken)

  return idbEntries(storeToken.store)
}
