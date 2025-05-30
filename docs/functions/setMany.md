[**getsetdel**](../README.md)

---

[getsetdel](../README.md) / setMany

# Function: setMany()

> **setMany**\<`T`\>(`storeToken`, `entries`): `Promise`\<`void`\>

Defined in: [src/setMany.ts:11](https://github.com/ericvera/getsetdel/blob/main/src/setMany.ts#L11)

First checks that the store has not been reset by another instance. If the
store has been reset, the function throws a GetSetDelResetError. If the store
has not been reset, the function sets the entries in the store.

## Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

## Parameters

| Parameter    | Type                                                          |
| ------------ | ------------------------------------------------------------- |
| `storeToken` | [`GetSetDelStoreToken`](../interfaces/GetSetDelStoreToken.md) |
| `entries`    | \[`string`, `T`\][]                                           |

## Returns

`Promise`\<`void`\>
