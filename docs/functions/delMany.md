[**getsetdel**](../README.md)

---

[getsetdel](../README.md) / delMany

# Function: delMany()

> **delMany**(`storeToken`, `keys`): `Promise`\<`void`\>

Defined in: [src/delMany.ts:10](https://github.com/ericvera/getsetdel/blob/main/src/delMany.ts#L10)

First checks that the store has not been reset by another instance. If the
store has been reset, the function throws a GetSetDelResetError. If the store
has not been reset, the function deletes the keys from the store.

## Parameters

| Parameter    | Type                                                          |
| ------------ | ------------------------------------------------------------- |
| `storeToken` | [`GetSetDelStoreToken`](../interfaces/GetSetDelStoreToken.md) |
| `keys`       | `string`[]                                                    |

## Returns

`Promise`\<`void`\>
