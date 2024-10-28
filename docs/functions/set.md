[**getsetdel**](../README.md) • **Docs**

---

[getsetdel](../README.md) / set

# Function: set()

> **set**(`storeToken`, `key`, `value`): `Promise`\<`void`\>

First checks that the store has not been reset by another instance. If the
store has been reset, the function throws a GetSetValResetError. If the store
has not been reset, the function sets the value of the key in the store.

## Parameters

| Parameter    | Type                                                          |
| ------------ | ------------------------------------------------------------- |
| `storeToken` | [`GetSetValStoreToken`](../interfaces/GetSetValStoreToken.md) |
| `key`        | `string`                                                      |
| `value`      | `unknown`                                                     |

## Returns

`Promise`\<`void`\>

## Defined in

[src/set.ts:10](https://github.com/ericvera/getsetdel/blob/main/src/set.ts#L10)
