# Session log — findanauthor

Append-only. Newest entry first. Add an entry at the end of every working session: date, what changed, any infra facts that moved.

## 2026-07-15 — Doc system initialized (history reconstructed from git)

- 18 commits to date; currently v0.5.0.
- v0.5.0: author magic-link sign-in + self-service profile `/dashboard`; follow-up fix cleans the callback URL (drops query) so it matches the Supabase redirect allow-list.
- v0.4.0: changelog added, version surfaced in footer.
- Migration 003: subsidy/booking/Q&A columns; sandbox distDir override dropped.
- Major feature pass: location search, photo upload, Title I + free Q&A, private pricing, FAQ, carousel, cited stats.
- v0.3.0: author directory + profile pages wired to the live database; moved to the dedicated findanauthor Supabase project (`jgoivwfejtfpbngsusgq`).
- Email plumbing: RESEND env vars + findanauthor.org sending domain; `reply_to` on all outbound so replies reach Liesl; ADMIN_EMAIL set to liesl@lieslshurtliff.com.
- v0.2.0: admin auth, email notifications, author profile setup.
