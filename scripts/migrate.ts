/**
 * Applies pending SQL migrations from ./drizzle.
 *
 * Run with `npm run db:migrate`. Safe to re-run — drizzle records applied
 * migrations in a `__drizzle_migrations` table and skips them.
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('DATABASE_URL is not set. Add it to .env.local (or your host) and try again.')
    process.exit(1)
  }

  // A dedicated single connection: migrations must not share the app pool.
  const sql = postgres(url, { max: 1 })
  try {
    console.log('Applying trade partner portal migrations…')
    await migrate(drizzle(sql), { migrationsFolder: './drizzle' })
    console.log('Migrations applied.')
  } finally {
    await sql.end()
  }
}

main().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
