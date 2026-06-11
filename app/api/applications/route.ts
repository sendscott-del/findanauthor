import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase";

// Well-known traditional publishers (conservative list — expand over time)
const TRADITIONAL_PUBLISHERS = [
  "scholastic", "harpercollins", "harper collins", "penguin", "random house",
  "penguin random house", "simon & schuster", "simon and schuster", "macmillan",
  "hachette", "little brown", "little, brown", "disney", "hyperion",
  "holiday house", "chronicle books", "candlewick", "peachtree", "charlesbridge",
  "lee & low", "lee and low", "boyds mills", "boyds mills & kane", "holiday house",
  "albert whitman", "clarion", "farrar straus", "farrar, straus", "knopf",
  "crown", "viking", "dutton", "putnam", "dial", "greenwillow", "holt", "roaring brook",
  "wednesday books", "square fish", "feiwel", "bloomsbury", "sourcebooks",
  "sky pony", "holiday house", "abrams", "lerner", "capstone", "benchmark",
];

function isTraditionalPublisher(publisher: string): boolean {
  const lower = publisher.toLowerCase().trim();
  return TRADITIONAL_PUBLISHERS.some((p) => lower.includes(p));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = serverClient();

    const publisherApproved = isTraditionalPublisher(body.publisher ?? "");
    const autoNotes = publisherApproved
      ? `Publisher "${body.publisher}" matched against traditional publisher list.`
      : `Publisher "${body.publisher}" NOT found in traditional publisher list — needs manual review.`;

    const { error } = await supabase.from("wfr_applications").insert({
      name: body.name,
      email: body.email,
      website_url: body.website_url ?? null,
      amazon_url: body.amazon_url ?? null,
      book_title: body.book_title,
      publisher: body.publisher,
      isbn: body.isbn ?? null,
      years_visiting: body.years_visiting,
      school_visit_references: body.school_visit_references ?? null,
      background_check_consent: body.background_check_consent,
      why_join: body.why_join,
      visit_formats: body.visit_formats ?? [],
      grades: body.grades ?? [],
      local_radius: body.local_radius ? parseInt(body.local_radius) : 30,
      base_price_local: body.base_price_local ? parseInt(body.base_price_local) : 650,
      base_price_virtual: body.base_price_virtual ? parseInt(body.base_price_virtual) : 300,
      offers_grant: body.offers_grant ?? false,
      grant_visits_per_year: body.offers_grant ? parseInt(body.grant_visits_per_year ?? "3") : 0,
      languages: body.languages ?? ["English"],
      status: "pending",
      auto_check_passed: publisherApproved,
      auto_check_notes: autoNotes,
    });

    if (error) throw error;
    return NextResponse.json({ ok: true, auto_check_passed: publisherApproved });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = serverClient();
    const { data, error } = await supabase
      .from("wfr_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
