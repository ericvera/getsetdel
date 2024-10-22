import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],

    environment: 'happy-dom',

    // Automatically reset after each test
    mockReset: true,

    // Disable console.log in tests
    onConsoleLog: () => false,
  },
})
