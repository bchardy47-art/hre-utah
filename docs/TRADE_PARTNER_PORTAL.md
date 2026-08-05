# Hardy Homes Trade Partner Portal — Technical Documentation

Version 1. Internal documentation for the private subcontractor onboarding and
compliance portal that lives inside the `hre-utah.com` codebase.

For the day-to-day operating steps, see [ADMIN_GUIDE.md](./ADMIN_GUIDE.md).

---

## 1. Overview

The portal takes a subcontractor from invitation through to a defensible answer
to one question: **is this company legally and operationally cleared to work on a
Hardy Homes project right now?**

It does that by collecting company information and documents, tracking review and
expiration state, and computing eligibility from that state rather than from
anyone's memory.

Two ideas run through the whole design:

**Compliance is derived, never stored.** Eligibility is recomputed on every read
from the documents, acknowledgments, and requirements as they exist at that
moment. There is no cached "is approved" flag that can drift out of date. The one
thing that *is* stored is `tp_company.status`, because that is an administrative
decision rather than a derivation — and the engine only ever *recommends* changes
to it.

**Clearance is not an award.** Every status label, email, and dashboard sentence
says the same thing: approval means compliance is satisfied, not that work will
be given. That wording is centralised so it cannot drift.

### What is deliberately out of scope in Version 1

Bid management, work orders, scheduling, change orders, invoicing, payments, lien
waiver processing, State Construction Registry automation, performance
scorecards, warranty callbacks, native contract signing, and homeowner or lender
portals. The schema and navigation leave room for these (see §14) but none of it
is built.

---

## 2. Route map

Nothing below appears in the public site navigation, and none of it is in
`sitemap.xml`. `robots.txt` disallows all of it. **Hiding links is not security** —
every route is protected server-side as described in §5.

### Trade partner

| Route | Auth | Purpose |
|---|---|---|
| `/trade-partners/login` | Public | Sign in. No public registration exists. |
| `/trade-partners/apply/[token]` | Public, token-gated | Accept an invitation and create the account. |
| `/trade-partners/signed-out` | Public | Post-sign-out landing. |
| `/trade-partners/dashboard` | Trade partner | Status, what to do next, compliance summary. |
| `/trade-partners/company` | Trade partner | The seven-section application (`?section=` selects one). |
| `/trade-partners/documents` | Trade partner | Upload, replace, acknowledge; view rejection reasons. |

### Administrator

| Route | Auth | Purpose |
|---|---|---|
| `/admin/trade-partners` | Admin | Summary tiles, action queue, filterable list. |
| `/admin/trade-partners/new` | Admin | Create and send an invitation. |
| `/admin/trade-partners/[id]` | Admin | Full company record (`?tab=` selects a section). |
| `/admin/trade-partners/compliance` | Admin | The full action queue, filterable by kind. |

The company profile tabs are `overview`, `application`, `compliance`,
`documents`, `references`, `status`, `audit`.

### API

| Route | Auth | Purpose |
|---|---|---|
| `POST /api/portal/uploads/prepare` | Session + company access | Returns a signed R2 PUT URL. |
| `POST /api/portal/uploads/finalize` | Session + company access | Verifies the object and records the document. |
| `GET /api/portal/documents/[id]/download` | Session + company access | Mints a 60-second signed download URL. |
| `GET\|POST /api/portal/cron/compliance` | `CRON_SECRET` or admin | The nightly sweep. |

---

## 3. Roles and permissions

Two roles in Version 1: `ADMIN` and `TRADE_PARTNER`.

| Capability | Admin | Trade partner |
|---|:--:|:--:|
| Invite a company | ✅ | — |
| See all companies | ✅ | — |
| See own company | ✅ | ✅ (only its own) |
| Complete / update the application | ✅ | ✅ |
| Upload documents | ✅ | ✅ |
| **Approve or reject a document** | ✅ | ❌ |
| **Change company status** | ✅ | ❌ |
| **Verify a licence** | ✅ | ❌ |
| Read internal notes | ✅ | ❌ never |
| Read the audit log | ✅ | ❌ |
| Acknowledge a policy | — | ✅ |

