/**
 * Runs once per test file.
 *
 * The integration pool is shared across every `describe` in a file. Registering
 * teardown here rather than inside each block means the first block to finish
 * cannot close the connection out from under the ones still running.
 */

import { afterAll } from 'vitest'
import { closeDatabase } from './integration/setup'

afterAll(async () => {
  await closeDatabase()
})
