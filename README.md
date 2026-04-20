# Hardy Real Estate — hre-utah.com

Modern Next.js website for Hardy Real Estate. Built with Next.js 14, TypeScript, and Tailwind CSS.

---

## Quick Start

```bash
cd hre-utah.com
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Adding Your Photo

The site has placeholder boxes where Brian's photo should appear. To add the photo:

1. Get a high-quality headshot or candid work photo (JPG or WEBP, at least 800px wide)
2. Name it `brian-hardy.jpg` and drop it in the `public/` folder
3. In `src/app/page.tsx`, find the `{/* Photo placeholder */}` comment in the hero section and replace the placeholder div with:
   ```tsx
   <Image
     src="/brian-hardy.jpg"
     alt="Brian Hardy — Utah Realtor and Handyman"
     fill
     className="object-cover object-top"
     priority
   />
   ```
4. Do the same in `src/app/about/page.tsx` in the story section

Also add `og-image.jpg` (1200×630px) to `public/` for social media sharing.

---

## Contact Form Setup

The contact form posts to `/api/contact` which uses [Resend](https://resend.com) to send emails.

**Steps:**
1. Create a free Resend account at https://resend.com
2. Get your API key
3. Add a verified sending domain (or use `onboarding@resend.dev` for testing)
4. Create a `.env.local` file:

```
RESEND_API_KEY=re_your_key_here
RESEND_FROM_EMAIL=contact@hre-utah.com
CONTACT_TO_EMAIL=Hardyhomesutah@gmail.com
```

The form sends an email to `CONTACT_TO_EMAIL` (defaults to `Hardyhomesutah@gmail.com`) whenever someone submits.

**Alternative:** If you don't want to set up Resend, replace the form action with [Formspree](https://formspree.io) — free for basic use. Change `ContactForm.tsx` to POST to your Formspree endpoint.

---

## Deployment (Vercel — recommended, free)

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Add your environment variables in Vercel's dashboard under Settings → Environment Variables:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `CONTACT_TO_EMAIL`
4. Deploy

Vercel detects Next.js automatically. Every push to `main` auto-deploys.

**Custom domain:** In Vercel → Settings → Domains, add `hre-utah.com` and follow the DNS instructions.

---

## Deployment (Alternative: Static Export)

If you want plain static files (no server needed):

1. In `next.config.ts`, add `output: 'export'`
2. Remove the `/api/contact` route (static export can't run server code)
3. Run `npm run build` — this generates a `out/` folder
4. Upload `out/` to any static host (Netlify, GitHub Pages, S3, etc.)

Note: with static export, the contact form won't work without a third-party service like Formspree.

---

## Pages

| Route | File | Purpose |
|---|---|---|
| `/` | `src/app/page.tsx` | Homepage |
| `/real-estate` | `src/app/real-estate/page.tsx` | Real estate services |
| `/handyman` | `src/app/handyman/page.tsx` | Handyman services |
| `/about` | `src/app/about/page.tsx` | About Brian |
| `/contact` | `src/app/contact/page.tsx` | Contact form + info |
| `/api/contact` | `src/app/api/contact/route.ts` | Form submission API |

## Components

| File | Purpose |
|---|---|
| `Nav.tsx` | Sticky header with mobile menu |
| `Footer.tsx` | Site footer with links + contact |
| `SectionHeader.tsx` | Reusable section headline |
| `TestimonialCard.tsx` | Star-rated review card |
| `FAQAccordion.tsx` | Expandable FAQ component |
| `ProcessStep.tsx` | Numbered step with description |
| `ContactForm.tsx` | Contact form with validation |

---

## Updating Content

All copy lives directly in the page files. To update:

- **Phone number:** Search for `8013800445` and replace all (currently in Nav.tsx, Footer.tsx, and every page)
- **Email:** Search for `Hardyhomesutah@gmail.com` and replace all
- **Service areas:** Update the arrays in `page.tsx`, `handyman/page.tsx`, and `contact/page.tsx`
- **Testimonials:** Update the `testimonials` array in `src/app/page.tsx`
- **Handyman services list:** Update the `services` array in `src/app/handyman/page.tsx`

---

## SEO

Each page has:
- Unique `<title>` and `<meta description>`
- Canonical URL
- OpenGraph tags for social sharing
- Local Business JSON-LD schema (in `layout.tsx`)
- Semantic HTML heading structure

**To improve SEO further:**
1. Add Google Business Profile and keep it updated
2. Get reviews on Google (they boost local search rankings significantly)
3. Submit the sitemap to Google Search Console
4. Consider adding a `/service-area` page with individual city pages for deeper local SEO

---

## Image Recommendations

- **Hero/About:** Professional headshot of Brian — ideally outdoors or in work context
- **OG image:** Brian's photo with "Hardy Real Estate" text overlay (1200×630px)
- **Favicon:** Logo or "HR" monogram — generate at https://favicon.io

**Icon library:** The site uses [Lucide React](https://lucide.dev) for all icons. Browse the library to swap or add icons without installing anything new.

---

## Tech Stack

- [Next.js 14](https://nextjs.org) — React framework with App Router
- [TypeScript](https://www.typescriptlang.org) — Type safety
- [Tailwind CSS](https://tailwindcss.com) — Utility-first styling
- [Lucide React](https://lucide.dev) — SVG icon library
- [Resend](https://resend.com) — Transactional email for contact form
- [Vercel](https://vercel.com) — Hosting (recommended)
