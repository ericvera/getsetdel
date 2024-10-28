import { UseStore } from 'idb-keyval'

export interface GetSetValStoreInfo {
  name: string
  version?: number
  key?: string
  tags?: string[]
}

export interface GetSetValStoreInfoData<TMeta = Record<string, unknown>>
  extends GetSetValStoreInfo {
  /**
   * Timestamp of when the store was created.
   */
  creation: number

  meta?: TMeta
}

/**
 * Token that keeps track of the database name and store as well as information
 * that ensures the store is up to date.
 */
export interface GetSetValStoreToken {
  /**
   * Name of the IndexedDB database that is used to store the data.
   */
  dbName: string

  /**
   * Reference to idb-keyval's store.
   */
  store: UseStore

  /**
   * Timestamp of when the store was created.
   */
  creation: number

  /**
   * Version of the data/schema at the time of creation.
   */
  version?: number

  /**
   * Tags that describe the store at the time of creation.
   */
  tags?: string[]
}
