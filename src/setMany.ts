import { setMany as idbSetMany } from 'idb-keyval'
import { checkStoreState } from './internal/checkStoreState.js'
import { GetSetDelStoreToken } from './types.js'

/**
 * First checks that the store has not been reset by another instance. If the
 * store has been reset, the function throws a GetSetDelResetError. If the store
 * has not been reset, the function sets the entries in the store.
 */
// The type parameter appears once, so the rule reads it as removable. It is
// kept for the explicit form: `setMany<Value>(token, entries)` checks every
// entry's value against `Value`, mirroring `getMany<Value>` on the read side.
// Replacing it with `unknown` would silently accept a mistyped entry.
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const setMany = async <T>(
  storeToken: GetSetDelStoreToken,
  entries: [string, T][],
): Promise<void> => {
  await checkStoreState(storeToken)

  return idbSetMany(entries, storeToken.store)
}
