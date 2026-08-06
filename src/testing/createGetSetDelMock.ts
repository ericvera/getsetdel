import type { GetSetDelStoreInfo, GetSetDelStoreToken } from '../types.js'

/**
 * Database name carried by the token `createStore` resolves to while the store
 * is stubbed. No database by this name exists; the name is a placeholder that
 * reads as a stub in test output.
 */
const StubDBName = 'getsetdel-stubbed-store'

/**
 * Creation timestamp carried by the stub token. It is a fixed value so it never
 * varies between calls or with the clock, which keeps snapshots of a stubbed
 * token stable.
 */
const StubCreation = 0

/**
 * Builds a structurally complete token for a store that is not backed by
 * anything. The optional fields are assigned only when the caller provided
 * them, both because `exactOptionalPropertyTypes` forbids an explicit
 * `undefined` and because that is what a real token does.
 */
const createStubToken = (
  storeInfo: GetSetDelStoreInfo,
): GetSetDelStoreToken => {
  const token: GetSetDelStoreToken = {
    dbName: StubDBName,
    creation: StubCreation,
    store: () => {
      throw new Error(
        `The getsetdel mock is stubbing the store, so the token returned for '${storeInfo.name}' has no IDBObjectStore and its store handle cannot be invoked.`,
      )
    },
  }

  if (storeInfo.key !== undefined) {
    token.key = storeInfo.key
  }

  if (storeInfo.version !== undefined) {
    token.version = storeInfo.version
  }

  if (storeInfo.tags !== undefined) {
    token.tags = storeInfo.tags
  }

  return token
}

/**
 * The armed value is deliberately arbitrary — a test may arm a value that is
 * falsy or is not an `Error` — so the rejection is produced here rather than at
 * each call site.
 */
const rejectWithArmedValue = (value: unknown): Promise<never> =>
  Promise.reject(value)

/**
 * Wraps the real getsetdel module so a consumer's code under test can run
 * against it unchanged while a test drives failures that are impossible to
 * provoke from the outside: a read that fails, a store that is not there, and a
 * store another tab wiped.
 *
 * Every member of the module is present and delegates to the real
 * implementation by default, so what a test writes through the mock is what it
 * reads back. Fault state is private to each call of this factory, so tests
 * that share one instance (through a module-scope shim) share its switches and
 * tests with their own instance do not.
 *
 * The controls are independent and resolve in a strict order: an armed read
 * fault wins over stubbing, and stubbing wins over a simulated reset.
 *
 * @param actual The real getsetdel module, typically obtained through the test
 * runner's "import the actual module" helper.
 */
