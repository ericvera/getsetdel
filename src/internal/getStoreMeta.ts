import { get } from 'idb-keyval'
import { GetSetValStoreInfo } from '../types.js'
import { InventoryStore } from './constants.js'
import { getDBName } from './getDBName.js'

export const getStoreMeta = async <TMeta = Record<string, unknown>>(
  storeInfo: GetSetValStoreInfo<TMeta>,
): Promise<TMeta | undefined> => {
  const info = await get<GetSetValStoreInfo<TMeta>>(
    getDBName<TMeta>(storeInfo),
    InventoryStore,
  )

  return info?.meta
}
