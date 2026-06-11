import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "No URL" }, { status: 400 });

    // Extract ASIN from Amazon URLs
    const asinMatch = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
    if (asinMatch) {
      const asin = asinMatch[1];
      // Use Open Library / Google Books as a fallback lookup (ISBN/ASIN)
      const gbRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${asin}&maxResults=1`);
      if (gbRes.ok) {
        const gbData = await gbRes.json();
        if (gbData.items?.length) {
          const vol = gbData.items[0].volumeInfo;
          return NextResponse.json({
            title: vol.title ?? null,
            publisher: vol.publisher ?? null,
            isbn: vol.industryIdentifiers?.find((x: any) => x.type === "ISBN_13")?.identifier ?? null,
            bio: vol.description ?? null,
          });
        }
      }
    }

    // For Amazon author pages or generic URLs, try scraping title from the page
    // We just return empty — the user fills it in manually (safe, no proxy needed)
    return NextResponse.json({});
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
