[**getsetdel**](../README.md) • **Docs**

---

[getsetdel](../README.md) / setMeta

# Function: setMeta()

> **setMeta**\<`T`\>(`storeToken`, `meta`): `Promise`\<`void`\>

First checks that the store has not been reset by another instance. If the
store has been reset, the function throws a GetSetDelResetError. If the store
has not been reset, the function sets the meta of the store. WARNING: It will
replace the existing meta with the new meta rather than merging the two.

## Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

## Parameters

| Parameter    | Type                                                          |
| ------------ | ------------------------------------------------------------- |
| `storeToken` | [`GetSetDelStoreToken`](../interfaces/GetSetDelStoreToken.md) |
| `meta`       | `T`                                                           |

## Returns

`Promise`\<`void`\>

## Defined in

[src/setMeta.ts:16](https://github.com/ericvera/getsetdel/blob/main/src/setMeta.ts#L16)
