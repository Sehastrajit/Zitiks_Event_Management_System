import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import Twilio from "twilio";
import { events, EventItem } from "@/lib/events";

function formatTicketId(paymentIntentId: string): string {
  return `TKT-${paymentIntentId.slice(-8).toUpperCase()}`;
}

function buildTicketEmail(
  ticketId: string,
  guestName: string,
  event: EventItem | undefined
): string {
  const title = event?.title ?? "Your Event";
  const date = event?.date ?? "TBD";
  const location = event ? `${event.location}, ${event.city}` : "TBD";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0d0d1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
  <tr><td align="center" style="padding:40px 16px">
    <table width="100%" style="max-width:520px" cellpadding="0" cellspacing="0">

      <tr><td style="background:linear-gradient(135deg,#7c3aed 0%,#4f46e5 100%);border-radius:20px 20px 0 0;padding:32px;text-align:center">
        <p style="margin:0;color:rgba(255,255,255,0.7);font-size:12px;letter-spacing:0.3em;text-transform:uppercase">ZITIKS</p>
        <h1 style="margin:8px 0 0;color:#fff;font-size:26px;font-weight:700">Ticket Confirmed</h1>
      </td></tr>

      <tr><td style="background:#13132b;border-left:1px solid rgba(124,58,237,0.3);border-right:1px solid rgba(124,58,237,0.3);padding:24px 32px">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td align="center" style="background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.3);border-radius:12px;padding:18px">
            <p style="margin:0;color:rgba(255,255,255,0.5);font-size:11px;letter-spacing:0.3em;text-transform:uppercase">Ticket ID</p>
            <p style="margin:8px 0 0;font-family:'Courier New',monospace;font-size:24px;font-weight:700;color:#a78bfa;letter-spacing:0.05em">${ticketId}</p>
          </td></tr>
        </table>
      </td></tr>

      <tr><td style="background:#13132b;border-left:1px solid rgba(124,58,237,0.3);border-right:1px solid rgba(124,58,237,0.3);padding:0 32px 24px">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="border-bottom:1px solid rgba(255,255,255,0.06);padding:14px 0">
            <p style="margin:0;color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.15em">Event</p>
            <p style="margin:5px 0 0;color:#fff;font-size:16px;font-weight:600">${title}</p>
          </td></tr>
          <tr><td style="border-bottom:1px solid rgba(255,255,255,0.06);padding:14px 0">
            <p style="margin:0;color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.15em">Date</p>
            <p style="margin:5px 0 0;color:#fff;font-size:15px">${date}</p>
          </td></tr>
          <tr><td style="border-bottom:1px solid rgba(255,255,255,0.06);padding:14px 0">
            <p style="margin:0;color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.15em">Venue</p>
            <p style="margin:5px 0 0;color:#fff;font-size:15px">${location}</p>
          </td></tr>
          <tr><td style="padding:14px 0">
            <p style="margin:0;color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.15em">Guest</p>
            <p style="margin:5px 0 0;color:#fff;font-size:15px">${guestName}</p>
          </td></tr>
        </table>
      </td></tr>

      <tr><td style="background:#0f0f22;border:1px solid rgba(124,58,237,0.3);border-top:none;border-radius:0 0 20px 20px;padding:20px 32px;text-align:center">
        <p style="margin:0;color:rgba(255,255,255,0.4);font-size:13px">Present this ticket ID at the entrance.</p>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.2);font-size:11px">ZITIKS &mdash; open source event ticketing</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;
}

async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) return false;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || user,
    to,
    subject,
    html,
  });

  return true;
}

async function sendSms(to: string, body: string): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !from) return false;

  const client = Twilio(accountSid, authToken);
  await client.messages.create({ from, to, body });
  return true;
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { paymentIntentId } = body;
  if (typeof paymentIntentId !== "string" || !paymentIntentId) {
    return NextResponse.json({ error: "paymentIntentId is required" }, { status: 400 });
  }

  const stripe = new Stripe(secret, { apiVersion: "2026-04-22.dahlia" as never });

  let pi: Stripe.PaymentIntent;
  try {
    pi = await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  if (pi.status !== "succeeded") {
    return NextResponse.json({ error: "Payment has not completed" }, { status: 400 });
  }

  const ticketId = formatTicketId(pi.id);

  if (pi.metadata?.confirmation_sent === "true") {
    return NextResponse.json({ ticketId });
  }

  const { eventId, name, email, phone } = pi.metadata ?? {};
  const event = events.find((e) => e.id === Number(eventId));

  const emailHtml = buildTicketEmail(ticketId, name ?? "Guest", event);
  const smsBody = `ZITIKS: Your ticket ${ticketId} for ${event?.title ?? "the event"} on ${event?.date ?? "TBD"} is confirmed. See you there!`;

  await Promise.allSettled([
    email ? sendEmail(email, `Your ZITIKS ticket — ${event?.title ?? "Event"}`, emailHtml) : Promise.resolve(),
    phone ? sendSms(phone, smsBody) : Promise.resolve(),
  ]);

  await stripe.paymentIntents.update(pi.id, {
    metadata: { ...pi.metadata, confirmation_sent: "true" },
  });

  return NextResponse.json({ ticketId });
}
