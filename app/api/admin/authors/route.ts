import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase";

function isAdmin(req: NextRequest) {
  return req.cookies.get("admin_session")?.value === process.env.ADMIN_PASSWORD;
}

const STATUSES = ["active", "inactive", "pending"];

// List every author (all statuses) for the admin directory.
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = serverClient();
  const { data, error } = await supabase
    .from("wfr_authors")
    .select("id, slug, name, email, status, founding_author, location_city, location_state, created_at")
    .order("founding_author", { ascending: false })
    .order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// Update whitelisted admin-only fields on an author (founding status, listing status).
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const id = body?.id;
  if (!id) return NextResponse.json({ error: "Missing author id" }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (typeof body.founding_author === "boolean") update.founding_author = body.founding_author;
  if (typeof body.status === "string" && STATUSES.includes(body.status)) update.status = body.status;
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const supabase = serverClient();
  const { error } = await supabase.from("wfr_authors").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
