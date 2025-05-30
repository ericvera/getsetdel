[**getsetdel**](../README.md)

---

[getsetdel](../README.md) / getMany

# Function: getMany()

> **getMany**\<`T`\>(`storeToken`, `keys`): `Promise`\<`T`[]\>

Defined in: [src/getMany.ts:10](https://github.com/ericvera/getsetdel/blob/main/src/getMany.ts#L10)

First checks that the store has not been reset by another instance. If the
store has been reset, the function throws a GetSetDelResetError. If the store
has not been reset, the function returns the values of the keys in the store.

## Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

## Parameters

| Parameter    | Type                                                          |
| ------------ | ------------------------------------------------------------- |
| `storeToken` | [`GetSetDelStoreToken`](../interfaces/GetSetDelStoreToken.md) |
| `keys`       | `string`[]                                                    |

## Returns

`Promise`\<`T`[]\>
