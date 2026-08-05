# Trade Partner Portal — Firebase Migration

Status of the `feat/trade-partner-portal-firebase` branch, what is built, what is
not, and exactly how to finish it.

**Read this first:** this branch contains a complete, reviewable Firebase
**foundation**. It does **not** yet run on Firebase. The Postgres/R2/Resend
implementation is still the one wired to the UI, so the branch builds, lints, and
passes 135 tests. Rewiring the application layer (Phase 3) is the remaining work
and is scoped at the end of this document.

Nothing in this branch touches a real Firebase project. `.firebaserc` points at
`demo-hre-portal`, a placeholder.

---

## 1. Why each service was replaced

| Was | Now | Reason |
|---|---|---|
| Postgres + Drizzle | Cloud Firestore | Already covered by the Blaze project; no separate database subscription. |
| Custom bcrypt + DB sessions | Firebase Authentication | Gets password reset and email verification for free — the password-reset gap flagged in the V1 handoff. |
| Cloudflare R2 | Firebase Storage | Same project, same billing, same Security Rules model. |
| Resend | Gmail compose drafts | Removes a provider **and** removes the ability to claim an email was sent when it was not. |
| Vercel Cron sweep | Reminders computed on read | No paid scheduler. A cron that was never configured fails silently; a derived queue cannot. |

---

## 2. What is built and where

| Concern | File | State |
|---|---|---|
| Firestore document shapes | `src/lib/portal/firebase/types.ts` | Complete |
| Admin SDK (server) | `src/lib/portal/firebase/admin.ts` | Complete |
| Web SDK (browser) | `src/lib/portal/firebase/client.ts` | Complete |
| Session cookies | `src/lib/portal/auth/firebase-session.ts` | Complete |
| Guards | `src/lib/portal/auth/firebase-guards.ts` | Complete |
| Firestore reads / mappers | `src/lib/portal/firebase/repository.ts` | Complete |
| Storage (paths, verify, signed URLs) | `src/lib/portal/firebase/storage.ts` | Complete |
| Audit trail | `src/lib/portal/firebase/audit.ts` | Complete |
| Gmail drafts | `src/lib/portal/gmail/drafts.ts` | Complete |
| Compliance + reminders | `src/lib/portal/compliance.ts` | Complete, database-agnostic |
| Firestore Rules | `firestore.rules` | Complete, **untested** — see §7 |
| Storage Rules | `storage.rules` | Complete, **untested** — see §7 |
| Indexes | `firestore.indexes.json` | Complete |
| Emulator config | `firebase.json`, `.firebaserc` | Complete |

The Firebase modules sit at Firebase-specific paths so they are purely additive.
Phase 3 is largely a matter of changing imports.

### The compliance engine is now database-agnostic

`compliance.ts` used to import Drizzle row types. It now declares the shapes it
needs. That is why every compliance rule survived this migration **unchanged**,
and why its tests never touched a database in either architecture. Keep it that
way — it is the reason the business rules are portable.

---

## 3. Authentication

Firebase owns the credential; Firestore owns the authorization facts.

1. Browser signs in with the Web SDK → short-lived ID token.
2. Token is POSTed once to the server.
3. Server verifies it (rejecting anything older than five minutes) and exchanges
   it for a Firebase **session cookie**, httpOnly.
4. Every protected request verifies that cookie with `checkRevoked: true`.

**Company membership is never read from a custom claim.** Claims are minted into
a token and go stale; a company suspended thirty seconds ago must not still be
authorised because the token has not refreshed. `portalRole` exists as a coarse
hint so Security Rules can identify an administrator without a document read, but
membership and status always come from Firestore.

Suspension calls `revokeRefreshTokens`, so access stops on the next request
rather than at cookie expiry.

---

## 4. Gmail draft workflow

The portal does not send email. `renderDraft()` builds a prefilled Gmail compose
URL; the administrator opens it, reads it, and sends it.

Two rules follow, and both are enforced:

- **No wording anywhere says "sent."** The action is "Open Gmail Draft", and
  afterwards "Draft opened — confirm sending in Gmail."
- **What is recorded is a human action**, `DRAFT_OPENED`, never a delivery event.

Eleven draft types are implemented (invitation, resend, application returned,
document approved/rejected, approved to bid/work, expiration reminder, missing
documents, suspended, reactivated). `drafts.ts` is pure, so every subject, body,
and encoded URL is unit-testable.

