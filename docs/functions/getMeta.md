[**getsetdel**](../README.md) • **Docs**

---

[getsetdel](../README.md) / getMeta

# Function: getMeta()

> **getMeta**\<`TMeta`\>(`storeToken`): `Promise`\<`undefined` \| `TMeta`\>

First checks that the store has not been reset by another instance. If the
store has been reset, the function throws a GetSetDelResetError. If the store
has not been reset, the function returns the metadata of the store.

## Type Parameters

| Type Parameter | Default type                    |
| -------------- | ------------------------------- |
| `TMeta`        | `Record`\<`string`, `unknown`\> |

## Parameters

| Parameter    | Type                                                          |
| ------------ | ------------------------------------------------------------- |
| `storeToken` | [`GetSetDelStoreToken`](../interfaces/GetSetDelStoreToken.md) |

## Returns

`Promise`\<`undefined` \| `TMeta`\>

## Defined in

[src/getMeta.ts:9](https://github.com/ericvera/getsetdel/blob/main/src/getMeta.ts#L9)
