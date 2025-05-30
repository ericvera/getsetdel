[**getsetdel**](../README.md)

---

[getsetdel](../README.md) / handleResetError

# Function: handleResetError()

> **handleResetError**(`onResetError`): (`error`) => `Promise`\<`void`\>

Defined in: [src/handleResetError.ts:9](https://github.com/ericvera/getsetdel/blob/main/src/handleResetError.ts#L9)

Handles errors thrown by GetSetDel functions. If the error is a
GetSetDelResetError, the function calls onResetError. If the error is not a
GetSetDelResetError, the function rethrows the error.

## Parameters

| Parameter      | Type                      |
| -------------- | ------------------------- |
| `onResetError` | () => `Promise`\<`void`\> |

## Returns

> (`error`): `Promise`\<`void`\>

### Parameters

| Parameter | Type      |
| --------- | --------- |
| `error`   | `unknown` |

### Returns

`Promise`\<`void`\>