export const createGetSetDelMock = (actual: typeof import('../index.js')) => {
  /**
   * Held in a wrapper so that arming with `undefined` is distinguishable from
   * nothing being armed.
   */
  let armedEntriesFault: { value: unknown } | undefined
  let storeStubbed = false

  const clear: typeof actual.clear = (storeToken) =>
    storeStubbed ? Promise.resolve() : actual.clear(storeToken)

  const createStore: typeof actual.createStore = (storeInfo) =>
    storeStubbed
      ? Promise.resolve(createStubToken(storeInfo))
      : actual.createStore(storeInfo)

  const del: typeof actual.del = (storeToken, key) =>
    storeStubbed ? Promise.resolve() : actual.del(storeToken, key)

  const delMany: typeof actual.delMany = (storeToken, keys) =>
    storeStubbed ? Promise.resolve() : actual.delMany(storeToken, keys)

  const entries: typeof actual.entries = (storeToken) => {
    if (armedEntriesFault) {
      return rejectWithArmedValue(armedEntriesFault.value)
    }

    return storeStubbed ? Promise.resolve([]) : actual.entries(storeToken)
  }

  const get: typeof actual.get = (storeToken, key) =>
    storeStubbed ? Promise.resolve(undefined) : actual.get(storeToken, key)

  const getMany: typeof actual.getMany = (storeToken, keys) => {
    if (!storeStubbed) {
      return actual.getMany(storeToken, keys)
    }

    // The real getMany resolves one slot per requested key, leaving the slot
    // undefined when the key is absent — which, for a stubbed store, is every
    // key.
    return Promise.resolve(keys.map(() => undefined))
  }

  const getMeta: typeof actual.getMeta = (storeToken) =>
    storeStubbed ? Promise.resolve(undefined) : actual.getMeta(storeToken)

  const keys: typeof actual.keys = (storeToken) =>
    storeStubbed ? Promise.resolve([]) : actual.keys(storeToken)

  const queryInventory: typeof actual.queryInventory = (query) =>
    storeStubbed ? Promise.resolve([]) : actual.queryInventory(query)

  const set: typeof actual.set = (storeToken, key, value) =>
    storeStubbed ? Promise.resolve() : actual.set(storeToken, key, value)

  const setMany: typeof actual.setMany = (storeToken, storeEntries) =>
    storeStubbed ? Promise.resolve() : actual.setMany(storeToken, storeEntries)

  const setMeta: typeof actual.setMeta = (storeToken, meta) =>
    storeStubbed ? Promise.resolve() : actual.setMeta(storeToken, meta)

  return {
    ...actual,

    clear,
    createStore,
    del,
    delMany,
    entries,
    get,
    getMany,
    getMeta,
    keys,
    queryInventory,
    set,
    setMany,
    setMeta,

    /**
     * Arms the read fault: every subsequent call to `entries` rejects with
     * exactly this value, identity and type preserved, including while the
     * store is stubbed and after a simulated reset — an explicitly armed error
     * is never masked. Only `entries` observes it; every other member keeps
     * behaving as it would with nothing armed. Calling this again replaces the
     * armed value rather than adding to it.
     *
     * @param error The value to reject with. Any value works, including values
     * that are falsy or are not `Error` instances.
     */
    failEntriesWith: (error: unknown): void => {
      armedEntriesFault = { value: error }
    },

    /**
     * Disarms the read fault, after which `entries` reads again — from the real
     * store, or from the stub if the store is stubbed. It changes nothing else;
     * in particular it does not un-stub the store, so a test whose subject
     * recovers mid-case can clear the fault while the store stays out of play.
     */
    clearEntriesFault: (): void => {
      armedEntriesFault = undefined
    },

    /**
     * Takes the store out of play: every store-touching member returns a
     * stubbed result without consulting a store, so none of them can reject
     * with a `GetSetDelResetError`. `resetGetSetDelMock` is the only control
     * that disarms it.
     *
     * This is separate from the read fault because the two answer different
     * needs. A cache layer typically retries a store reset with exponential
     * backoff and calls `createStore` inside that retry loop, so a test driving
     * the backoff runs on fake timers; faulting only the read would leave
     * `createStore` reopening a real store on every attempt. Conversely, a test
     * whose subject recovers mid-case wants the fault cleared while the store
     * stays stubbed, and a test with no fake timers wants a fault without
     * losing the real store. Every stubbed result settles on the microtask
     * queue, so a loop driven by fake timers is never left waiting on a real
     * event-loop turn.
     */
    stubStore: (): void => {
      storeStubbed = true
    },

    /**
     * Puts the store into the state another browser tab wiping it would leave
     * behind, by clearing its data and removing its inventory entry. Until a
     * store with the same identity is created afresh, every reset-guarded
     * member called with this token rejects with a genuine
     * `GetSetDelResetError` raised by getsetdel's own store-state check.
     *
     * This is a test control rather than a member of getsetdel's surface, so it
     * acts on the backing store even while the store is stubbed; the effect
     * becomes observable once stubbing is disarmed.
     *
     * @param storeToken Token identifying the store to wipe. Only that store is
     * affected.
     * @returns A promise that resolves once the store is in that state.
     */
    simulateStoreReset: (storeToken: GetSetDelStoreToken): Promise<void> =>
      actual.clear(storeToken),

    /**
     * Disarms the read fault and store stubbing, returning the mock to full
     * delegation. It is safe to call when nothing is armed.
     *
     * It does not undo a simulated reset or restore stored data — clearing data
     * between test cases is the backing store's own reset helper's job.
     */
    resetGetSetDelMock: (): void => {
      armedEntriesFault = undefined
      storeStubbed = false
    },
  }
}
