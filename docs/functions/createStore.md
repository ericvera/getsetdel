[**getsetdel**](../README.md)

---

[getsetdel](../README.md) / createStore

# Function: createStore()

> **createStore**(`storeInfo`): `Promise`\<[`GetSetDelStoreToken`](../interfaces/GetSetDelStoreToken.md)\>

If the store exists, the function checks if the store needs to be reset. A
reset happens if the version or the tags provided in storeInfo parameter are
different from the ones defined in the stores inventory. If a reset is
required, the function clears all data as well as its details stored in the
inventory. If the store does not exist, or if a reset was performed, the
function creates a new store and adds it to the inventory including a new
creation time. A token containing the store reference and the creation time
is returned which is to be passed to all subsequent GetSetDel functions to
ensure that the underlying store has not been reset.

## Parameters

| Parameter   | Type                                                        | Description                  |
| ----------- | ----------------------------------------------------------- | ---------------------------- |
| `storeInfo` | [`GetSetDelStoreInfo`](../interfaces/GetSetDelStoreInfo.md) | Information about the store. |

## Returns

`Promise`\<[`GetSetDelStoreToken`](../interfaces/GetSetDelStoreToken.md)\>

## Defined in

[src/createStore.ts:24](https://github.com/ericvera/getsetdel/blob/main/src/createStore.ts#L24)
