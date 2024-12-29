import { createStore, entries } from 'idb-keyval'
import { createInventoryStore, StoreName } from './internal/constants.js'
import { getDBName } from './internal/getDBName.js'
import { GetSetDelStoreInfoData, GetSetDelStoreToken } from './types.js'

interface GetStoresInfoQuery {
  name?: string
  includesAnyTag?: string[]
  includesAllTags?: string[]
}

/**
 * Queries the inventory for stores that match the query.
 * @returns An array of tokens containing the store reference and creation time.
 */
export const queryInventory = async (
  query: GetStoresInfoQuery = {},
): Promise<GetSetDelStoreToken[]> => {
  // Get all the store entries in inventory
  let resultStoresInfo = await entries<string, GetSetDelStoreInfoData>(
    createInventoryStore(),
  )

  // Filter by query if defined
  if (query.name) {
    resultStoresInfo = resultStoresInfo.filter(
      ([, storeInfo]) => storeInfo.name === query.name,
    )
  }

  if (query.includesAnyTag !== undefined) {
    resultStoresInfo = resultStoresInfo.filter(([, storeInfo]) =>
      query.includesAnyTag?.some((tag) => storeInfo.tags?.includes(tag)),
    )
  }

  if (query.includesAllTags !== undefined) {
    resultStoresInfo = resultStoresInfo.filter(([, storeInfo]) =>
      query.includesAllTags?.every((tag) => storeInfo.tags?.includes(tag)),
    )
  }

  return resultStoresInfo.map(([, storeInfo]) => {
    const dbName = getDBName(storeInfo)
    const { version, tags, creation, key } = storeInfo

    // Create GetSetDel token
    const token: GetSetDelStoreToken = {
      dbName,
      creation,
      store: createStore(dbName, StoreName),
    }

    if (version) {
      token.version = version
    }

    if (tags) {
      token.tags = tags
    }

    if (key) {
      token.key = key
    }

    return token
  })
}
