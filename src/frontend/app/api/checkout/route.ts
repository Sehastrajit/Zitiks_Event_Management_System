import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { events } from "@/lib/events";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
function getStripe() {
  return new Stripe(stripeSecret!, { apiVersion: "2026-04-22.dahlia" as never });
}

function parsePriceToCents(price: string) {
  const cleaned = price.replace(/[^\d.]/g, "").replace(/,/g, "");
  const value = parseFloat(cleaned);
  if (Number.isNaN(value) || value < 0) {
    throw new Error("Invalid event price");
  }
  return Math.round(value * 100);
}

export async function POST(req: NextRequest) {
  if (!stripeSecret) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY in environment." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { eventId, name, email, phone } = body as Record<string, unknown>;

  if (!eventId || !name) {
    return NextResponse.json(
      { error: "eventId and name are required" },
      { status: 400 }
    );
  }

  if (typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }

  if (typeof eventId !== "number" && typeof eventId !== "string") {
    return NextResponse.json({ error: "Invalid eventId" }, { status: 400 });
  }

  if (typeof email !== "string" && typeof phone !== "string") {
    return NextResponse.json(
      { error: "Email or phone is required for confirmation" },
      { status: 400 }
    );
  }

  const contactEmail = typeof email === "string" ? email.trim() : "";
  const contactPhone = typeof phone === "string" ? phone.trim() : "";

  if (!contactEmail && !contactPhone) {
    return NextResponse.json(
      { error: "Email or phone is required for confirmation" },
      { status: 400 }
    );
  }

  if (contactEmail && !contactEmail.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const event = events.find((eventItem) => eventItem.id === Number(eventId));
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  let amountInCents: number;
  try {
    amountInCents = parsePriceToCents(event.price);
  } catch (err) {
    return NextResponse.json({ error: "Unable to parse ticket price" }, { status: 400 });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3000";

  try {
    const session = await (getStripe().checkout.sessions.create as Function)({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Ticket: ${event.title}`,
              description: `Guest checkout for ${event.title}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      customer_email: contactEmail || undefined,
      payment_intent_data: contactEmail
        ? { receipt_email: contactEmail }
        : undefined,
      metadata: {
        eventId: String(event.id),
        name: name.trim(),
        email: contactEmail,
        phone: contactPhone,
      },
      success_url: `${baseUrl}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/book/${event.id}`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe checkout creation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


