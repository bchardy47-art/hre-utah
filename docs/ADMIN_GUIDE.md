# Trade Partner Portal — Administrator Guide

How to run the portal day to day. For architecture and setup, see
[TRADE_PARTNER_PORTAL.md](./TRADE_PARTNER_PORTAL.md).

Sign in at **hre-utah.com/trade-partners/login** with your administrator account.

---

## The short version

A subcontractor moves through the portal in one direction:

**Invite → they apply → you review the application → you review each document →
you verify licence and insurance → approve to bid → approve to work.**

You can stop at "approved to bid" indefinitely. That is the point of having two
approvals: pricing a job carries no risk, showing up on site does.

---

## Where to start each day

Open **Compliance Queue**. It is every outstanding item across every trade
partner, ordered by urgency, each linking straight to where it gets resolved.

The order is not arbitrary:

1. **Expired documents** — someone may be on a job site uninsured. Always first.
2. **Documents waiting on your review** — they are blocked until you act.
3. **Applications waiting on review.**
4. **Licences needing verification.**
5. **Insurance expiring soon** — the partner has already been emailed.
6. **Ready to approve** — everything is clear and only your decision is missing.
7. **Missing required items.**
8. **Expired invitations** — someone never activated.

If the queue is empty, everyone is current.

---

## 1. Invite a trade partner

**Trade Partners → Add trade partner.**

You need: company name, contact name, contact email, primary trade. Phone and a
short message are optional — the message appears in the invitation email and is
useful for naming the project or the person who referred them.

What happens: the system creates the company record, sends a secure invitation
email, and logs the event. The link **expires in 14 days and works exactly once**.

From the company's Overview tab you can **resend** (which issues a fresh link and
kills the old one) or **revoke**. You can see when it was sent, opened, and
accepted.

> The invitation link is shown only once, at the moment you create it. The system
> stores only a hash of it, so it cannot be displayed again — that is why nobody
> who gets access to the database can mint a working link. If they lose it, use
> Resend.

---

## 2. Review the application

When a company submits, it appears in the queue as **Review submitted
application**.

Open the company → **Application** tab. You will see every section, the
disclosure answers, and who certified the submission with what title and when.

Two things worth actually reading:

- **The disclosures.** These are the company's own statements, not findings. A
  "yes" is not disqualifying — it is context. Read the explanation.
- **The certification block.** It records the signer's name, title, timestamp, and
  network address.

Then either:

- **Approve application** — required before the company can ever be approved to
  work.
- **Return for correction** — you must say what needs fixing. That text is emailed
  to them and shown on their dashboard. Nothing they entered is lost.

---

## 3. Review documents

Company → **Documents** tab. Each requirement shows its current state, the current
file, and every superseded version.

Open **Review this document** and choose:

| Decision | When | Reason required? |
|---|---|---|
| **Approve** | The document is correct and current. | No |
| **Reject** | Something is wrong. | **Yes** — it is emailed to them. |
| **Mark under review** | You have started but need to check something. | No |
| **Not applicable** | It genuinely does not apply to this company. | **Yes** |

Write rejection reasons as instructions, not verdicts. *"Hardy Homes is not listed
as certificate holder — ask your agent to reissue"* gets a correct document back
the same day. *"Rejected"* gets you a phone call.

**Not applicable** is the right tool for real exceptions — the owner-operator with
no employees who has a state workers' comp waiver instead of a certificate. It
stops that item blocking approval permanently, and records who decided and why.

Uploading a replacement never deletes the old version. Everything stays on file.

---

## 4. Verify licence and insurance

Company → **Compliance** tab.

**The portal does not check DOPL automatically.** You check the Utah DOPL record
yourself, then record what you found — result, source URL, and notes. Until a
licence is marked Verified, the company cannot be approved to work.

Look for: the licence is active, the classification covers the scope you would
give them, and the **licensed entity name matches the legal business name** on the
W-9. A mismatch there is worth a phone call before anything else.

The insurance table shows carriers, limits, and expiration dates at a glance.
Policy numbers are stored but not displayed — open the certificate when you need
one.

---

## 5. Approve to bid

Company → **Status & Approvals** → set **Approved to Bid**.

This means: *they may give you pricing.* It does not mean they may mobilize,
deliver material, or touch a job site. The portal tells them exactly that, in
those words, on their dashboard.

Use it early. A company can price work while its insurance endorsements are still
being sorted out.

---

## 6. Approve to work

Same tab, set **Approved to Work**.

**The system will refuse if anything mandatory is outstanding.** If you try, you
get a list of exactly what is blocking it. This is intentional — it is the
safeguard that stops a company with lapsed insurance being approved on a busy
Friday.

When everything is clear, the company appears in the queue as **Ready to approve**
and the profile shows a recommendation. The system never grants this itself.
Someone has to decide.

Approval to work does not authorize any specific project. Each project still needs
your written authorization — the portal says so in the approval email.

---

## 7. Handle expiring documents

Mostly, this happens without you.

The portal emails the trade partner **30, 14, 7 and 0 days** before any document
expires, and copies you. When something does expire:

- the document flips to **Expired**,
- the company loses work eligibility automatically,
- if it held work clearance, its status becomes **Inactive — Expired Documents**,
- both of you are notified,
- and the full history is preserved.

To restore them: the partner uploads a current copy, you approve it, then you set
the status back to Approved to Work. The system will recommend it once everything
is clear, but it will not do it for you — reinstating someone is a decision.

You will never see a company sitting at "Approved to Work" with expired insurance.

---

## 8. Suspend, reactivate, or mark Do Not Use

Company → **Status & Approvals**.

**Suspended** — temporarily ineligible. Requires a written reason. Their active
sessions end immediately.

**Do Not Use** — permanently ineligible. Requires a written reason. Sessions end
immediately.

Neither reactivates on its own. No amount of document uploading moves a company
out of these states; only you can, deliberately. That is the point.

To reactivate: set the status to whatever is now appropriate — usually Approved to
Bid, or Under Review if enough time has passed that you want another look.

---

## Internal notes

Every company and every document has a notes field marked **Administrator only**.
Trade partners never see these, in any view, ever.

Notes are append-only — they cannot be edited or deleted, and each records its
author and time. They form part of the audit trail. Use them for the things that
matter later and that you will not remember:

> *Reference contacted — strong framing crew, limited Utah County capacity.*
> *Insurance agent confirmed the endorsement is on the policy, not just the cert.*
> *Do not award work until the Alpine warranty claim is resolved.*

---

## The audit log

Every company profile has an **Audit Log** tab: invitations, sign-ins, application
changes, uploads, reviews, status changes, notes, expirations, and notifications —
with who, when, and from what address.

It is append-only. If you are ever asked why a company was approved on a given
date, this is the answer.

---

## Filters worth knowing

On the Trade Partners list:

- **Issue → Expiring soon** — this week's phone calls.
- **Eligibility → Work eligible** — who can actually be scheduled right now.
- **Eligibility → Bid only** — who can price but not start.
- **Trade + County** — who can cover a job in Wasatch County next month.
- **Search** matches company name, DBA, email, and phone.

---

## What the portal will not do

It will not tell a trade partner that approval means work is coming. Every status
message, email, and dashboard line says the same thing: approval is compliance
clearance, not an award. Keep it that way in your own emails too.

It will not make a legal document sufficient. It collects and tracks them.

It will not check DOPL, file with the State Construction Registry, or process a
lien waiver. Those are Version 2.
