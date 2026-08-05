/**
 * Database client for the Trade Partner Portal.
 *
 * Uses postgres.js over a standard `DATABASE_URL`, so the portal is portable
 * across Neon, Supabase, RDS, or a self-hosted Postgres — no host-specific
 * driver is baked in.
 *
 * Initialisation is LAZY and this matters: Next.js evaluates every route module
 * during `next build` to collect page data. If the connection were created at
 * module scope, a build without DATABASE_URL present would crash — which would
 * mean the public HRE marketing pages could no longer be built without portal
 * secrets. Behind the proxy below, nothing touches the environment until a query
 * actually runs at request time, and a missing variable then fails loudly on
 * that request instead of at build.
 *
 * The connection is memoised on `globalThis` so dev hot-reloads and warm Vercel
 * lambdas reuse one small pool rather than opening a new one per module
 * evaluation.
 */

import 'server-only'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { serverEnv } from '../env'
import * as schema from './schema'

type Sql = ReturnType<typeof postgres>
type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>

declare global {
  // eslint-disable-next-line no-var
  var __portalSql: Sql | undefined
  // eslint-disable-next-line no-var
  var __portalDb: DrizzleDb | undefined
}

function createClient(): Sql {
  return postgres(serverEnv.databaseUrl, {
    // Serverless-friendly: a small pool, closed aggressively when idle.
    max: Number(process.env.PORTAL_DB_POOL_MAX ?? 5),
    idle_timeout: 20,
    connect_timeout: 15,
    prepare: false,
  })
}

export function getSql(): Sql {
  if (!globalThis.__portalSql) globalThis.__portalSql = createClient()
  return globalThis.__portalSql
}

export function getDb(): DrizzleDb {
  if (!globalThis.__portalDb) {
    globalThis.__portalDb = drizzle(getSql(), { schema })
  }
  return globalThis.__portalDb
}

/**
 * `db` looks and behaves exactly like a drizzle instance, but resolves the real
 * one on first property access rather than at import.
 */
export const db = new Proxy({} as DrizzleDb, {
  get(_target, property, receiver) {
    return Reflect.get(getDb() as object, property, receiver)
  },
  has(_target, property) {
    return Reflect.has(getDb() as object, property)
  },
}) as DrizzleDb

export { schema }
export type Db = DrizzleDb
