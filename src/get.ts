import { getMany as libGetMany } from 'idb-keyval'
import { getStore } from './internal/getStore.js'
import { GetSetValStoreInfo } from './types.js'

export const get = async <T>(
  storeInfo: GetSetValStoreInfo,
  keys: string[],
): Promise<T[]> => libGetMany(keys, await getStore(storeInfo))
