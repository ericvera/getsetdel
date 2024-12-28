[**getsetdel**](../README.md)

---

[getsetdel](../README.md) / GetSetDelStoreToken

# Interface: GetSetDelStoreToken

Token that keeps track of the database name and store as well as information
that ensures the store is up to date.

## Properties

### creation

> **creation**: `number`

Timestamp of when the store was created.

#### Defined in

[src/types.ts:38](https://github.com/ericvera/getsetdel/blob/main/src/types.ts#L38)

---

### dbName

> **dbName**: `string`

Name of the IndexedDB database that is used to store the data.

#### Defined in

[src/types.ts:28](https://github.com/ericvera/getsetdel/blob/main/src/types.ts#L28)

---

### store

> **store**: `UseStore`

Reference to idb-keyval's store.

#### Defined in

[src/types.ts:33](https://github.com/ericvera/getsetdel/blob/main/src/types.ts#L33)

---

### tags?

> `optional` **tags**: `string`[]

Tags that describe the store at the time of creation.

#### Defined in

[src/types.ts:48](https://github.com/ericvera/getsetdel/blob/main/src/types.ts#L48)

---

### version?

> `optional` **version**: `number`

Version of the data/schema at the time of creation.

#### Defined in

[src/types.ts:43](https://github.com/ericvera/getsetdel/blob/main/src/types.ts#L43)
