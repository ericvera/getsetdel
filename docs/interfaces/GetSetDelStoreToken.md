[**getsetdel**](../README.md)

---

[getsetdel](../README.md) / GetSetDelStoreToken

# Interface: GetSetDelStoreToken

Defined in: [src/types.ts:24](https://github.com/ericvera/getsetdel/blob/main/src/types.ts#L24)

Token that keeps track of the database name and store as well as information
that ensures the store is up to date.

## Properties

### creation

> **creation**: `number`

Defined in: [src/types.ts:38](https://github.com/ericvera/getsetdel/blob/main/src/types.ts#L38)

Timestamp of when the store was created.

---

### dbName

> **dbName**: `string`

Defined in: [src/types.ts:28](https://github.com/ericvera/getsetdel/blob/main/src/types.ts#L28)

Name of the IndexedDB database that is used to store the data.

---

### key?

> `optional` **key**: `string`

Defined in: [src/types.ts:43](https://github.com/ericvera/getsetdel/blob/main/src/types.ts#L43)

Key of the store.

---

### store

> **store**: `UseStore`

Defined in: [src/types.ts:33](https://github.com/ericvera/getsetdel/blob/main/src/types.ts#L33)

Reference to idb-keyval's store.

---

### tags?

> `optional` **tags**: `string`[]

Defined in: [src/types.ts:53](https://github.com/ericvera/getsetdel/blob/main/src/types.ts#L53)

Tags that describe the store at the time of creation.

---

### version?

> `optional` **version**: `number`

Defined in: [src/types.ts:48](https://github.com/ericvera/getsetdel/blob/main/src/types.ts#L48)

Version of the data/schema at the time of creation.
