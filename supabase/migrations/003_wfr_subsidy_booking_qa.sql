-- 003_wfr_subsidy_booking_qa.sql
-- Title I subsidy, external booking link, free virtual Q&A, and founding-author flags.
--
-- NOTE: These columns were already applied to the live findanauthor Supabase
-- project (jgoivwfejtfpbngsusgq) via the dashboard. This file exists to keep the
-- repo in sync. All statements are idempotent (IF NOT EXISTS), so re-running is safe.

alter table wfr_authors add column if not exists offers_title1_subsidy boolean default false;
alter table wfr_authors add column if not exists booking_url text;
alter table wfr_authors add column if not exists offers_free_virtual_qa boolean default false;
alter table wfr_authors add column if not exists founding_author boolean default false;

alter table wfr_applications add column if not exists offers_title1_subsidy boolean default false;
alter table wfr_applications add column if not exists booking_url text;
alter table wfr_applications add column if not exists offers_free_virtual_qa boolean default false;