A trade partner cannot approve its own documents, change its own status, or read
another company's anything. Those are enforced in code, not by hiding buttons —
see §5 and the tests in §11.

---

## 4. Status model

### Company statuses

| Status | Meaning |
|---|---|
| `INVITED` | Invitation sent, account not yet created. |
| `APPLICATION_STARTED` | Account exists, application partially complete. |
| `APPLICATION_SUBMITTED` | Submitted, waiting on Hardy Homes. |
| `DOCUMENTATION_PENDING` | Required documents missing or needing correction. |
| `UNDER_REVIEW` | Being reviewed. |
| `APPROVED_TO_BID` | **May price work. May not mobilize or perform work.** |
| `APPROVED_TO_WORK` | **All mandatory compliance items approved and current.** |
| `PROBATIONARY` | Approved with added oversight. |
| `PREFERRED` | Trusted partner in good standing. |
| `SUSPENDED` | Temporarily ineligible. Terminal for automation. |
| `DO_NOT_USE` | Permanently ineligible. Terminal for automation. |
| `INACTIVE_EXPIRED_DOCUMENTS` | A mandatory document expired; work clearance removed. |

### Who may set what

- **Administrator only:** `APPROVED_TO_WORK`, `PREFERRED`, `SUSPENDED`, `DO_NOT_USE`.
- **Requires a written reason:** `SUSPENDED`, `DO_NOT_USE`, `PROBATIONARY`.
- **The only change automation may make:** demoting a company that holds work
  clearance to `INACTIVE_EXPIRED_DOCUMENTS` when a mandatory document expires.
- **`SUSPENDED` and `DO_NOT_USE` never self-reactivate.** Nothing automatic moves
  a company out of them; only an explicit administrator action does.

`changeCompanyStatus()` in `src/lib/portal/services/status.ts` is the only place
`tp_company.status` is written. It refuses `APPROVED_TO_WORK` outright when the
compliance engine reports the company is not work-eligible — so an administrator
cannot approve a company with expired insurance even by accident.

Suspension immediately revokes every active session for that company's users.

### Document states

`MISSING`, `SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `EXPIRED`,
`NOT_APPLICABLE`, `SUPERSEDED`.

---

## 5. Security

### Authentication

Opaque, database-backed sessions rather than JWTs. The cookie holds 256 bits of
CSPRNG output; the database stores only its SHA-256. Because session state lives
server-side, a session can be revoked instantly — a signed JWT cannot.

- Cookie: `hh_tp_session`, `httpOnly`, `secure` in production, `SameSite=Lax`.
- Passwords: bcrypt, cost 12, minimum 12 characters.
- Lockout: five failed attempts locks the account for 15 minutes. This is stored
  in the database, so it holds across serverless instances.
- Every request re-reads the user row, so deactivating an account or changing a
  role takes effect on the very next request.

### The middleware is not the security boundary

`src/middleware.ts` runs on the edge runtime, where the database and bcrypt are
unavailable. All it can do is check whether a session cookie is *present*. A
forged cookie sails straight through it.

The real boundary is `src/lib/portal/auth/guards.ts`, called at the top of every
protected page, Server Action, and Route Handler. It re-reads the session and user
from the database. **Deleting the middleware would make the portal slightly less
pleasant to use and no less secure.** This is verified in the smoke tests: a
request carrying a forged cookie reaches the guard and is redirected to sign-in.

Server Actions are public HTTP endpoints. Every one of them calls a guard itself
rather than assuming the page that rendered the form was authorized.

### Record-level authorization

`assertCompanyAccess(session, companyId)` is the single place the "may this person
see this company" decision is made. An administrator may reach any company; a
trade partner may reach exactly one. Both sides of the comparison must be
non-empty, so a blank id cannot act as a wildcard. Anything else throws.

Because the decision comes from the database row rather than the URL, changing an
id in the address bar returns 403 and writes an audit event.

### Private file storage

The R2 bucket is private, and object keys are opaque and randomised
(`companies/<id>/<year>/<CODE>/<32-hex>.<ext>`), so a key cannot be guessed from a
company name. Downloads go through `/api/portal/documents/[id]/download`, which:

1. authenticates the session,
2. loads the document row and reads its owning company,
3. authorizes that company against the session,
4. and only then mints a 60-second signed URL.

Uploads are validated by **magic bytes, not file extension**. A `.pdf` that is
really HTML is rejected. Filenames are reduced to their final path segment and
stripped of characters that could break a `Content-Disposition` header, so
traversal and header injection cannot survive.

### Why uploads go straight to R2

Vercel caps a serverless request body at 4.5 MB, and a phone photo of a
certificate of insurance is routinely larger. So the browser uploads directly to
R2 using a five-minute signed PUT URL.

That creates one risk and it is handled explicitly: the browser writes an object
the server has not inspected. So the object key is **server-generated** (the
client cannot choose where it lands), and nothing is recorded in the database
until `finalizeDocumentUpload` has re-read the object's real size and leading
bytes back from R2. Finalize also rejects any storage key that does not begin with
`companies/<that company's id>/`. An object that fails verification is deleted and
never becomes a document.

