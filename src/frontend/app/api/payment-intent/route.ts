import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { events } from "@/lib/events";

function parsePriceToCents(price: string): number {
  const cleaned = price.replace(/[^\d.]/g, "").replace(/,/g, "");
  const value = parseFloat(cleaned);
  if (Number.isNaN(value) || value <= 0) throw new Error("Invalid price");
  return Math.round(value * 100);
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY." },
      { status: 500 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { eventId, name, email, phone } = body;

  if (!eventId || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "eventId and name are required" }, { status: 400 });
  }

  const contactEmail = typeof email === "string" ? email.trim() : "";
  const contactPhone = typeof phone === "string" ? phone.trim() : "";

  if (!contactEmail && !contactPhone) {
    return NextResponse.json(
      { error: "Email or phone is required for ticket delivery" },
      { status: 400 }
    );
  }

  if (contactEmail && !contactEmail.includes("@")) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const event = events.find((e) => e.id === Number(eventId));
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  let amount: number;
  try {
    amount = parsePriceToCents(event.price);
  } catch {
    return NextResponse.json({ error: "Unable to parse ticket price" }, { status: 400 });
  }

  const stripe = new Stripe(secret, { apiVersion: "2026-04-22.dahlia" as never });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
      receipt_email: contactEmail || undefined,
      metadata: {
        eventId: String(event.id),
        name: name.trim(),
        email: contactEmail,
        phone: contactPhone,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create payment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
