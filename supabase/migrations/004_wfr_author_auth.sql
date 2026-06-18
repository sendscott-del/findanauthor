-- 004_wfr_author_auth.sql
-- Links Supabase Auth users to their author profile so authors can sign in
-- (magic link) and edit their own listing.
--
-- The app enforces ownership server-side by matching the signed-in email to
-- wfr_authors.email, so this column is defense-in-depth + a stable join key.
-- Idempotent; safe to re-run.

alter table wfr_authors
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists wfr_authors_user_id_idx on wfr_authors (user_id);

-- Optional hardening (RLS): if/when you enable RLS on wfr_authors, these let an
-- authenticated author read and update only their own row, while the app's
-- service-role reads (public directory) continue to bypass RLS.
--
-- alter table wfr_authors enable row level security;
-- create policy "authors read own row" on wfr_authors
--   for select using (auth.uid() = user_id);
-- create policy "authors update own row" on wfr_authors
--   for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