### Sensitive data handling

- **Full EIN is never stored.** Only `ein_last4`. The uploaded W-9 is the system
  of record, and the admin UI shows `•••• 1234`.
- **Bank routing and account numbers are never collected or stored.** ACH setup is
  tracked as an acknowledgment flag only, and the form says so.
- Audit metadata passes through a redactor that replaces anything whose key looks
  like an EIN, SSN, password, token, policy number, or routing number.
- Email addresses are masked in audit summaries and logs (`b***n@example.com`).
- Portal responses set `Cache-Control: no-store` and `X-Robots-Tag: noindex`.

### Rate limiting

`src/lib/portal/rate-limit.ts` is a per-instance fixed window, and the file says
so plainly. On Vercel each warm lambda holds its own counter, so the effective
limit is (limit × instances). That is enough to blunt credential stuffing and
upload storms at this scale and costs nothing. The **account lockout is stored in
the database and is durable** — that is the guarantee that matters. If a hard
global limit is ever needed, swap the one file for Upstash Redis or a Postgres
table; the interface is deliberately narrow.

---

## 6. Compliance rules

All of it lives in `src/lib/portal/compliance.ts` as pure functions of data passed
in — no database, no I/O. That is what makes the rules unit-testable and keeps UI
components from deciding eligibility themselves.

### Approved to Bid

Hard requirements: application submitted, legal business name, primary trade,
primary contact with name and email, and no requirement flagged `blocksBid` in a
failing state. A missing licence record is a **soft** blocker — it is surfaced but
does not prevent bidding.

### Approved to Work

Everything above, plus:

- application **approved** by an administrator,
- contractor licence **verified** by an administrator,
- every applicable, required, `blocksWork` requirement in state `APPROVED` and not
  past its expiration date,
- and a final administrator action.

The engine reports `workEligible`; it never applies the status.

### Applicability

A requirement applies unless it is scoped out. `applicableTrades` empty means all
trades, and it matches against the primary **and** additional trades.
`applicableEntityTypes` empty means all entity types — this is how a sole
proprietor is not asked for an entity registration. Non-applicable requirements
are excluded from the completion percentage entirely, so an electrician's licence
requirement does not drag down a framer's score.

### Expiration semantics

A document expires at the **end** of its expiration date. A certificate expiring
today is still current today. Demoting a partner a day early would block real work
in the field, so the boundary is tested explicitly.

An `APPROVED` row whose date has passed is treated as `EXPIRED` for eligibility
purposes **immediately**, before the nightly sweep rewrites it. Eligibility never
depends on the sweep having already run.

### Versioning

Only the newest non-superseded document counts. Uploading a replacement marks the
old row `SUPERSEDED`, links it to its replacement, and retains its R2 object.
History is never destroyed.

---

## 7. Document requirements

Requirements are **configuration, not code** — rows in `tp_document_requirement`.
An administrator can add, retire, or re-scope one without a deploy.

Each supports: name, category, description, required flag, applicable trades,
applicable entity types, has-expiration, allow-not-applicable, blocks-bid,
blocks-work, requires-review, acknowledgment-only, template file and version, sort
order, and active flag.

