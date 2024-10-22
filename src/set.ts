import { setMany as libSetMany } from 'idb-keyval'
import { getStore } from './internal/getStore.js'
import { GetSetValStoreInfo } from './types.js'

export const set = async <T>(
  storeInfo: GetSetValStoreInfo,
  entries: [string, T][],
): Promise<void> => libSetMany(entries, await getStore(storeInfo))
