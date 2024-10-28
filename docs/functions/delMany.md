[**getsetdel**](../README.md) • **Docs**

---

[getsetdel](../README.md) / delMany

# Function: delMany()

> **delMany**(`storeToken`, `keys`): `Promise`\<`void`\>

First checks that the store has not been reset by another instance. If the
store has been reset, the function throws a GetSetValResetError. If the store
has not been reset, the function deletes the keys from the store.

## Parameters

| Parameter    | Type                                                          |
| ------------ | ------------------------------------------------------------- |
| `storeToken` | [`GetSetValStoreToken`](../interfaces/GetSetValStoreToken.md) |
| `keys`       | `string`[]                                                    |

## Returns

`Promise`\<`void`\>

## Defined in

[src/delMany.ts:10](https://github.com/ericvera/getsetdel/blob/main/src/delMany.ts#L10)
