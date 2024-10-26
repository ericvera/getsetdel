# getsetdel

**Key-value store with a tiny metadata layer to support store management. Implemented in IndexedDB.**

[![github license](https://img.shields.io/github/license/ericvera/getsetdel.svg?style=flat-square)](https://github.com/ericvera/getsetdel/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/getsetdel.svg?style=flat-square)](https://npmjs.org/package/getsetdel)

> ### NOT READY TO BE USED!
>
> Actively working on an initial working version.

Features:

- Key-value pair storage
- Built on top of proven [idb-keyval](https://www.npmjs.com/package/idb-keyval)
- Support for name storage
- Support for metadata at the storage level
- Support for clearing data on data version change
- Support for clearing data after TTL (Time to Live)
- Simple API
- Support for tags at the storage level (e.g. add a 'private' tag, then clear all stores taggged with it when a user logs-out)

# API Reference

See [docs](docs/README.md)
