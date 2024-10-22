import { set } from 'idb-keyval'
import { InventoryStore } from './internal/constants.js'
import { getDBName } from './internal/getDBName.js'
import { getStoreMeta } from './internal/getStoreMeta.js'
import { GetSetValStoreInfo } from './types.js'

/**
 * Replaces the value of the specified property in the store's meta object.
 */
export const setMeta = async <TMeta = Record<string, unknown>>(
  prop: keyof TMeta,
  value: TMeta[typeof prop] | undefined,
  storeInfo: GetSetValStoreInfo<TMeta>,
): Promise<void> => {
  const meta = (await getStoreMeta<TMeta>(storeInfo)) ?? ({} as TMeta)

  const result = {} as TMeta

  for (const key in meta) {
    if (key !== prop) {
      result[key] = meta[key]
    }
  }

  if (value !== undefined) {
    meta[prop] = value
  }

  await set(getDBName(storeInfo), { ...storeInfo, meta }, InventoryStore)
}
