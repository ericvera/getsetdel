import { createStore, UseStore } from 'idb-keyval'
import { GetSetValStoreInfo } from '../types.js'
import { addToInventory } from './addToInventory.js'
import { StoreName } from './constants.js'
import { getDBName } from './getDBName.js'

export const getStore = async (
  storeInfo: GetSetValStoreInfo,
): Promise<UseStore> => {
  if (storeInfo.name.indexOf('--') < 0) {
    throw new Error(
      `GetSetVal DB name '${storeInfo.name}' must not include '--' as part of the name`,
    )
  }

  await addToInventory(storeInfo)

  return createStore(getDBName(storeInfo), StoreName)
}
