# Verdant — Dental Atelier

A luxury dental-clinic site with a full backend, an AI receptionist that answers
patient questions and books appointments, and an admin dashboard.

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · shadcn-style UI ·
Prisma + **PostgreSQL (Neon)** · **Claude (`claude-opus-5`)**

## Backend & AI receptionist

**`POST /api/chat`** — the virtual receptionist.

- Runs **Claude** with two write tools (`save_patient_details`, `book_appointment`)
  through a manual tool loop, so it can complete a real booking mid-conversation.
- The clinic catalogue (treatments, prices, dentists, policies) is loaded from the
  database into the **cached** half of the system prompt; per-conversation state
  sits in a second block after the cache breakpoint, so it can change every turn
  without invalidating the prefix.
- Prices and policies are only ever quoted from the database — the prompt forbids
  inventing them, and editing a row in `/admin` is correct on the very next reply.
- **Never dies:** with no `ANTHROPIC_API_KEY`, or on any API error, it silently
  falls back to a deterministic rule-based engine that still answers from the
  knowledge base and still completes bookings.
- A keyword **urgency safety net** runs on every message regardless of engine, so
  a dental emergency is surfaced even if the model is down.

**Data model** — `Appointment`, `ContactMessage`, `ChatSession`, `ChatMessage`,
`KnowledgeItem`, `Treatment`, `Dentist`, `AdminSession`.

**Admin dashboard** (`/admin`) — appointments with status workflow, full chat
transcripts with what the bot collected, contact messages, and editable
treatments / dentists / knowledge base. Single operator account: scrypt-hashed
password, opaque server-side sessions, `__Host-` cookie, origin checks and rate
limiting on every mutating route.

Two deliberate architecture choices, both learned the hard way:

- `lib/env.ts` and `lib/prisma.ts` validate and construct **on first use, never at
  module import**. Next.js imports every route module at build time, so a
  top-level throw turns a runtime config problem into a deploy blocker.
- Every value read from `process.env` is trimmed and de-quoted, because values
  pasted into a dashboard routinely arrive wrapped in stray quotes.

Palette: canvas `#F4F3F8`, signature green `#98BF0A`, cool near-black ink, soft
`0.75rem` radius. Photography is greyscale, resolving to colour on hover.

### Reference → section map

| Section | Built from |
| --- | --- |
| Scroll-locked hero (`scroll-reveal-hero.tsx`) | The pasted `MetroHero` mechanic, adapted to a **2-image** reveal: `/doctors/adrian-vale.jpg` → `/reveal/tooth-blue.jpg` (Pic 2). |
| Hero band (`statement.tsx`) | Pic 1 — badge, split headline, portrait with organic shape + floating 24/7 card, icon stat row. |
| Services (`services.tsx`) | Pic 4 — centered cards, rounded icon tile, "Learn more →". |
| The space (`space.tsx`) | Pic 6 — numbered category strip, editorial about block, full-bleed plate, closing note. |
| Pricing (`pricing.tsx`) | Pic 5 — four mixed benefit cards (price / checklist / prompt / emergency) + à-la-carte list. |
| Footer (`site-footer.tsx`) | Pic 7 — `/footer-bg.jpg` full-bleed, content in the left copy-space over a canvas→transparent scrim. |
| Colour theme | Pic 3 — `#98BF0A` / `#F4F3F8`. |

---

## Status

Already done on this machine:

- **Node.js 24.19.0 + npm 11** installed (`C:\Program Files\nodejs`).
- `npm install` run — dependencies + generated Prisma client are in `node_modules`.
- `prisma migrate dev` run — `prisma/dev.db` exists with the `Appointment` +
  `Message` tables (migration in `prisma/migrations/`).
- `npm run build` passes (types + lint clean); homepage + both API routes
  smoke-tested and verified writing to the DB.

If `node` isn't on your PATH in a fresh terminal, either open a new shell (the
installer added it system-wide) or prefix commands with
`$env:Path = "C:\Program Files\nodejs;" + $env:Path` (PowerShell).

## Run

```bash
cd D:\dental-clinic
npm run dev          # http://localhost:3000
```

Other commands: `npm run build` / `npm start` (production), `npm run db:studio`
(browse the DB), `npm run lint`.

`.env` holds `DATABASE_URL="file:./dev.db"` (git-ignored, as is the DB file).
If you ever move machines: `npm install && npx prisma migrate dev` recreates everything.

---

## What's wired

### Front end (`app/page.tsx`)

| Section | Component | Notes |
| --- | --- | --- |
| Scroll-reveal hero | `components/ui/scroll-reveal-hero.tsx` | Locked-scroll cross-dissolve through the 6 ambience photos. Body is pinned; wheel / touch / arrow keys drive `progress`. Unlocks at the end and re-locks at the top. Honours `prefers-reduced-motion` and ships a **Skip intro** button. |
| Statement band | `components/statement.tsx` | Bold uppercase headline + stat row. |
| About | `components/intro.tsx` | |
| Services | `components/services.tsx` | 6 departments, lucide icons. |
| The space | `components/space.tsx` | Ambience gallery, asymmetric grid. |
| Team | `components/team.tsx` | Doctor reveal — greyscale portraits, hover for experience + focus. Mobile shows detail inline. |
| Pricing | `components/pricing.tsx` | 3 curated plans + à-la-carte list. |
| Contact | `components/contact.tsx` | Message form → `POST /api/contact`. |
| Footer | `components/site-footer.tsx` | Glossy-tooth motif. |

