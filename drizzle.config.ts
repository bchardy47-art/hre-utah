import type { Config } from 'drizzle-kit'

/**
 * Drizzle Kit configuration for the Trade Partner Portal.
 *
 * Migrations are plain SQL files under ./drizzle — reviewable in a pull request
 * and applied with `npm run db:migrate`. Never point this at a production
 * database with `db:push`; always generate and review a migration.
 */
export default {
  schema: './src/lib/portal/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  strict: true,
  verbose: true,
} satisfies Config
