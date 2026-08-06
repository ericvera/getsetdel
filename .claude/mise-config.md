# Mise Configuration

Mise directory: .mise/
Branch convention: feat/<slug> for features, fix/<slug> for bug fixes
Ship: merge (squash)

## Quality commands

- Format: yarn format
- Check:
  - yarn lint
  - yarn build
- Unit tests: yarn test

## Test conventions

Vitest with the happy-dom environment. Tests are colocated with their source as
`src/<name>.test.ts`. Shared fixtures live in `src/__test__/`. `idb-keyval` is
faked globally via `vitest.setup.ts`; `src/__mocks__/idb-keyval.ts` is a bare
re-export of the shipped backend `src/testing/idbKeyval.ts` — change the
backend, never the mock. Assert thrown errors with
`toThrowErrorMatchingInlineSnapshot()`, not a bare `toThrow()`.

## Test exceptions

- Anything that would need an e2e test (no e2e infrastructure exists) — verify with unit tests plus manual verification
- Consumer-facing wiring docs (README snippets) and package `exports` changes — the repo's own tests import source directly and cannot exercise them; verify by `npm pack`ing the tree into a throwaway consumer project outside the repo and running the documented snippets verbatim (extract each block to the path in its header comment). Reading the snippets is not verification.

## Models

- implementer: opus
- explore: opus
- retrospective: opus
