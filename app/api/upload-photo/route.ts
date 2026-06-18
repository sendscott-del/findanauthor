import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: "Please upload a JPG, PNG, WEBP, or GIF image." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image must be under 5 MB." }, { status: 400 });
    }

    const supabase = serverClient();
    const ext = EXT[file.type] ?? "jpg";
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
    const bytes = new Uint8Array(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from("author-photos")
      .upload(name, bytes, { contentType: file.type, upsert: false });
    if (error) throw error;

    const { data } = supabase.storage.from("author-photos").getPublicUrl(name);
    return NextResponse.json({ url: data.publicUrl });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Upload failed";
    console.error("upload-photo:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
