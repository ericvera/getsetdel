[**getsetdel**](../README.md)

---

[getsetdel](../README.md) / set

# Function: set()

> **set**(`storeToken`, `key`, `value`): `Promise`\<`void`\>

Defined in: [src/set.ts:10](https://github.com/ericvera/getsetdel/blob/main/src/set.ts#L10)

First checks that the store has not been reset by another instance. If the
store has been reset, the function throws a GetSetDelResetError. If the store
has not been reset, the function sets the value of the key in the store.

## Parameters

| Parameter    | Type                                                          |
| ------------ | ------------------------------------------------------------- |
| `storeToken` | [`GetSetDelStoreToken`](../interfaces/GetSetDelStoreToken.md) |
| `key`        | `string`                                                      |
| `value`      | `unknown`                                                     |

## Returns

`Promise`\<`void`\>
