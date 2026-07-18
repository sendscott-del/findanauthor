// Changelog for findanauthor.org (Writers for Readers).
// Keep CURRENT_VERSION in sync with package.json "version".
// Newest entry first. Bump on every shipped change.

export type ChangelogEntry = {
  version: string;
  date: string; // YYYY-MM-DD
  changes: string[];
};

export const CURRENT_VERSION = "0.6.4";

export const changelog: ChangelogEntry[] = [
  {
    version: "0.6.4",
    date: "2026-07-16",
    changes: [
      "Moved the badges on author cards (landing page + directory) to the bottom of the photo too, so they no longer cover faces.",
    ],
  },
  {
    version: "0.6.3",
    date: "2026-07-16",
    changes: [
      "Moved the Founding Author and grant-visit badges to the bottom of the author profile photo so they no longer cover faces.",
    ],
  },
  {
    version: "0.6.2",
    date: "2026-07-16",
    changes: [
      "Removed the sample/placeholder authors and demo book covers — the site now shows only real author profiles.",
      "Directory, homepage featured authors, and the book carousel are real-data only (no seed fallback).",
      "Request page now looks up the real author by slug (the pre-fill previously only recognized sample authors).",
    ],
  },
  {
    version: "0.6.1",
    date: "2026-07-16",
    changes: [
      "Authors can upload a real cover image for each book (up to 10) from the dashboard; the styled color cover stays as a fallback when no image is uploaded.",
      "Uploaded covers show on the public profile, directory cards, and the homepage book carousel.",
    ],
  },
  {
    version: "0.6.0",
    date: "2026-07-16",
    changes: [
      "Authors can now add up to 10 books on their profile — add, edit, reorder-by-remove, pick a cover color, and set the book type, all from the dashboard.",
      "Founding Author status: admins can grant it from the new Authors admin page (/admin/authors).",
      "Founding authors get a gold \"✦ Founding Author\" badge on their public profile and directory card, and rank first in directory search results.",
      "New admin Authors screen (fixes the previously broken \"Active Authors\" link) — manage founding status and listing status per author.",
    ],
  },
  {
    version: "0.5.0",
    date: "2026-06-17",
    changes: [
      "Author accounts: passwordless magic-link sign-in (/login) via Supabase Auth.",
      "Author self-service dashboard (/dashboard) — authors can edit their own bio, photo, location, visit formats, links, and offer flags any time.",
      "Ownership-enforced profile updates (authors can only edit their own listing; slug/status/founding flags stay admin-only).",
      "\"Sign in\" added to the main nav.",
      "Migration 004: wfr_authors.user_id links auth users to profiles.",
    ],
  },
  {
    version: "0.4.0",
    date: "2026-06-17",
    changes: [
      "Location-based author search (zip/city radius matching via lib/geo.ts).",
      "Author photo upload to the author-photos Storage bucket.",
      "Title I subsidy flag — authors can offer reduced/free visits to Title I schools.",
      "Free virtual Q&A flag for authors offering no-cost remote sessions.",
      "External booking link (booking_url) on author profiles.",
      "Founding-author badge for early members.",
      "Private pricing — visit fees shown only after an educator inquiry, not publicly.",
      "New FAQ page (/faq) for educators and authors.",
      "Book carousel component on author profiles.",
      "Cited statistics replacing earlier placeholder numbers on the homepage.",
    ],
  },
  {
    version: "0.3.0",
    date: "2026-06-11",
    changes: [
      "Author directory (/authors) and profiles (/authors/[slug]) now read from the live database instead of seed data.",
      "Moved to a dedicated Supabase project for findanauthor.org.",
      "Outbound emails set reply_to so educator replies reach the admin inbox.",
    ],
  },
  {
    version: "0.2.0",
    date: "2026-06-11",
    changes: [
      "Admin auth gate (middleware + /admin/login).",
      "Email notifications via Resend on application and request submit.",
      "Token-gated author profile setup wizard (/profile/setup/[token]).",
      "Admin approve flow that issues a setup token and emails the link.",
    ],
  },
];
