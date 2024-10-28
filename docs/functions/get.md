[**getsetdel**](../README.md) • **Docs**

---

[getsetdel](../README.md) / get

# Function: get()

> **get**\<`T`\>(`storeToken`, `key`): `Promise`\<`undefined` \| `T`\>

First checks that the store has not been reset by another instance. If the
store has been reset, the function throws a GetSetDelResetError. If the store
has not been reset, the function returns the value of the key in the store.

## Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

## Parameters

| Parameter    | Type                                                          |
| ------------ | ------------------------------------------------------------- |
| `storeToken` | [`GetSetDelStoreToken`](../interfaces/GetSetDelStoreToken.md) |
| `key`        | `string`                                                      |

## Returns

`Promise`\<`undefined` \| `T`\>

## Defined in

[src/get.ts:10](https://github.com/ericvera/getsetdel/blob/main/src/get.ts#L10)
