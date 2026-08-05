import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

/**
 * `server-only` throws by design when imported outside a React Server Component.
 * Aliasing it to an empty module lets the portal's server modules be unit-tested
 * directly without weakening that guard in the application build.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    // Integration tests share one scratch database and TRUNCATE between cases,
    // so they must not run in parallel with each other.
    fileParallelism: false,
    setupFiles: ['./tests/setup-file.ts'],
    globals: false,
  },
  resolve: {
    alias: {
      'server-only': fileURLToPath(new URL('./tests/stubs/server-only.ts', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
