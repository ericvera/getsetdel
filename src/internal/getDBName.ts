import type { GetSetValStoreInfo } from '../types.js'
import { DBNamePrefix, DBNameSuffix } from './constants.js'

export const getDBName = (storeInfo: GetSetValStoreInfo): string =>
  `${DBNamePrefix}${
    storeInfo.name
  }${storeInfo.key === undefined ? '' : `${DBNameSuffix}${storeInfo.key}`}`