Do not add Gmail OAuth in this phase. The value here is precisely that no
credential is stored and no automated claim is made.

---

## 5. Reminders without cron

`dueReminders()` derives the reminder set on every read instead of a nightly job.

`thresholdFor()` returns the **most urgent threshold crossed**, not an exact-day
match. A cron design can fire on exactly day 14; a derived design must still
surface the reminder if nobody opened the dashboard that day — otherwise
reminders would be skipped silently.

Deduplication is by document ID, not a counter: the key is
`expiration_reminder__{documentId}__{threshold}`, used as the Firestore document
ID of the reminder action. Recording the same reminder twice is therefore
impossible, which is what stops the queue repeating itself.

---

## 6. Security Rules posture

Rules are **defence in depth, not the primary control**. Sensitive writes go
through Server Actions using the Admin SDK, which bypasses rules and does its own
authorization. The rules exist for the case where that is not true — a stolen
client credential talking straight to Firestore.

Default posture is deny. Notable guarantees:

- Internal notes: `allow read: if isAdmin()`. There is no expression under which
  a trade partner reads one.
- Invitations: not client-readable at all — a broad query would expose token
  hashes and invited addresses.
- Partners cannot write `status`, `reviewedAt`, `rejectionReason`, `storagePath`,
  `version`, or any approval field. Enforced with an `affectedKeys()` diff.
- Audit events, status history, and acknowledgments are append-only:
  `allow update, delete: if false`.

### Storage Rules cannot detect MIME spoofing — and do not pretend to

Storage Rules see only the declared `contentType`. They **cannot** read file
bytes, so they cannot tell a real PDF from HTML named `.pdf`. That check is
genuinely impossible there.

The compensating control is server-side: after upload, the server range-reads the
first 16 bytes and checks the magic number before the document is recorded as
SUBMITTED. Failures are deleted and never become a document. Do not read the
Storage Rules as a content guarantee.

Storage paths are **write-once**: each upload gets a fresh `{versionId}` segment
and rules allow `create` but not `update`, so an approved file cannot be
overwritten in place.

---

## 7. ⚠️ Rules are UNTESTED — and why

The Firebase Emulator Suite **could not run in the environment this branch was
written in**. `firebase emulators:start` downloads the Firestore emulator JAR
from `storage.googleapis.com`, which was blocked by the sandbox network policy.
Java 21 and every npm package were available; only the JAR fetch failed.

**Consequently `firestore.rules` and `storage.rules` have never been executed.**
They are written carefully and reviewed, but they are not verified. Treat them as
a first draft until you run the emulator yourself:

```bash
npx firebase emulators:start --project demo-hre-portal
```

Writing emulator rule tests is the first thing to do in Phase 3, before wiring
any UI. The rules are the part of this migration most likely to contain a
mistake, precisely because they are the part that could not be run.

---

## 8. Environment variables

