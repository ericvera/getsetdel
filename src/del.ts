import { delMany as libDelMany } from 'idb-keyval'
import { getStore } from './internal/getStore.js'
import { GetSetValStoreInfo } from './types.js'

export const del = async (
  storeInfo: GetSetValStoreInfo,
  keys: string[],
): Promise<void> => libDelMany(keys, await getStore(storeInfo))
