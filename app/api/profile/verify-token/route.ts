import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  try {
    const supabase = serverClient();
    const { data, error } = await supabase
      .from("wfr_profile_tokens")
      .select("*, wfr_applications(*)")
      .eq("token", token)
      .single();

    if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (data.used_at) return NextResponse.json({ used: true });
    if (data.expires_at && new Date(data.expires_at) < new Date()) return NextResponse.json({ expired: true });

    return NextResponse.json({
      id: data.id,
      email: data.email,
      application: data.wfr_applications,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
