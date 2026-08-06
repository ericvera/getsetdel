# CLAUDE.md

Never open a pull request for, or merge into another branch, any branch whose tree contains `.mise/` — that work is still in flight; run `/mise:next` on that branch to finish acceptance and cleanup first.

## Releases

Releases are cut in CI by conventional-changelog from the **squash-merge** subject, and this repo squash-merges. Per-task commits may use any subject, but the squash subject must be a Conventional Commit (`feat:` / `fix:` / `chore:`), with `!` and a `BREAKING CHANGE:` footer for any breaking change to the public API or its published types — it is the only message the release job reads.

## The in-memory idb-keyval backend

`src/testing/idbKeyval.ts` mirrors `idb-keyval`'s own declared types. When an `idb-keyval` upgrade changes a signature, fix the mirror **and** the matching wrapper in `src/<member>.ts` — they are separate files that must agree, and only the mirror is shipped to consumers as a type contract. Keep the assignability assertion in `src/testing/idbKeyval.test.ts` bidirectional; the one-way form passes when a member is declared narrower than the real one.

## Tooling

Never silence a tool by weakening checking. Fix an ESLint complaint by configuring the rule in `eslint.config.mjs` when the pattern is legitimate; an inline `eslint-disable` is only for intent a config change would hide, and must carry a comment saying what. Likewise, do not drop a type parameter because inference never needs it — `setMany<T>` / `setMeta<T>` exist so the explicit form (`setMeta<Meta>(token, meta)`) type-checks the payload.
