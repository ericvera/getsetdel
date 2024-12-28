[**getsetdel**](../README.md)

---

[getsetdel](../README.md) / entries

# Function: entries()

> **entries**\<`T`\>(`storeToken`): `Promise`\<[`string`, `T`][]\>

First checks that the store has not been reset by another instance. If the
store has been reset, the function throws a GetSetDelResetError. If the store
has not been reset, the function returns all key-value pairs in the store.

## Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

## Parameters

| Parameter    | Type                                                          |
| ------------ | ------------------------------------------------------------- |
| `storeToken` | [`GetSetDelStoreToken`](../interfaces/GetSetDelStoreToken.md) |

## Returns

`Promise`\<[`string`, `T`][]\>

## Defined in

[src/entries.ts:10](https://github.com/ericvera/getsetdel/blob/main/src/entries.ts#L10)
