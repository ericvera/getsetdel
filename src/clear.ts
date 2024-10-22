import { clear as libClear } from 'idb-keyval'
import { getStore } from './internal/getStore.js'
import { removeFromInventory } from './internal/removeFromInventory.js'
import { GetSetValStoreInfo } from './types.js'

export const clear = async (
  storesInfo: GetSetValStoreInfo[],
): Promise<void> => {
  await Promise.all(
    storesInfo.map(async (storeInfo) =>
      Promise.all([
        libClear(await getStore(storeInfo)),
        removeFromInventory(storeInfo),
      ]),
    ),
  )
}
