import { keys as libKeys } from 'idb-keyval'
import { getStore } from './internal/getStore.js'
import { GetSetValStoreInfo } from './types.js'

export const keys = async (storeInfo: GetSetValStoreInfo): Promise<string[]> =>
  libKeys(await getStore(storeInfo))
