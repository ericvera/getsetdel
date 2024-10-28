import { GetSetDelStoreInfo } from '../index.js'

export const PrivateDB1: GetSetDelStoreInfo = {
  name: 'private-db-1',
  tags: ['private'],
  version: 1,
}

export const PublicDB: GetSetDelStoreInfo = {
  name: 'public-db',
}

export const InfoDBWithKey1: GetSetDelStoreInfo = {
  name: 'info-db',
  key: '000',
}

export const InfoDBWithKey2: GetSetDelStoreInfo = {
  name: 'info-db',
  key: '111',
  version: 0,
}

export const PrivateDB2: GetSetDelStoreInfo = {
  name: 'private-db-2',
  tags: ['private'],
  version: 1,
}

export const AllDetailsDB: GetSetDelStoreInfo = {
  name: 'all-details-db',
  key: '000',
  tags: ['private', 'public'],
  version: 1,
}
