import type { GetSetDelStoreInfo } from '../types.js'
import { DBNamePrefix, DBNameSuffix } from './constants.js'

export const getDBName = (storeInfo: GetSetDelStoreInfo): string =>
  `${DBNamePrefix}${
    storeInfo.name
  }${storeInfo.key === undefined ? '' : `${DBNameSuffix}${storeInfo.key}`}`
