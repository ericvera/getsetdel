import { GetSetValStoreInfo } from '../index.js'

export const PrivateDB1: GetSetValStoreInfo = {
  name: 'private-db-1',
  tags: ['private'],
  version: 1,
}

export const PublicDB: GetSetValStoreInfo = {
  name: 'public-db',
}

export const InfoDBWithKey1: GetSetValStoreInfo = {
  name: 'info-db',
  key: '000',
}

export const InfoDBWithKey2: GetSetValStoreInfo = {
  name: 'info-db',
  key: '111',
  version: 0,
}

export const PrivateDB2: GetSetValStoreInfo = {
  name: 'private-db-2',
  tags: ['private'],
  version: 1,
}

export const AllDetailsDB: GetSetValStoreInfo = {
  name: 'all-details-db',
  key: '000',
  tags: ['private', 'public'],
  version: 1,
}
