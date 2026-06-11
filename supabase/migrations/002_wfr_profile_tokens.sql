-- Run this migration manually via Supabase dashboard SQL editor
-- if the MCP connection is unavailable

-- Profile setup tokens (one-time links sent to approved authors)
create table if not exists wfr_profile_tokens (
  id uuid primary key default gen_random_uuid(),
  token text unique not null default encode(gen_random_bytes(32), 'hex'),
  application_id uuid references wfr_applications(id) on delete cascade,
  email text not null,
  used_at timestamptz,
  expires_at timestamptz default (now() + interval '7 days'),
  created_at timestamptz default now()
);
alter table wfr_profile_tokens enable row level security;
create policy "Anon can read tokens" on wfr_profile_tokens for select using (true);
create policy "Anon can update tokens" on wfr_profile_tokens for update using (true);
create policy "Anon can insert tokens" on wfr_profile_tokens for insert with check (true);

-- Allow anon to update application status (for approval flow)
drop policy if exists "Anon can update applications" on wfr_applications;
create policy "Anon can update applications" on wfr_applications for update using (true);

-- Allow anon to insert + update author profiles (for profile setup flow)
drop policy if exists "Anon can insert authors" on wfr_authors;
create policy "Anon can insert authors" on wfr_authors for insert with check (true);
drop policy if exists "Anon can update authors" on wfr_authors;
create policy "Anon can update authors" on wfr_authors for update using (true);