Client-safe (these are public by design — the API key identifies the project, it
does not authorise anything):

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_USE_EMULATORS   # "true" locally only
```

Server-only (never expose these to the browser):

```
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_APP_URL
```

**`FIREBASE_PRIVATE_KEY` is the classic Firebase-on-Vercel failure.** Vercel
stores the value with literal `\n` rather than real newlines, and PEM parsing then
fails with an opaque error. `admin.ts` normalises this (and strips wrapping
quotes) — do not "fix" it by pasting a differently-escaped value.

Never commit a service-account JSON file. `.gitignore` already covers `.env*`.

---

## 9. Firebase console steps still needed

Nothing here has been done — this branch has never contacted a real project.

1. Create or choose the Firebase project; put its ID in `.firebaserc`.
2. **Authentication** → enable Email/Password. Optionally enable email
   enumeration protection.
3. **Firestore** → create the database. Pick a location close to Utah
   (`nam5` or `us-west3`); **the location cannot be changed later**.
4. **Storage** → create the default bucket. Leave public access off.
5. Create a service account, download the key, and paste its three values into
   Vercel as the server-only variables above. Do not commit the file.
6. Deploy rules and indexes:
   ```bash
   npx firebase deploy --only firestore:rules,firestore:indexes,storage --project <id>
   ```
7. Create the first administrator (Phase 3 needs a bootstrap script: create the
   Auth user, then a `portalUsers` document with `role: 'ADMIN'`, then set the
   `portalRole` custom claim).

---

## 10. Cost — be clear-eyed

Firebase Blaze is **pay-as-you-go, not a free tier with a hard stop**.

Expected usage for a handful of subcontractors is small and will likely sit
inside the free allowances. But:

- **A budget alert notifies you. It does not stop usage.** There is no hard cap.
- A runaway loop, an unindexed query over a large collection, or a leaked
  service-account key can generate real cost.
- Set a budget alert in Google Cloud Console → Billing → Budgets & alerts before
  going live, and treat it as a smoke detector rather than a sprinkler.

Storage of private documents must never move to a public URL to save a read.

---

## 11. Old → new mapping

| Drizzle table | Firestore collection |
|---|---|
| `tp_user` | `portalUsers` (doc ID = Firebase Auth UID) |
| `tp_session` | *(gone — Firebase session cookies)* |
| `tp_company` | `tradePartnerCompanies` |
| `tp_contact` | `tradePartnerContacts` |
| `tp_invitation` | `tradePartnerInvitations` |
| `tp_application` | `tradePartnerApplications` |
| `tp_license` | `tradePartnerLicenses` |
| `tp_insurance_policy` | `tradePartnerInsurancePolicies` |
| `tp_project_reference` | `tradePartnerProjectHistory` |
| `tp_document_requirement` | `documentRequirements` |
| `tp_document` | `tradePartnerDocuments` |
| `tp_document_review` | `tradePartnerDocumentReviews` |
| `tp_acknowledgment` | `tradePartnerAcknowledgments` |
| `tp_status_history` | `tradePartnerStatusHistory` |
| `tp_internal_note` | `tradePartnerInternalNotes` |
| `tp_audit_event` | `tradePartnerAuditEvents` |
| `tp_notification` | `tradePartnerReminderActions` *(semantics changed: an action a person took, not a delivery)* |

Field renames: `storageKey` → `storagePath`, `templateStorageKey` →
`templateStoragePath`. Postgres enums became string unions with identical values,
so no data means anything different.

**No data migration is needed** — no production portal data exists.

---

## 12. Phase 3 — what remains

In order:

1. **Emulator rule tests first.** See §7. Do not wire UI before the rules are
   verified.
2. **Firestore service layer**: reimplement `services/{invitations, status,
   documents, compliance-service, queue}.ts` against `firebase/repository.ts`.
   Use `runTransaction` for accepting an invitation, changing serious status,
   approving/rejecting a document with its audit event, and superseding.
3. **Auth routes**: `/api/portal/auth/session` (exchange ID token for cookie),
   sign-out, password reset, email verification.
4. **Rewire the app layer** (~15 files): swap `@/lib/portal/auth/guards` →
   `auth/firebase-guards`, `audit` → `firebase/audit`, `storage` →
   `firebase/storage`, and replace Drizzle queries with repository calls.
5. **Uploads**: browser uploads via the Web SDK to a server-generated path, then
   a finalize route verifies magic bytes before recording the document.
6. **Gmail draft UI**: replace every "email sent" string with the draft action.
7. **Delete** `src/lib/portal/db`, `email`, `auth/session.ts`, `storage.ts` (R2),
   `services/expiration.ts`, `drizzle/`, `scripts/migrate.ts`, `vercel.json` cron,
   and the `drizzle-orm`, `postgres`, `@aws-sdk/*`, `resend`, `bcryptjs`
   dependencies — **only once the replacement is tested**.
8. **Seed script** against the emulator: 20 document requirements + first admin.

The `feat/trade-partner-portal` branch stays as the working reference throughout.

---

## 13. Known limitations

1. **Security Rules are unverified.** §7. The single biggest risk on this branch.
2. **Firestore has no unique constraints.** Postgres enforced one-invitation-per-
   token-hash and one-acknowledgment-per-version with unique indexes. In
   Firestore this must be done with deterministic document IDs (already the
   design for reminder actions) or transactions. Do not assume a `where` query
   plus a write is atomic.
3. **No aggregate queries.** The admin dashboard counted with SQL. Firestore
   needs either a bounded client-side count or maintained counters.
4. **`in` queries cap at 30 values.** `repository.ts` chunks around this; keep
   that in mind for any new bulk read.
5. **Gmail drafts depend on the administrator actually sending.** That is the
   trade for removing the provider. The action queue is the mitigation.
6. **Email verification is not yet enforced**, only recorded.
