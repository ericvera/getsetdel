[**getsetdel**](../README.md) • **Docs**

---

[getsetdel](../README.md) / handleResetError

# Function: handleResetError()

> **handleResetError**(`onResetError`): (`error`) => `Promise`\<`void`\>

Handles errors thrown by GetSetVal functions. If the error is a
GetSetValResetError, the function calls onResetError. If the error is not a
GetSetValResetError, the function rethrows the error.

## Parameters

| Parameter      | Type                      |
| -------------- | ------------------------- |
| `onResetError` | () => `Promise`\<`void`\> |

## Returns

`Function`

### Parameters

| Parameter | Type      |
| --------- | --------- |
| `error`   | `unknown` |

### Returns

`Promise`\<`void`\>

## Defined in

[src/handleResetError.ts:9](https://github.com/ericvera/getsetdel/blob/main/src/handleResetError.ts#L9)
