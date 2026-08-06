import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase";

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

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
        cover_color: /^#[0-9a-fA-F]{6}$/.test(color) ? color : "#e85d04",
        type,
      };
      if (publisher) book.publisher = publisher;
      if (isbn) book.isbn = isbn;
      if (Number.isFinite(yearNum) && yearNum > 0) book.year = yearNum;
      if (/^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\//i.test(coverUrl)) {
        book.cover_url = coverUrl;
      }
      return book;
    })
    .filter((b) => (b.title as string).length > 0)
    .slice(0, MAX_BOOKS);
}

export async function POST(req: NextRequest) {
  try {
    const { token, form, tokenData } = await req.json();
    const supabase = serverClient();

    // Re-verify token (not expired, not used)
    const { data: tokenRow, error: tokenErr } = await supabase
      .from("wfr_profile_tokens")
      .select("*, wfr_applications(*)")
      .eq("token", token)
      .single();
    if (tokenErr || !tokenRow) return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    if (tokenRow.used_at) return NextResponse.json({ error: "Token already used" }, { status: 400 });
    if (tokenRow.expires_at && new Date(tokenRow.expires_at) < new Date()) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    const app = tokenRow.wfr_applications;
    const slug = slugify(app.name);

    // Build visit_offerings from form (pricing is private — no base_price stored)
    const offerings: any[] = [];
    if (form.visit_formats?.includes("in_person_assembly")) {
      offerings.push({ kind: "in_person_assembly", title: "In-Person Assembly", duration_min: 45, max_students: 300 });
    }
    if (form.visit_formats?.includes("in_person_classroom")) {
      offerings.push({ kind: "in_person_classroom", title: "In-Person Classroom", duration_min: 45, max_students: 30 });
    }
    if (form.visit_formats?.includes("virtual")) {
      offerings.push({ kind: "virtual", title: "Virtual Visit", duration_min: 45, max_students: 200 });
    }
    if (form.offers_free_virtual_qa) {
      offerings.push({ kind: "free_virtual_qa", title: "Free Virtual Q&A", duration_min: 30, max_students: 60, free: true, requires_read: true });
    }

    // Upsert author profile
    const { error: authorErr } = await supabase.from("wfr_authors").upsert({
      slug,
      name: app.name,
      email: app.email,
      tagline: form.tagline,
      bio: form.bio,
      photo_url: form.photo_url || null,
      location_city: form.location_city,
      location_state: form.location_state,
      website_url: form.website_url || null,
      booking_url: form.booking_url || form.website_url || null,
      grade_range: form.grade_range,
      visit_offerings: offerings,
      local_radius_miles: parseInt(form.local_radius) || 30,
      offers_grant_visits: form.offers_grant_visits,
      grant_visits_per_year: form.offers_grant_visits ? parseInt(form.grant_visits_per_year) || 3 : 0,
      grant_visits_remaining: form.offers_grant_visits ? parseInt(form.grant_visits_per_year) || 3 : 0,
      offers_title1_subsidy: form.offers_title1_subsidy ?? false,
      offers_free_virtual_qa: form.offers_free_virtual_qa ?? false,
      languages: splitCSV(form.languages || "English"),
      genres: splitCSV(form.genres),
      themes: splitCSV(form.themes),
      // Books the author entered during setup; fall back to the single book from their application.
      books: sanitizeBooks(form.books).length
        ? sanitizeBooks(form.books)
        : (app.book_title ? [{ title: app.book_title, publisher: app.publisher, isbn: app.isbn, cover_color: "#e85d04", type: "picture_book" }] : []),
      status: "active",
    }, { onConflict: "slug" });

    if (authorErr) throw authorErr;

    // Mark token as used
    await supabase.from("wfr_profile_tokens").update({ used_at: new Date().toISOString() }).eq("token", token);

    return NextResponse.json({ ok: true, slug });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
