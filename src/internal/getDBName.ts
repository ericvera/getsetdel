import type { GetSetValStoreInfo } from '../types.js'
import { DBNamePrefix, DBNameSuffix } from './constants.js'

export const getDBName = <TMeta = Record<string, unknown>>(
  storeInfo: GetSetValStoreInfo<TMeta>,
): string =>
  `${DBNamePrefix}${
    storeInfo.name
  }${storeInfo.key === undefined ? '' : `${DBNameSuffix}${storeInfo.key}`}`
