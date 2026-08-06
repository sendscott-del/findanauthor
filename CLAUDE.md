# findanauthor (Writers for Readers) — current state

> Read this before touching the app. Update it the MOMENT an infra fact changes (database, domain, auth, billing) — don't wait for session end. Append an entry to docs/SESSIONS.md at the end of every working session. (This system exists because on 2026-07-14 a session wrote hours of content to the wrong Supabase project — the move was documented nowhere.)

@AGENTS.md

## What this is

Liesl's "Writers for Readers" project: findanauthor.org matches children's/YA authors with schools for author visits — a public author directory, school request flow, author applications, and an admin review queue. **Lane: Personal side business** (family project — Liesl runs it; admin email is liesl@lieslshurtliff.com).

## Infrastructure — VERIFY BEFORE ANY DB WRITE

- **Supabase: OWN dedicated project `jgoivwfejtfpbngsusgq`** — NOT the shared `isogetmvnpimcmouakeg` project. No table prefix. Confirm the ref before every write.
- **Domain/hosting:** findanauthor.org on Vercel, project `prj_70SufB8dIfpj1NtFMJcHb23IZXja`.
- **GitHub:** `origin` = https://github.com/sendscott-del/findanauthor.git, branch `main`. Push after every change — testing happens on Vercel.
- **Email:** Resend Pro, verified domain, sends from hello@findanauthor.org; outbound emails set `reply_to` so replies reach Liesl.
- **Auth:** Supabase magic-link sign-in for authors (v0.5.0) + password-protected admin. Supabase auth `site_url` / redirect allow-list must contain the exact Vercel URL.
- **Secrets:** `.env.local` (never committed). Names: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_FROM`. Production values in Vercel env.

## Architecture snapshot

- Next.js App Router + TypeScript + Tailwind; `@supabase/ssr` for server-side auth.
- Public: `/authors` directory + `/authors/[slug]` profiles, `/request` (school visit request), `/apply` + `/join` (author application), `/faq`, `/safety`.
- Author self-service: `/login` (magic link) → `/auth/callback` → `/dashboard` + `/profile/setup`.
- Admin: `/admin` (requests, applications) behind password auth.
- API routes under `/app/api/` (authors, requests, applications, profile, upload-photo, lookup-school, lookup-book, account, admin).
- Migrations in `supabase/migrations/` (003 added subsidy/booking/Q&A columns; 004 `user_id` was applied to the live DB on 2026-08-06 — see gotcha below).

## Rules for this repo

- Version + changelog: bump `package.json` and append `constants/changelog.ts` (version surfaces in the footer).
- Deploy = push to `origin main`; Vercel auto-builds. Verify live before claiming done.
- Append a `docs/SESSIONS.md` entry at the end of every working session.
- No secrets committed. Schema changes via `supabase/migrations/`.

## Gotchas

- **Magic-link callback URL must be cleaned (query string dropped) before comparing against the Supabase redirect allow-list** — fixed in commit 4a513ac; don't regress it.
- Redirect allow-list entries are exact URLs, no wildcards.
- Env-var changes in Vercel need a redeploy to take effect (several past commits exist purely to trigger one).
- **A migration file in `supabase/migrations/` does NOT mean it was applied to the live DB.** Migrations here are applied by hand via the Supabase SQL editor/dashboard, and 004 sat unapplied for weeks (broke every author dashboard save until 2026-08-06). Before shipping code that reads/writes a column, verify the column exists live (`information_schema.columns`), then apply the migration if missing.
