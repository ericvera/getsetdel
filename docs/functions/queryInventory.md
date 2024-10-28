[**getsetdel**](../README.md) • **Docs**

---

[getsetdel](../README.md) / queryInventory

# Function: queryInventory()

> **queryInventory**(`query`): `Promise`\<[`GetSetValStoreToken`](../interfaces/GetSetValStoreToken.md)[]\>

Queries the inventory for stores that match the query.

## Parameters

| Parameter | Type                 |
| --------- | -------------------- |
| `query`   | `GetStoresInfoQuery` |

## Returns

`Promise`\<[`GetSetValStoreToken`](../interfaces/GetSetValStoreToken.md)[]\>

An array of tokens containing the store reference and creation time.

## Defined in

[src/queryInventory.ts:16](https://github.com/ericvera/getsetdel/blob/main/src/queryInventory.ts#L16)