The booking modal (`components/booking-dialog.tsx`) is reused in the header, the
statement band, the team and pricing sections.

### Back end (Prisma + SQLite)

| Route | Method | Body | Stores |
| --- | --- | --- | --- |
| `/api/appointments` | POST | name, email, phone, service, preferred?, message? | `Appointment` |
| `/api/contact` | POST | name, email, subject?, body | `Message` |

Validation is shared client/server via `lib/validations.ts` (Zod). Inspect
submissions with `npm run db:studio`.

Schema: `prisma/schema.prisma`. After changing it, run
`npx prisma migrate dev --name <change>`.

---

## Security

Reviewed against the 5-check launch list (Gitleaks / Bearer / ECC / Trail of Bits).
This is a static marketing site with two unauthenticated form endpoints — no auth,
no payments, no user accounts, no file uploads, no admin — so most payment/JWT/IDOR
checks don't apply. What was checked and what is in place:

**In place**

- **No secrets in code.** Only `DATABASE_URL="file:./dev.db"` (a local path, not a
  credential). No API keys anywhere, no `NEXT_PUBLIC_` / `REACT_APP_` exposure.
  `.env` is git-ignored; `.env.example` is committed.
- **Input validation** on every field, client *and* server, via one shared Zod
  schema (`lib/validations.ts`). Unknown keys are stripped (no mass-assignment —
  a client can't set `status`, `id`, `createdAt`). `preferred` date is bounded to
  ~1 year out.
- **Rate limiting** — `lib/rate-limit.ts`, in-memory, **5 requests / 60 s / IP**
  per endpoint → `429` with `Retry-After`.
- **Body cap** — requests over 16 KB are rejected `413` (belt-and-braces with the
  per-field `.max()` limits).
- **Error handling** — DB writes are wrapped; the client gets a generic message,
  the detail goes to `console.error` server-side only. No stack traces, query
  text, or paths leak. Endpoints return `{ ok: true }` — no record data echoed.
- **Security headers** (`next.config.mjs`) on every response: `Content-Security-Policy`
  (`frame-ancestors 'none'`, `object-src 'none'`, `base-uri`/`form-action 'self'`;
  `'unsafe-eval'` is dev-only for HMR), `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`
  (camera/mic/geo off), `Strict-Transport-Security`. `X-Powered-By` is disabled.
- **No injection surface** — Prisma only (parameterised queries, no raw SQL);
  React auto-escapes and there is no `dangerouslySetInnerHTML`; stored submissions
  are never rendered back to a browser.
- **Dependencies** — `npm audit` reports **0 vulnerabilities** (Next 15.5.x + React
  19; `postcss` pinned via `overrides`).
- Only `POST` is handled; other methods return `405`. No `.git`, no Swagger, no
  health/debug endpoints, no `productionBrowserSourceMaps`.

**Before a high-stakes production launch**

- Move off SQLite to Postgres/MySQL with TLS; keep `DATABASE_URL` in the host's
  secret store.
- Swap the in-memory rate limiter for a shared store (Upstash Redis / Vercel KV)
  if you run more than one instance.
- Upgrade the CSP to a nonce-based policy via `middleware.ts` (removes
  `script-src 'unsafe-inline'`).
- Add a spam defence to the public forms (hCaptcha / Turnstile) and a GDPR data
  path (the clinic handles erasure requests by email today — document it).
- If you add any real secret (SMTP, payment, analytics keys), rotate it if it was
  ever committed, and confirm it stays server-side only.
- Pair this with a human security review — an AI pass is not a substitute.

---

## The component from the brief

`components/ui/scroll-locked-video-hero.tsx` is the original **video**
scroll-scrub hero (`MetroHero`), dropped in verbatim with its `demo.tsx`. The
live site instead uses `scroll-reveal-hero.tsx` — the same locked-scroll
mechanic adapted to an **image sequence**, because no video asset was supplied.
To switch to video later: drop an MP4 in `public/`, and in `app/page.tsx`
render `<MetroHero videoSrc="/your.mp4" title="Verdant" tagline="…" signature={false} />`.

---

## Assets

`public/doctors/*` and `public/ambience/*` are the supplied reference photos;
`public/reveal/tooth-blue.jpg` is the hero reveal's second frame and
`public/footer-bg.jpg` is the footer background. Swap any of them in place —
keep the filenames and the site picks them up.

---

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | `prisma generate` + production build |
| `npm start` | Serve the production build |
| `npm run db:studio` | Prisma Studio (browse the DB) |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run lint` | ESLint |
