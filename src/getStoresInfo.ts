import { createStore, getMany as libGetMany, keys as libKeys } from 'idb-keyval'
import {
  InventoryStore,
  LocalDBStoreInventoryName,
  StoreName,
} from './internal/constants.js'
import { GetSetValStoreInfo } from './types.js'

interface GetStoresInfoQuery {
  name?: string
  includesAnyTag?: string[]
}

export const getStoresInfo = async (
  query: GetStoresInfoQuery = {},
): Promise<GetSetValStoreInfo[]> => {
  // NOTE: DO NOT CALL getStore here as it will result in an infinite loop!
  const store = createStore(LocalDBStoreInventoryName, StoreName)

  const keys = await libKeys(store)

  let resultStoresInfo = await libGetMany<GetSetValStoreInfo>(
    keys,
    InventoryStore,
  )

  if (query.name) {
    resultStoresInfo = resultStoresInfo.filter(
      (storeInfo) => storeInfo.name === query.name,
    )
  }

  if (query.includesAnyTag !== undefined) {
    resultStoresInfo = resultStoresInfo.filter((storeInfo) =>
      query.includesAnyTag?.some((tag) => storeInfo.tags?.includes(tag)),
    )
  }

  return resultStoresInfo
}
