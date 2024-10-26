[**getsetdel**](../README.md) • **Docs**

---

[getsetdel](../README.md) / createStore

# Function: createStore()

> **createStore**(`storeInfo`): `Promise`\<[`GetSetValStoreToken`](../interfaces/GetSetValStoreToken.md)\>

Creates a new store or updates an existing one and returns a token that can
be used to interact with the store. As part of the creation process, the
function checks if the store needs to be reset. A reset happens if the
version or the tags provided in storeInfo are different from the ones defined
in the inventory.

## Parameters

| Parameter   | Type                                                        | Description                  |
| ----------- | ----------------------------------------------------------- | ---------------------------- |
| `storeInfo` | [`GetSetValStoreInfo`](../interfaces/GetSetValStoreInfo.md) | Information about the store. |

## Returns

`Promise`\<[`GetSetValStoreToken`](../interfaces/GetSetValStoreToken.md)\>

## Defined in

[src/createStore.ts:20](https://github.com/ericvera/getsetdel/blob/main/src/createStore.ts#L20)
