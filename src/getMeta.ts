import { checkStoreState } from './internal/checkStoreState.js'
import { GetSetValStoreToken } from './types.js'

export const getMeta = async <TMeta = Record<string, unknown>>(
  storeToken: GetSetValStoreToken,
): Promise<TMeta | undefined> => {
  const storeDetails = await checkStoreState<TMeta>(storeToken)

  return storeDetails.meta
}
