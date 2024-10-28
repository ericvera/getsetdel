import { checkStoreState } from './internal/checkStoreState.js'
import { GetSetValStoreToken } from './types.js'

/**
 * First checks that the store has not been reset by another instance. If the
 * store has been reset, the function throws a GetSetValResetError. If the store
 * has not been reset, the function returns the metadata of the store.
 */
export const getMeta = async <TMeta = Record<string, unknown>>(
  storeToken: GetSetValStoreToken,
): Promise<TMeta | undefined> => {
  const storeDetails = await checkStoreState<TMeta>(storeToken)

  return storeDetails.meta
}
