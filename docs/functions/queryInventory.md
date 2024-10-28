[**getsetdel**](../README.md) • **Docs**

---

[getsetdel](../README.md) / queryInventory

# Function: queryInventory()

> **queryInventory**(`query`): `Promise`\<[`GetSetDelStoreToken`](../interfaces/GetSetDelStoreToken.md)[]\>

Queries the inventory for stores that match the query.

## Parameters

| Parameter | Type                 |
| --------- | -------------------- |
| `query`   | `GetStoresInfoQuery` |

## Returns

`Promise`\<[`GetSetDelStoreToken`](../interfaces/GetSetDelStoreToken.md)[]\>

An array of tokens containing the store reference and creation time.

## Defined in

[src/queryInventory.ts:16](https://github.com/ericvera/getsetdel/blob/main/src/queryInventory.ts#L16)
