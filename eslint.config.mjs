// @ts-check

import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.eslint.json', './tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // A leading underscore marks a parameter kept only to match a signature
      // being implemented, and a rest sibling is how a property is dropped from
      // an object — neither is a mistake worth reporting.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
    },
  },
  {
    // The testing subpath forwards values a test hands it, so a rejection
    // reason typed `unknown` is pass-through rather than a missing Error.
    // Rejecting with a known non-Error is still reported.
    files: ['src/testing/**/*.ts'],
    rules: {
      '@typescript-eslint/prefer-promise-reject-errors': [
        'error',
        { allowThrowingUnknown: true },
      ],
    },
  },
  {
    ignores: ['dist/*', '.yarn/*', '.vscode/*', '.github/*'],
  },
)
