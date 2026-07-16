# Session log — findanauthor

Append-only. Newest entry first. Add an entry at the end of every working session: date, what changed, any infra facts that moved.

## 2026-07-16 — Multi-book profiles + Founding Author status (v0.6.0)

- Authors can now add up to 10 books from `/dashboard` (title, publisher, year, type, cover color). Editor caps at 10; server (`/api/account/update`) re-validates and hard-caps, drops empty rows. `books` was already a `jsonb` array — no schema change.
- Founding Author status is now real (0.4.0 changelog claimed a badge but nothing was wired up). `founding_author` boolean already existed on `wfr_authors` — no schema change.
  - Public: gold "✦ Founding Author" badge on profile (`/authors/[slug]`) + directory card; founding authors rank first in `/api/authors` and in the directory's client-side sort within every mode.
  - Admin: new `/admin/authors` page (fixes the previously broken "Active Authors" link) with a founding toggle + listing-status control, backed by new `GET/POST /api/admin/authors` (admin-cookie gated, whitelisted fields).
- Verified live schema on `jgoivwfejtfpbngsusgq`: `books` (jsonb) + `founding_author` (boolean) both present.
- No local build possible on this machine (Node not installed) — verification is via Vercel deploy.
- **Migration 004 (`wfr_authors.user_id`) had never actually been applied to the live DB** — surfaced when a dashboard save (adding books) errored with "column wfr_authors.user_id does not exist". Applied it 2026-07-16 via the Supabase SQL editor (add nullable `user_id uuid` FK + index). This means the v0.5.0 author dashboard had never successfully saved for anyone until now; profile editing (all fields, not just books) is unblocked as of this fix.
- Deployed v0.6.0 to production (Vercel `dpl_B8tQKw…`, READY); footer confirms v0.6.0 live.
- v0.6.1: per-book cover image uploads. Reuses `/api/upload-photo` (author-photos bucket); `Book.cover_url` added; `BookCover` renders the image when present, else the color cover. Server only accepts Supabase Storage public URLs for `cover_url`. Shown on profile, directory card, and homepage carousel.
- v0.6.2: removed all sample/seed data. Deleted `lib/seed-data.ts`; dropped seed fallbacks in `app/page.tsx` (featured + carousel) and `/api/authors` (empty on error, not fake); `/request` now fetches the real author by slug (previously only matched seed authors). **Live DB:** the 4 seeded sample authors (marisol-vega, james-okonkwo, priya-mehta, derek-washington — all `email IS NULL`) were set to `status='inactive'` (reversible; not hard-deleted). Active authors now = the 3 real ones (liesl-shurtliff, supriya-kelkar, erin-soderberg-downing).
- Infra note: GitHub push now works from this MacBook Air — a fine-grained/classic PAT with repo write is saved in the macOS Keychain (osxkeychain helper), so future `git push` is non-interactive.

## 2026-07-15 — Doc system initialized (history reconstructed from git)

- 18 commits to date; currently v0.5.0.
- v0.5.0: author magic-link sign-in + self-service profile `/dashboard`; follow-up fix cleans the callback URL (drops query) so it matches the Supabase redirect allow-list.
- v0.4.0: changelog added, version surfaced in footer.
- Migration 003: subsidy/booking/Q&A columns; sandbox distDir override dropped.
- Major feature pass: location search, photo upload, Title I + free Q&A, private pricing, FAQ, carousel, cited stats.
- v0.3.0: author directory + profile pages wired to the live database; moved to the dedicated findanauthor Supabase project (`jgoivwfejtfpbngsusgq`).
- Email plumbing: RESEND env vars + findanauthor.org sending domain; `reply_to` on all outbound so replies reach Liesl; ADMIN_EMAIL set to liesl@lieslshurtliff.com.
- v0.2.0: admin auth, email notifications, author profile setup.
