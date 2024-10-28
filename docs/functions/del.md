[**getsetdel**](../README.md) • **Docs**

---

[getsetdel](../README.md) / del

# Function: del()

> **del**(`storeToken`, `key`): `Promise`\<`void`\>

First checks that the store has not been reset by another instance. If the
store has been reset, the function throws a GetSetValResetError. If the store
has not been reset, the function deletes the key from the store.

## Parameters

| Parameter    | Type                                                          |
| ------------ | ------------------------------------------------------------- |
| `storeToken` | [`GetSetValStoreToken`](../interfaces/GetSetValStoreToken.md) |
| `key`        | `string`                                                      |

## Returns

`Promise`\<`void`\>

## Defined in

[src/del.ts:10](https://github.com/ericvera/getsetdel/blob/main/src/del.ts#L10)
