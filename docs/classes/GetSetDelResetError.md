[**getsetdel**](../README.md) • **Docs**

---

[getsetdel](../README.md) / GetSetDelResetError

# Class: GetSetDelResetError

Error thrown when a reset of the store is required. The error message
explains why the store needs to be reset.

## Extends

- `Error`

## Constructors

### new GetSetDelResetError()

> **new GetSetDelResetError**(`dbName`, `reason`): [`GetSetDelResetError`](GetSetDelResetError.md)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `dbName`  | `string` |
| `reason`  | `string` |

#### Returns

[`GetSetDelResetError`](GetSetDelResetError.md)

#### Overrides

`Error.constructor`

#### Defined in

[src/GetSetDelResetError.ts:6](https://github.com/ericvera/getsetdel/blob/main/src/GetSetDelResetError.ts#L6)

## Properties

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

`Error.cause`

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:24

---

### message

> **message**: `string`

#### Inherited from

`Error.message`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1077

---

### name

> **name**: `string`

#### Inherited from

`Error.name`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1076

---

### stack?

> `optional` **stack**: `string`

#### Inherited from

`Error.stack`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1078

---

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### Parameters

| Parameter     | Type         |
| ------------- | ------------ |
| `err`         | `Error`      |
| `stackTraces` | `CallSite`[] |

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

`Error.prepareStackTrace`

#### Defined in

node_modules/@types/node/globals.d.ts:143

---

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

#### Defined in

node_modules/@types/node/globals.d.ts:145

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

#### Parameters

| Parameter         | Type       |
| ----------------- | ---------- |
| `targetObject`    | `object`   |
| `constructorOpt`? | `Function` |

#### Returns

`void`

#### Inherited from

`Error.captureStackTrace`

#### Defined in

node_modules/@types/node/globals.d.ts:136
