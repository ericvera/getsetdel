[**getsetdel**](../README.md) • **Docs**

---

[getsetdel](../README.md) / keys

# Function: keys()

> **keys**(`storeToken`): `Promise`\<`string`[]\>

First checks that the store has not been reset by another instance. If the
store has been reset, the function throws a GetSetDelResetError. If the store
has not been reset, the function returns all keys in the store.

## Parameters

| Parameter    | Type                                                          |
| ------------ | ------------------------------------------------------------- |
| `storeToken` | [`GetSetDelStoreToken`](../interfaces/GetSetDelStoreToken.md) |

## Returns

`Promise`\<`string`[]\>

## Defined in

[src/keys.ts:10](https://github.com/ericvera/getsetdel/blob/main/src/keys.ts#L10)
