import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = serverClient();
    const { error } = await supabase.from("wfr_requests").insert({
      author_slug: body.author_id ?? null,
      school_name: body.school_name,
      school_type: body.school_type,
      school_city: body.school_city,
      school_state: body.school_state,
      school_website: body.school_website ?? null,
      requester_name: body.requester_name,
      requester_role: body.requester_role,
      requester_email: body.requester_email,
      grades: body.grades,
      visit_kind: body.visit_kind,
      date_earliest: body.date_earliest || null,
      date_latest: body.date_latest || null,
      student_count: body.student_count ? parseInt(body.student_count) : null,
      timing_notes: body.timing_notes ?? null,
      budget_type: body.budget_type,
      budget_amount: body.budget_amount ? parseInt(body.budget_amount) : null,
      grant_need_reason: body.grant_need_reason ?? null,
      grant_staff_lead: body.grant_staff_lead ?? null,
      grant_prep_plan: body.grant_prep_plan ?? null,
      success_description: body.success_description,
      themes: body.themes ?? [],
      notes: body.notes ?? null,
      confirmed_staff_lead: body.confirmed_staff_lead,
      status: "pending",
    });
    if (error) throw error;

    try {
      const { sendRequestReceived, sendGrantRequestToAuthor } = await import("@/lib/email");
      await sendRequestReceived(body.requester_name, body.requester_email, body.school_name);

      // For grant requests aimed at a specific author, notify that author too.
      if (body.budget_type === "grant" && body.author_id) {
        const { data: author } = await supabase
          .from("wfr_authors")
          .select("name, email")
          .eq("slug", body.author_id)
          .maybeSingle();
        if (author?.email) {
          await sendGrantRequestToAuthor(author.name ?? "there", author.email, body);
        }
      }
    } catch (e) {
      console.error("request email error:", e);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = serverClient();
    const { data, error } = await supabase
      .from("wfr_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
