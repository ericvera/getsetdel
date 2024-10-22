export interface GetSetValStoreInfo<TMeta = Record<string, unknown>> {
  name: string
  key?: string
  tags?: string[]
  meta?: TMeta
}
