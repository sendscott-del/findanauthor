import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase";
import { geocodeZip, geocodeCityState, haversineMiles } from "@/lib/geo";
import type { Author } from "@/lib/types";

/** Attach distance_miles + within_local_zone when a ZIP is provided. */
function withDistance(authors: any[], zip: string | null) {
  if (!zip) return authors;
  const origin = geocodeZip(zip);
  if (!origin) return authors;
  return authors.map((a) => {
    const point = geocodeCityState(a.location_city, a.location_state);
    if (!point) return { ...a, distance_miles: null, within_local_zone: false };
    const d = haversineMiles(origin, point);
    return {
      ...a,
      distance_miles: Math.round(d * 10) / 10,
      within_local_zone: d <= (a.local_radius_miles ?? 30),
    };
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const zip = searchParams.get("zip");
  try {
    const supabase = serverClient();
    let query = supabase.from("wfr_authors").select("*").eq("status", "active");
    const grade = searchParams.get("grade");
    if (grade) query = query.contains("grade_range", [grade]);
    const grant = searchParams.get("grant");
    if (grant === "true") query = query.eq("offers_grant_visits", true);
    const { data, error } = await query.order("name");
    if (error) throw error;
    return NextResponse.json(withDistance(data ?? [], zip));
  } catch {
    // Return seed data if DB not configured
    const { SEED_AUTHORS } = await import("@/lib/seed-data");
    return NextResponse.json(withDistance(SEED_AUTHORS as Partial<Author>[], zip));
  }
}
