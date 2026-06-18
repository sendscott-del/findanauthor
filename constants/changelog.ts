// Changelog for findanauthor.org (Writers for Readers).
// Keep CURRENT_VERSION in sync with package.json "version".
// Newest entry first. Bump on every shipped change.

export type ChangelogEntry = {
  version: string;
  date: string; // YYYY-MM-DD
  changes: string[];
};

export const CURRENT_VERSION = "0.4.0";

export const changelog: ChangelogEntry[] = [
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
