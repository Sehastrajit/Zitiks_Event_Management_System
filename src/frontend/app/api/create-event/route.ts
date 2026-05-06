import { NextRequest, NextResponse } from "next/server";

const AIRTABLE_TOKEN   = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID ?? "appNhBL4aHe7HTv7t";
const AIRTABLE_TABLE   = "Events";

export async function POST(req: NextRequest) {
  if (!AIRTABLE_TOKEN) {
    return NextResponse.json(
      { error: "Airtable is not configured. Set AIRTABLE_TOKEN in environment." },
      { status: 500 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, venue, city, date, price, category } = body;

  if (!title || !venue || !city || !date || price === undefined || !category) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const priceNum = parseFloat(String(price).replace(/[^\d.]/g, ""));
  if (Number.isNaN(priceNum) || priceNum < 0) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }

  // Normalise the datetime-local value ("2025-05-12T19:00") to ISO 8601
  const dateIso = new Date(String(date)).toISOString();

  const payload = {
    fields: {
      "Event Title": String(title).trim(),
      "Venue":       String(venue).trim(),
      "City":        String(city).trim(),
      "Date":        dateIso,
      "Price":       priceNum,
      "Category":    String(category),
    },
  };

  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const message = (err as { error?: { message?: string } }).error?.message ?? "Airtable submission failed";
    return NextResponse.json({ error: message }, { status: res.status });
  }

  const record = await res.json();
  return NextResponse.json({ id: record.id, success: true });
}
