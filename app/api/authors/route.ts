import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const supabase = serverClient();
    let query = supabase.from("wfr_authors").select("*").eq("status", "active");
    const grade = searchParams.get("grade");
    if (grade) query = query.contains("grade_range", [grade]);
    const grant = searchParams.get("grant");
    if (grant === "true") query = query.eq("offers_grant_visits", true);
    const { data, error } = await query.order("name");
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (e: any) {
    // Return seed data if DB not configured
    const { SEED_AUTHORS } = await import("@/lib/seed-data");
    return NextResponse.json(SEED_AUTHORS);
  }
}
