import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],

    // Only run the TypeScript sources. Vitest 4 dropped dist from its default
    // exclude, so without this it would also run the compiled tests in dist.
    include: ['src/**/*.test.ts'],

    environment: 'happy-dom',

    // Automatically reset after each test
    mockReset: true,

    // Disable console.log in tests
    onConsoleLog: () => false,
  },
})