Twenty are seeded across four categories: Tax and Corporate, Licensing, Insurance,
and Agreements and Policies. See `src/lib/portal/requirements.ts`.

`npm run portal:seed` upserts by `code` and only refreshes descriptive fields —
applicability, template keys, and active state are left alone, so re-running it
never clobbers an administrator's tuning.

---

## 8. File storage

Cloudflare R2 via the S3-compatible API (`@aws-sdk/client-s3`). No
Cloudflare-specific dependency, so moving to S3 or R2-compatible storage is an
endpoint change.

**Setup:** create a bucket with public access **disabled**, then an R2 API token
scoped to it (Cloudflare → R2 → Manage R2 API Tokens). Fill in `R2_ACCOUNT_ID`,
`R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`.

### CORS is required — uploads fail silently without it

Because the browser PUTs directly to R2 rather than through our own origin, the
bucket needs a CORS policy. **Without it every upload fails with an opaque
"Failed to fetch" in the browser and nothing at all in the server logs**, because
the request is blocked before it ever leaves the browser. This was caught during
preview acceptance testing and is the single most likely thing to break an
otherwise correct deployment.

In Cloudflare → R2 → your bucket → Settings → CORS policy:

```json
[
  {
    "AllowedOrigins": ["https://hre-utah.com"],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["content-type"],
    "ExposeHeaders": ["etag"],
    "MaxAgeSeconds": 3600
  }
]
```

Add each Vercel preview origin you intend to test from as an additional entry.
Do not use `"*"` for `AllowedOrigins` in production: the presigned URL is the
capability, and narrowing the origin limits where a leaked one can be replayed
from.

Verify after deploying by uploading a document larger than 4.5 MB. That size is
the real test — anything smaller might have squeezed through a proxied path,
whereas a large file only succeeds if the direct-to-R2 route genuinely works.

Accepted types: PDF, JPEG, PNG, HEIC, WebP. Default limit 15 MB.

Superseded documents are never deleted — their objects are retained alongside
their history. `deleteObject` is used only to clean up an upload that failed
verification.

---

## 9. Email and expiration reminders

### Email

Resend, using the account already described in this repository. No second
provider was introduced. Fourteen templates in
`src/lib/portal/email/templates.ts`, light-background for reliable rendering on
phones, with the HRE burnt-orange accent.

**Duplicate suppression is structural.** Every send first claims a row in
`tp_notification` keyed by `dedupe_key`, which carries a unique index. Two
concurrent lambdas racing on the same reminder cannot both win the insert.

Without `RESEND_API_KEY`, the mailer degrades to a console transport and still
records the notification row — so the whole portal works end to end in
development with no email account.

### Expiration reminders

Reminders fire at **30, 14, 7, and 0 days** before expiry, to the trade partner's
users and to the administrator address.

`vercel.json` registers a Vercel Cron job hitting
`/api/portal/cron/compliance` daily at 13:00 UTC (≈06:00 Mountain). This is a real
scheduler on the confirmed host — not an invented one.

The endpoint authenticates via the `CRON_SECRET` bearer token Vercel sends, or an
authenticated administrator session for manual runs. **Without `CRON_SECRET` set,
it rejects every unauthenticated call**, so reminders will silently not fire until
you set it. That is deliberate: a public URL that blasts email is worse.

The sweep is idempotent and safe to re-run. It:

1. marks past-due approved documents `EXPIRED`,
2. sends threshold reminders,
3. demotes companies that lost work clearance to `INACTIVE_EXPIRED_DOCUMENTS`,
4. expires stale invitations and purges dead sessions.

Each step is independently error-trapped and reports into a JSON summary, so one
failure does not abort the rest.

---

## 10. Data model

Seventeen tables, all prefixed `tp_` so nothing collides with future public-site
tables.

```
tp_user                    tp_session
tp_company                 tp_contact
tp_invitation              tp_application
tp_license                 tp_insurance_policy
tp_project_reference       tp_document_requirement
tp_document                tp_document_review
tp_acknowledgment          tp_status_history
tp_internal_note           tp_audit_event
tp_notification
```

Two places the model deliberately departs from the brief:

