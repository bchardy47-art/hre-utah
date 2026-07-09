# HRE Utah — Domain & Professional Email Setup

Setup guide for launching `hre-utah.com` as the professional domain and email system for Hardy Real Estate.

---

## Goal

Set up `hre-utah.com` as the professional domain for Hardy Real Estate, with professional email addresses replacing the current personal Gmail (`Hardyhomesutah@gmail.com`).

Target addresses:

- `brian@hre-utah.com` — primary inbox
- `hello@hre-utah.com` — general public contact
- `listings@hre-utah.com` — seller leads
- `repairs@hre-utah.com` — handyman crossover

---

## Recommended email setup

Use **Google Workspace** for the real inbox. It gives Brian a familiar Gmail experience on a professional domain, with reliable deliverability and mobile apps he already knows.

- **Primary inbox:** `brian@hre-utah.com` (this is the paid Google Workspace mailbox)
- **Aliases** (route to the primary inbox, no extra cost): `hello@hre-utah.com`, `listings@hre-utah.com`, `repairs@hre-utah.com`

Aliases are added in the Google Admin console under **Users → Brian Hardy → Add alternate email**. All mail sent to an alias lands in Brian's one inbox, and he can set each alias as the "send as" address when replying.

---

## DNS provider recommendation

Use **Cloudflare DNS** if available. It is clean, fast, free, and easy to manage. Point the domain's nameservers at Cloudflare, then add all mail records there.

> If the domain was purchased somewhere that makes moving nameservers awkward, the same records below work at any DNS provider (Namecheap, GoDaddy, Google Domains successor, etc.). The record values do not change — only where you enter them.

---

## Google Workspace DNS records

Add these records at your DNS provider (Cloudflare recommended). Values marked *(placeholder)* are filled in from the Google Admin console during setup.

### 1. Google domain verification (TXT)

| Type | Name | Value |
|------|------|-------|
| TXT | `@` | `google-site-verification=XXXXXXXXXXXXXXXX` *(placeholder — Google provides the exact string during signup)* |

### 2. Gmail MX

| Type | Name | Priority | Value |
|------|------|----------|-------|
| MX | `@` | 1 | `smtp.google.com` |

> Note: This is Google's current single-record MX setup. If your DNS provider or an older guide expects the legacy five-record set (`ASPMX.L.GOOGLE.COM`, etc.), that also works — but the single `smtp.google.com` record above is the current recommendation.

### 3. SPF (TXT)

| Type | Name | Value |
|------|------|-------|
| TXT | `@` | `v=spf1 include:_spf.google.com ~all` |

### 4. DKIM (TXT)

DKIM cannot be filled in until Gmail authentication is turned on. In the Google Admin console go to **Apps → Google Workspace → Gmail → Authenticate email**, generate the DKIM key, and Google will show the exact record.

| Type | Name | Value |
|------|------|-------|
| TXT | `google._domainkey` *(name provided by Google Admin)* | `v=DKIM1; k=rsa; p=...` *(long key provided by Google Admin)* |

> **DKIM note:** Google Admin generates the exact TXT name and value after Gmail authentication is enabled. Add it exactly as shown, then click **Start authentication** in the console.

### 5. DMARC (TXT) — starter policy

| Type | Name | Value |
|------|------|-------|
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:brian@hre-utah.com` |

> Start with `p=none` (monitor only) so nothing legitimate gets blocked while you confirm SPF and DKIM are passing. Once reports look clean, tighten to `p=quarantine` and later `p=reject`.

---

## Future transactional email

If HRE later adds contact forms, seller intake forms, or app-generated emails, send those through **Resend** — not through the personal Gmail inbox. The site is already wired for Resend (see `.env.example` and `src/app/api/contact/route.ts`).

Recommended sending addresses on a Resend-verified subdomain or the main domain:

- `no-reply@hre-utah.com` — automated notifications
- `forms@hre-utah.com` — contact / intake form submissions

**Do not mix transactional sending with the personal Gmail inbox until needed.** Keeping automated mail on Resend protects the deliverability and reputation of Brian's real inbox. When you do enable Resend, it will provide its own SPF/DKIM records (ideally on a `send.` subdomain) so they don't conflict with the Google Workspace records above.

---

## Public-facing email plan

| Address | Use |
|---------|-----|
| `hello@hre-utah.com` | KSL ads and general public contact |
| `brian@hre-utah.com` | Direct client communication |
| `listings@hre-utah.com` | Seller leads |
| `repairs@hre-utah.com` | Handyman crossover |

---

## Website email references to update after email is live

The website currently uses the personal Gmail address in several places. Once the new mailboxes are active, these should be updated to the professional addresses (listed here for reference — not yet changed):

- `src/app/layout.tsx` — site metadata `email` field
- `src/app/contact/page.tsx` — contact page `mailto:` link and displayed address
- `src/components/Footer.tsx` — footer `mailto:` link and displayed address
- `src/app/page.tsx` — homepage contact line
- `src/app/handyman/page.tsx` — handyman page contact line
- `src/app/api/contact/route.ts` — `CONTACT_TO_EMAIL` fallback and `RESEND_FROM_EMAIL` fallback
- `.env.example` — `RESEND_FROM_EMAIL` and `CONTACT_TO_EMAIL` defaults

Suggested mapping: public contact display → `hello@hre-utah.com`; contact-form delivery (`CONTACT_TO_EMAIL`) → `brian@hre-utah.com`; Resend sender (`RESEND_FROM_EMAIL`) → `forms@hre-utah.com` or `no-reply@hre-utah.com`.

---

## Suggested setup order

1. Purchase / confirm ownership of `hre-utah.com`.
2. Move DNS to Cloudflare (or confirm current DNS provider).
3. Sign up for Google Workspace with `brian@hre-utah.com`; add the verification TXT and MX records.
4. Add SPF and DMARC records.
5. Enable Gmail authentication → add the DKIM record Google generates.
6. Add the three aliases (`hello`, `listings`, `repairs`).
7. Send/receive test emails; confirm SPF/DKIM/DMARC pass (e.g. mail-tester.com).
8. Later, when forms go live: verify the domain in Resend and switch site env vars.
9. Update the website email references listed above.
