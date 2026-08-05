'use client'

/**
 * Firebase Web SDK — browser only.
 *
 * Everything here is public by design. The API key is not a secret: it
 * identifies the project, it does not authorise anything. What actually
 * protects data is Firestore/Storage Security Rules plus the server-side checks
 * in the Admin SDK.
 *
 * The browser SDK is used for exactly three things:
 *   1. Signing in (to obtain an ID token, which the server exchanges for an
 *      httpOnly session cookie).
 *   2. Sending password-reset and email-verification messages.
 *   3. Uploading a file straight to Storage, so a large scan never has to pass
 *      through a Vercel function and hit its 4.5 MB request-body cap.
 *
 * It is never used to read portal data — every read goes through the server so
 * authorization is decided in one place.
 */

import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import {
  connectAuthEmulator,
  getAuth,
  type Auth,
} from 'firebase/auth'
import {
  connectStorageEmulator,
  getStorage,
  type FirebaseStorage,
} from 'firebase/storage'

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const USE_EMULATORS = process.env.NEXT_PUBLIC_FIREBASE_USE_EMULATORS === 'true'

let app: FirebaseApp | null = null
let authInstance: Auth | null = null
let storageInstance: FirebaseStorage | null = null

export function clientApp(): FirebaseApp {
  if (app) return app
  app = getApps().length ? getApp() : initializeApp(config)
  return app
}

export function clientAuth(): Auth {
  if (authInstance) return authInstance
  authInstance = getAuth(clientApp())
  if (USE_EMULATORS) {
    connectAuthEmulator(authInstance, 'http://127.0.0.1:9099', { disableWarnings: true })
  }
  return authInstance
}

export function clientStorage(): FirebaseStorage {
  if (storageInstance) return storageInstance
  storageInstance = getStorage(clientApp())
  if (USE_EMULATORS) {
    connectStorageEmulator(storageInstance, '127.0.0.1', 9199)
  }
  return storageInstance
}

export function isClientConfigured(): boolean {
  return Boolean(config.apiKey && config.projectId)
}

/**
 * Turns a Firebase Auth error code into something a subcontractor can act on.
 * The raw codes ("auth/invalid-credential") are meaningless to them, and the
 * defaults leak whether an account exists.
 */
export function friendlyAuthError(code: string): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      // Deliberately identical for all three — no account enumeration.
      return 'That email address and password combination was not recognised.'
    case 'auth/too-many-requests':
      return 'Too many failed sign-in attempts. Wait a few minutes and try again, or reset your password.'
    case 'auth/user-disabled':
      return 'This account is not active. Please contact Hardy Homes.'
    case 'auth/invalid-email':
      return 'Enter a valid email address.'
    case 'auth/weak-password':
      return 'Choose a longer password — at least 12 characters.'
    case 'auth/email-already-in-use':
      return 'An account already exists for that email address. Sign in instead.'
    case 'auth/network-request-failed':
      return 'Could not reach the server. Check your connection and try again.'
    default:
      return 'Something went wrong signing in. Please try again.'
  }
}