- **`TradePartnerProjectHistory` and `TradePartnerReference` are merged** into
  `tp_project_reference`. A reference without a project has no meaning in this
  workflow, and splitting them would have added a join for nothing.
- **Section A lives on `tp_company`, not on `tp_application`.** Durable company
  facts belong to the company so the partner has one place to keep them current;
  the application row tracks the *lifecycle* plus the point-in-time attestations
  (Sections F and G) that only make sense frozen at submission.

Every table has created/updated timestamps. Companies use `archived_at` for soft
deletion. Indexes cover status, expiration date, company, trade, and invitation
token lookup.

`tp_audit_event.action` is a `text` column driven by TypeScript constants rather
than a database enum, so Version 2 events do not require a migration.

### ORM: Drizzle, not Prisma

Prisma was the first choice and was replaced. Prisma downloads platform-specific
query-engine binaries at install time from `binaries.prisma.sh`, which this build
environment blocks — meaning the build could not be verified. Drizzle is pure
TypeScript with no native engine, which also removes engine cold-start from
serverless invocations and makes migrations plain reviewable SQL. `DATABASE_URL`
is a standard connection string, so Neon, Supabase, RDS, or a local Postgres all
work unchanged.

---

## 11. Testing

121 tests, all passing. `npm test`.

**84 unit tests** covering the compliance engine (applicability, expiration
boundaries, bid vs work eligibility, status recommendations, versioning),
authorization guards, token generation and hashing, password policy, upload
validation, filename sanitisation, storage keys, audit redaction, email masking,
and rate limiting.

**37 integration tests against a real PostgreSQL database.** These exercise the
constraints that actually enforce the rules — the unique index on
`dedupe_key`, the `status = 'PENDING'` predicate that makes an invitation
single-use, the foreign keys. Mocking those would only test the mock.

```bash
createdb portal_test
DATABASE_URL=postgres://localhost/portal_test npm run db:migrate
DATABASE_URL=postgres://localhost/portal_test npm test
```

Without `DATABASE_URL` the integration files skip and the unit tests still pass.

Coverage of the required cases from the brief:

| Requirement | Where |
|---|---|
| Trade partner cannot access admin pages | smoke + `security.test.ts` |
| Trade partner cannot access another company | `security.test.ts`, smoke (403) |
| Unauthenticated user redirected | smoke (307) |
| Valid / expired / revoked / used invitation | `invitations.test.ts` |
| Missing, rejected, expired item blocks work | `compliance.test.ts` |
| Not-applicable does not block | `compliance.test.ts` |
| Suspended cannot self-reactivate | `compliance.test.ts`, `status-and-documents.test.ts` |
| Unauthorized download rejected | smoke (403) |
| File type validation | `security.test.ts` |
| Replacement preserves prior version | `compliance.test.ts` |
| Approval/rejection creates audit entries | `status-and-documents.test.ts` |
| Expiration removes work eligibility | `expiration-sweep.test.ts` |
| Approval to work requires admin action | `status-and-documents.test.ts` |

---

## 12. Environment variables

See `.env.example` for the annotated list. Required for the portal:
`DATABASE_URL`, `PORTAL_SESSION_SECRET`, `NEXT_PUBLIC_APP_URL`, `R2_ACCOUNT_ID`,
`R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`. Strongly recommended:
`CRON_SECRET`, `PORTAL_FROM_EMAIL`, `PORTAL_ADMIN_EMAIL`.

The public marketing pages build and run without any of them.

---

## 13. Setup and deployment

### Local

```bash
npm install
cp .env.example .env.local          # fill in DATABASE_URL and PORTAL_SESSION_SECRET
npm run db:migrate                  # apply SQL migrations
npm run portal:seed                 # requirements + first administrator
npm run portal:seed -- --demo       # optional: four demo trade partners
npm run dev
```

Then sign in at `http://localhost:3000/trade-partners/login`.

### Deploying to Vercel

1. Add every portal variable in Project Settings → Environment Variables.
2. Deploy.
3. Run `npm run db:migrate` once against the production database, from a machine
   with `DATABASE_URL` pointing at it. **Migrations do not run automatically on
   deploy** — that is deliberate, so a schema change is never applied by surprise.
