/**
 * Firebase Admin SDK — server only.
 *
 * This module must never reach the browser. It holds the service-account
 * credential, which bypasses every Security Rule; leaking it would hand out full
 * read/write on the whole project.
 *
 * Initialisation is LAZY for the same reason the Postgres pool was: Next.js
 * evaluates route modules during `next build`, and a missing credential must not
 * break building the public marketing pages. Nothing touches the environment
 * until a request actually runs.
 *
 * When FIRESTORE_EMULATOR_HOST / FIREBASE_AUTH_EMULATOR_HOST are set, the SDK
 * talks to the emulators and no real credential is required.
 */

import 'server-only'
import { cert, getApp, getApps, initializeApp, type App } from 'firebase-admin/app'
import { getAuth, type Auth } from 'firebase-admin/auth'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'
import { getStorage, type Storage } from 'firebase-admin/storage'

const APP_NAME = 'hre-portal-admin'

function usingEmulators(): boolean {
  return Boolean(process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST)
}

/**
 * Vercel stores multi-line values with literal `\n`. A private key pasted
 * into a dashboard field therefore arrives as one line containing the two
 * characters backslash-n, which PEM parsing rejects with an opaque error. This
 * is the single most common Firebase-on-Vercel setup failure.
 */
function normalisePrivateKey(raw: string): string {
  let key = raw.trim()
  // Some dashboards additionally wrap the whole value in quotes.
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1)
  }
  return key.replace(/\\n/g, '\n')
}

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `See docs/TRADE_PARTNER_PORTAL.md for the Firebase setup checklist.`,
    )
  }
  return value
}

function createApp(): App {
  const existing = getApps().find((a) => a.name === APP_NAME)
  if (existing) return existing

  const projectId =
    process.env.FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

  // Emulators accept any project id and need no credential at all.
  if (usingEmulators()) {
    return initializeApp(
      {
        projectId: projectId ?? 'demo-hre-portal',
        storageBucket:
          process.env.FIREBASE_STORAGE_BUCKET ?? 'demo-hre-portal.appspot.com',
      },
      APP_NAME,
    )
  }

  return initializeApp(
    {
      credential: cert({
        projectId: requireEnv('FIREBASE_PROJECT_ID'),
        clientEmail: requireEnv('FIREBASE_CLIENT_EMAIL'),
        privateKey: normalisePrivateKey(requireEnv('FIREBASE_PRIVATE_KEY')),
      }),
      storageBucket: requireEnv('FIREBASE_STORAGE_BUCKET'),
    },
    APP_NAME,
  )
}

let cachedApp: App | null = null

export function adminApp(): App {
  if (!cachedApp) {
    cachedApp = getApps().find((a) => a.name === APP_NAME) ?? createApp()
  }
  return cachedApp
}

let cachedDb: Firestore | null = null

export function adminDb(): Firestore {
  if (!cachedDb) {
    cachedDb = getFirestore(adminApp())
    // Treat a written `undefined` as "leave unset" rather than throwing. Form
    // payloads legitimately omit optional fields.
    cachedDb.settings({ ignoreUndefinedProperties: true })
  }
  return cachedDb
}

export function adminAuth(): Auth {
  return getAuth(adminApp())
}

export function adminStorage(): Storage {
  return getStorage(adminApp())
}

export function storageBucket() {
  const name =
    process.env.FIREBASE_STORAGE_BUCKET ??
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    'demo-hre-portal.appspot.com'
  return adminStorage().bucket(name)
}

export function isFirebaseConfigured(): boolean {
  if (usingEmulators()) return true
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY &&
      process.env.FIREBASE_STORAGE_BUCKET,
  )
}

/** Exported only so the setup documentation can be verified by a test. */
export const __testing = { normalisePrivateKey }
