# Google Workspace Setup Runbook — hre-utah.com

Step-by-step guide for Brian to set up professional email on `hre-utah.com`.
Brian logs into all accounts manually. No passwords are shared with anyone.

**DNS provider:** Squarespace DNS (nameservers resolve to NS1 / `nsone.net`).
**Website:** hosted on Vercel — DO NOT touch these two records:
- `A` `@` → `76.76.21.21`
- `CNAME` `www` → `cname.vercel-dns.com`

**Baseline (verified July 3, 2026):** No MX, no SPF, no DMARC yet. Email is not set up.

---

## Step 1 — Find the domain / DNS account

Check these, in order:

1. **Squarespace account** → Settings → Domains → `hre-utah.com`.
2. The **Google account** that may have bought the domain.
3. Search your email inbox for any of: `hre-utah.com`, `Squarespace Domains`, `domain registration`, `Your domain`, `Vercel`, `Boardwalk`, `Hardy Real Estate`.

Once logged into Squarespace, go to:
**Settings → Domains → hre-utah.com → DNS → DNS Settings / Custom Records**

That "Custom Records" panel is where every record below gets added. Leave the existing Vercel A and CNAME records untouched.

---

## Step 2 — Create Google Workspace

Go to workspace.google.com → Start / Get Started.

- **Domain:** `hre-utah.com` (choose "use a domain I already own")
- **Primary user:** `brian@hre-utah.com`
- **Business name:** `Hardy Real Estate`

> IMPORTANT: Create ONLY ONE paid user (`brian@`). Do NOT create paid users for
> hello / listings / repairs — those become free aliases in Step 8.

---

## Step 3 — Add the Google verification TXT record

Google shows a verification record. In Squarespace Custom Records add it exactly:

| Type | Host | Value |
|------|------|-------|
| TXT | `@` | `google-site-verification=XXXXXXXXXXXX` (Google gives the exact string) |

Then click **Verify** in the Google setup wizard.

---

## Step 4 — Add the Gmail MX record

| Type | Host | Priority | Value |
|------|------|----------|-------|
| MX | `@` | 1 | `smtp.google.com` |

TTL: leave default / auto.

> Squarespace may offer a one-click "Google Workspace" MX preset — that's fine too;
> it adds the equivalent Google mail records.

---

## Step 5 — Add the SPF record

| Type | Host | Value |
|------|------|-------|
| TXT | `@` | `v=spf1 include:_spf.google.com ~all` |

> Only ONE SPF (`v=spf1...`) record may exist on `@`. If one already exists, merge — don't add a second.

---

## Step 6 — Add the starter DMARC record

| Type | Host | Value |
|------|------|-------|
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:brian@hre-utah.com` |

`p=none` = monitor only, blocks nothing. Tighten later once mail is confirmed passing.

---

## Step 7 — DKIM (after Gmail is active)

Once mail is flowing, in **Google Admin → Apps → Google Workspace → Gmail → Authenticate email**:
generate the DKIM key, then add the exact TXT record Google shows (host is usually
`google._domainkey`). Click **Start authentication**.

> Do not invent the DKIM value — only Google's console produces the real key.

---

## Step 8 — Add aliases (after brian@ works)

**Google Admin → Directory → Users → Brian Hardy → Add alternate email (alias):**

- `hello@hre-utah.com`
- `listings@hre-utah.com`
- `repairs@hre-utah.com`

All alias mail lands in Brian's one inbox. No extra cost. Optionally set each as a
"Send mail as" address in Gmail settings so replies can go out from the alias.

---

## Step 9 — Test

1. From a personal Gmail → send to `brian@hre-utah.com` (should arrive).
2. From personal Gmail → send to `hello@hre-utah.com` (should arrive in same inbox).
3. From `brian@hre-utah.com` → send to personal Gmail (should arrive, not in spam).
4. Optional: reply "send as" `hello@hre-utah.com` once configured.

---

## Step 10 — Verify DNS

Tell your assistant "records are added" and it will re-check MX / SPF / DMARC for you.

Expected results once propagated (can take 15 min – a few hours):
- MX → `smtp.google.com`
- TXT `@` → includes the Google verification string AND `v=spf1 include:_spf.google.com ~all`
- TXT `_dmarc` → `v=DMARC1; p=none; rua=mailto:brian@hre-utah.com`

---

## Step 11 — Website emails: NOT yet

Do NOT change the website's email addresses until both `brian@` and `hello@`
receive test mail successfully. After that, the site's `Hardyhomesutah@gmail.com`
references (see `HRE_DOMAIN_EMAIL_SETUP.md`) can be patched to the professional addresses.
