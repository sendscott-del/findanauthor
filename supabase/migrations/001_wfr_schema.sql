-- Writers for Readers schema
-- All tables use wfr_ prefix (shared Supabase instance)

-- Authors (approved, active profiles)
create table if not exists wfr_authors (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text,
  bio text,
  location_city text,
  location_state text,
  genres text[] default '{}',
  grade_range text[] default '{}',
  languages text[] default '{"English"}',
  books jsonb default '[]',
  visit_offerings jsonb default '[]',
  local_radius_miles int default 30,
  offers_grant_visits boolean default false,
  grant_visits_total int default 0,
  grant_visits_remaining int default 0,
  availability jsonb default '{}',
  vetted_published boolean default false,
  vetted_school_experience boolean default false,
  vetted_background_checked boolean default false,
  schools_visited int default 0,
  typical_response_days int default 3,
  website_url text,
  amazon_url text,
  status text default 'pending' check (status in ('active', 'inactive', 'pending')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- School visit requests
create table if not exists wfr_requests (
  id uuid primary key default gen_random_uuid(),
  author_slug text references wfr_authors(slug) on delete set null,
  school_name text not null,
  school_type text[] default '{}',
  school_city text,
  school_state text,
  school_website text,
  requester_name text not null,
  requester_role text,
  requester_email text not null,
  grades text[] default '{}',
  visit_kind text check (visit_kind in ('local', 'out_of_area', 'virtual')),
  date_earliest date,
  date_latest date,
  student_count int,
  timing_notes text,
  budget_type text check (budget_type in ('set', 'partial', 'grant')),
  budget_amount int,
  grant_need_reason text,
  grant_staff_lead text,
  grant_prep_plan text,
  success_description text,
  themes text[] default '{}',
  notes text,
  confirmed_staff_lead boolean default false,
  status text default 'pending' check (status in ('pending', 'matched', 'booked', 'completed', 'cancelled')),
  created_at timestamptz default now()
);

-- Author applications (pending vetting)
create table if not exists wfr_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  website_url text,
  amazon_url text,
  book_title text not null,
  publisher text not null,
  isbn text,
  years_visiting text,
  school_visit_references text,
  background_check_consent boolean default false,
  why_join text,
  visit_formats text[] default '{}',
  grades text[] default '{}',
  local_radius int default 30,
  base_price_local int default 650,
  base_price_virtual int default 300,
  offers_grant boolean default false,
  grant_visits_per_year int default 0,
  languages text[] default '{"English"}',
  status text default 'pending' check (status in ('pending', 'approved', 'rejected', 'more_info')),
  auto_check_passed boolean,
  auto_check_notes text,
  admin_notes text,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists wfr_authors_slug_idx on wfr_authors(slug);
create index if not exists wfr_authors_status_idx on wfr_authors(status);
create index if not exists wfr_requests_status_idx on wfr_requests(status);
create index if not exists wfr_applications_status_idx on wfr_applications(status);

-- RLS: public can read active authors
alter table wfr_authors enable row level security;
create policy "Public can read active authors" on wfr_authors for select using (status = 'active');

-- RLS: anyone can insert requests / applications (anonymous form submissions)
alter table wfr_requests enable row level security;
create policy "Anyone can submit requests" on wfr_requests for insert with check (true);

alter table wfr_applications enable row level security;
create policy "Anyone can submit applications" on wfr_applications for insert with check (true);
