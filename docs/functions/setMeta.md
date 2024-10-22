[**getsetdel**](../README.md) • **Docs**

---

[getsetdel](../README.md) / setMeta

# Function: setMeta()

> **setMeta**\<`TMeta`\>(`prop`, `value`, `storeInfo`): `Promise`\<`void`\>

Replaces the value of the specified property in the store's meta object.

## Type Parameters

| Type Parameter | Default type                    |
| -------------- | ------------------------------- |
| `TMeta`        | `Record`\<`string`, `unknown`\> |

## Parameters

| Parameter   | Type                                                                   |
| ----------- | ---------------------------------------------------------------------- |
| `prop`      | keyof `TMeta`                                                          |
| `value`     | `undefined` \| `TMeta`\[keyof `TMeta`\]                                |
| `storeInfo` | [`GetSetValStoreInfo`](../interfaces/GetSetValStoreInfo.md)\<`TMeta`\> |

## Returns

`Promise`\<`void`\>

## Defined in

[setMeta.ts:10](https://github.com/ericvera/getsetdel/blob/main/src/setMeta.ts#L10)