4. Run `npm run portal:seed` once with `PORTAL_SEED_ADMIN_EMAIL` and
   `PORTAL_SEED_ADMIN_PASSWORD` set, then remove those two variables.
5. Confirm the cron job appears under Project → Settings → Cron Jobs, and that
   `CRON_SECRET` is set.
6. Sign in and change the seeded administrator password.

Demo fixtures refuse to run when `NODE_ENV=production` unless
`PORTAL_ALLOW_SEED=true` is explicitly set. Leave it unset.

### A note on `netlify.toml`

The repository contains a `netlify.toml` configured for a static export to `out/`.
It is stale — the site builds as a Next.js server application and the portal
cannot run as a static export. It was left untouched because it is unrelated to
this work, but it should be deleted or corrected before anyone tries to deploy
from it.

---

## 14. Known limitations

1. **No DOPL integration.** Licence verification is manual by design. The UI says
   so plainly and records who verified, when, from what source, and with what
   notes. Nothing claims automatic verification.
2. **Legal templates are drafts.** See §15.
3. **No electronic signature.** The Master Subcontract Agreement accepts an
   upload of an externally signed PDF. Policy acknowledgments are native
   click-through with name, title, timestamp, IP, and version recorded — which is
   appropriate for acknowledgments and not a DocuSign substitute.
4. **Rate limiting is per-instance.** See §5. Account lockout is durable.
5. **Compliance is computed on read.** Correct and never stale, but O(companies)
   per admin list load. The batch loader keeps it to a fixed number of queries
   rather than N+1; at hundreds of partners this is fine, at tens of thousands it
   would want a materialised summary with a defined recalculation strategy.
6. **Reminders fire on exact threshold days.** If the cron misses a day entirely,
   that specific threshold is skipped — though the next lower one still fires, so
   nothing goes completely unnoticed.
7. **Invitation open tracking is best-effort** — set when the landing page
   renders, which misses a link opened and abandoned before load.
8. **One portal account per company.** The schema supports several
   (`tp_user.company_id`), but there is no invite-a-colleague UI yet.
9. **No password reset flow.** An administrator must currently re-invite. This is
   the most likely first thing to want.

---

## 15. Legal template replacement

**Nothing in this codebase is attorney approved, and nothing claims to be.**

Every agreement and policy ships with `templateIsDraft: true` and renders a
`DraftTemplateNotice` — a single shared component, so the wording cannot drift
into implying approval on one screen but not another.

The acknowledgment summaries in `requirements.ts` are plain-language operational
summaries so a trade partner knows what they are agreeing to. They are explicitly
**not** the legal agreement.

To replace a draft once counsel has approved wording:

1. Upload the approved document and set `template_storage_key`,
   `template_filename`, and `template_version` on the requirement row.
2. Set `template_is_draft = false`. The draft notice disappears automatically.
3. Bump `template_version`. Acknowledgments are unique per
   `(company, requirement, version)`, so **a new version requires every company to
   re-acknowledge** — existing acknowledgments are preserved against the old
   version rather than silently reinterpreted as agreement to new terms.

No code change is required for any of this.

If the Section G certification wording changes, bump `CERTIFICATION_VERSION` in
`constants.ts`. Each submission records the version it certified against.

---

## 16. Version 2 hooks

The schema and navigation anticipate, without building:

- **Bidding** — `APPROVED_TO_BID` already separates pricing from mobilization.
- **Work orders** — a work order would reference a company and re-check
  `evaluateCompliance().workEligible` at authorization time; the engine is already
  a pure function and needs no change.
- **Lien waivers and SCR** — `tp_acknowledgment` already versions policy
  agreements per company.
- **Performance scorecards** — `tp_audit_event` is the event stream to build on.
- **Warranty callbacks** — `tp_project_reference` is the shape a project record
  would extend.
- **More roles** — `tp_user.role` is an enum; a `REVIEWER` or `ACCOUNTING` role is
  an added value plus guard cases, since every check funnels through
  `guards.ts`.
- **Multiple users per company** — already supported by the schema; needs UI.
