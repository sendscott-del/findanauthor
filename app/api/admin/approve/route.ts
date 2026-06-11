import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase";
import { sendProfileSetupLink } from "@/lib/email";

export async function POST(req: NextRequest) {
  // Verify admin session
  const session = req.cookies.get("admin_session")?.value;
  if (session !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { application_id } = await req.json();
    const supabase = serverClient();

    // Fetch the application
    const { data: app, error: fetchErr } = await supabase
      .from("wfr_applications")
      .select("*")
      .eq("id", application_id)
      .single();
    if (fetchErr || !app) throw fetchErr ?? new Error("Application not found");

    // Mark as approved
    const { error: updateErr } = await supabase
      .from("wfr_applications")
      .update({ status: "approved" })
      .eq("id", application_id);
    if (updateErr) throw updateErr;

    // Create a profile setup token
    const { data: tokenRow, error: tokenErr } = await supabase
      .from("wfr_profile_tokens")
      .insert({ application_id, email: app.email })
      .select("token")
      .single();
    if (tokenErr) throw tokenErr;

    // Send email with setup link
    await sendProfileSetupLink(app.name, app.email, tokenRow.token);

    return NextResponse.json({ ok: true, token: tokenRow.token });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
