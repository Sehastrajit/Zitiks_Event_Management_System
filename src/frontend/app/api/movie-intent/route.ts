import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getMovieById } from "@/lib/movies";

function parsePriceToCents(price: string): number {
  const cleaned = price.replace(/[^\d.]/g, "");
  const value = parseFloat(cleaned);
  if (Number.isNaN(value) || value <= 0) throw new Error("Invalid price");
  return Math.round(value * 100);
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { movieId, showtime, name, email, phone } = body;

  if (!movieId || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "movieId and name are required" }, { status: 400 });
  }

  const contactEmail = typeof email === "string" ? email.trim() : "";
  const contactPhone = typeof phone === "string" ? phone.trim() : "";
  if (!contactEmail && !contactPhone) {
    return NextResponse.json({ error: "Email or phone required for ticket delivery" }, { status: 400 });
  }

  const movie = getMovieById(Number(movieId));
  if (!movie) {
    return NextResponse.json({ error: "Movie not found" }, { status: 404 });
  }

  let amount: number;
  try {
    amount = parsePriceToCents(movie.price);
  } catch {
    return NextResponse.json({ error: "Unable to parse ticket price" }, { status: 400 });
  }

  const stripe = new Stripe(secret, { apiVersion: "2026-04-22.dahlia" as never });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
      receipt_email: contactEmail || undefined,
      metadata: {
        type: "movie",
        movieId: String(movie.id),
        eventTitle: `${movie.title} — ${showtime ?? ""}`,
        eventDate: String(showtime ?? ""),
        eventLocation: `${movie.theater}, ${movie.city}, ${movie.state}`,
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
