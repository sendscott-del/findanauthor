import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { serverClient } from "@/lib/supabase";

function splitCSV(val: string) {
  return val.split(",").map((s) => s.trim()).filter(Boolean);
}

const MAX_BOOKS = 10;
const BOOK_TYPES = ["picture_book", "middle_grade", "young_adult", "nonfiction"];

function sanitizeBooks(raw: unknown) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((b) => (b ?? {}) as Record<string, unknown>)
    .map((b) => {
      const title = String(b.title ?? "").trim();
      const publisher = String(b.publisher ?? "").trim();
      const isbn = String(b.isbn ?? "").trim();
      const yearNum = parseInt(String(b.year ?? ""), 10);
      const color = String(b.cover_color ?? "");
      const coverUrl = String(b.cover_url ?? "").trim();
      const type = BOOK_TYPES.includes(String(b.type)) ? String(b.type) : "picture_book";
      const book: Record<string, unknown> = {
        title,
        cover_color: /^#[0-9a-fA-F]{6}$/.test(color) ? color : "#E8743B",
        type,
      };
      if (publisher) book.publisher = publisher;
      if (isbn) book.isbn = isbn;
      if (Number.isFinite(yearNum) && yearNum > 0) book.year = yearNum;
      // Only accept our own Supabase Storage URLs for covers.
      if (/^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\//i.test(coverUrl)) {
        book.cover_url = coverUrl;
      }
      return book;
    })
    .filter((b) => (b.title as string).length > 0) // drop empty rows
    .slice(0, MAX_BOOKS); // hard cap
}

function buildOfferings(form: Record<string, unknown>) {
  const formats = (form.visit_formats as string[]) ?? [];
  const offerings: Record<string, unknown>[] = [];
  if (formats.includes("in_person_assembly"))
    offerings.push({ kind: "in_person_assembly", title: "In-Person Assembly", duration_min: 45, max_students: 300 });
  if (formats.includes("in_person_classroom"))
    offerings.push({ kind: "in_person_classroom", title: "In-Person Classroom", duration_min: 45, max_students: 30 });
  if (formats.includes("virtual"))
    offerings.push({ kind: "virtual", title: "Virtual Visit", duration_min: 45, max_students: 200 });
  if (form.offers_free_virtual_qa)
    offerings.push({ kind: "free_virtual_qa", title: "Free Virtual Q&A", duration_min: 30, max_students: 60, free: true, requires_read: true });
  return offerings;
}

export async function POST(req: NextRequest) {
  // 1. Authenticated session required.
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { form } = await req.json();
  if (!form) return NextResponse.json({ error: "Missing form data" }, { status: 400 });

  const db = serverClient();

  // 2. Verify ownership — the profile must belong to this signed-in email.
  const { data: author, error: findErr } = await db
    .from("wfr_authors")
    .select("id, email, user_id")
    .ilike("email", user.email)
    .maybeSingle();
  if (findErr) return NextResponse.json({ error: findErr.message }, { status: 500 });
  if (!author) return NextResponse.json({ error: "No profile for this account" }, { status: 404 });
  if (author.user_id && author.user_id !== user.id) {
    return NextResponse.json({ error: "This profile belongs to another account" }, { status: 403 });
  }

  // 3. Whitelisted update only — slug, status, founding_author, grant_visits_remaining
  //    and email are intentionally NOT editable here.
  const grantPerYear = form.offers_grant_visits ? parseInt(form.grant_visits_per_year) || 3 : 0;
  const update: Record<string, unknown> = {
    tagline: form.tagline,
    bio: form.bio,
    photo_url: form.photo_url || null,
    location_city: form.location_city,
    location_state: form.location_state,
    website_url: form.website_url || null,
    booking_url: form.booking_url || form.website_url || null,
    grade_range: form.grade_range ?? [],
    visit_offerings: buildOfferings(form),
    local_radius_miles: parseInt(form.local_radius) || 30,
    offers_grant_visits: !!form.offers_grant_visits,
    grant_visits_per_year: grantPerYear,
    offers_title1_subsidy: !!form.offers_title1_subsidy,
    offers_free_virtual_qa: !!form.offers_free_virtual_qa,
    languages: splitCSV(form.languages || "English"),
    genres: splitCSV(form.genres || ""),
    themes: splitCSV(form.themes || ""),
    books: sanitizeBooks(form.books),
  };

  const { error: updErr } = await db.from("wfr_authors").update(update).eq("id", author.id);
  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

  // Best-effort link of auth user to the profile (no-op if column absent).
  if (!author.user_id) {
    try {
      await db.from("wfr_authors").update({ user_id: user.id }).eq("id", author.id);
    } catch {
      /* user_id column added by migration 004 */
    }
  }

  return NextResponse.json({ ok: true });
}
