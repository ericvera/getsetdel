[**getsetdel**](../README.md) • **Docs**

---

[getsetdel](../README.md) / setMany

# Function: setMany()

> **setMany**\<`T`\>(`storeToken`, `entries`): `Promise`\<`void`\>

First checks that the store has not been reset by another instance. If the
store has been reset, the function throws a GetSetValResetError. If the store
has not been reset, the function sets the entries in the store.

## Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

## Parameters

| Parameter    | Type                                                          |
| ------------ | ------------------------------------------------------------- |
| `storeToken` | [`GetSetValStoreToken`](../interfaces/GetSetValStoreToken.md) |
| `entries`    | [`string`, `T`][]                                             |

## Returns

`Promise`\<`void`\>

## Defined in

[src/setMany.ts:10](https://github.com/ericvera/getsetdel/blob/main/src/setMany.ts#L10)