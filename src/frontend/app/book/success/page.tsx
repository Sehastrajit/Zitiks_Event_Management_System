import Link from "next/link";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import Twilio from "twilio";
import { events } from "@/lib/events";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
function getStripe() {
  return new Stripe(stripeSecret!, { apiVersion: "2026-04-22.dahlia" as never });
}

async function sendEmail(to: string, subject: string, html: string) {
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
  await transporter.sendMail({ from: process.env.EMAIL_FROM || user, to, subject, html });
  return true;
}

async function sendSms(to: string, message: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!accountSid || !authToken || !from) return false;
  const client = Twilio(accountSid, authToken);
  await client.messages.create({ from, to, body: message });
  return true;
}

function formatTicketId(id: string) {
  return `TKT-${id.slice(-8).toUpperCase()}`;
}

function buildTicketHtml(ticketId: string, guestName: string, eventTitle: string, eventDate: string, eventLocation: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0d0d1a;font-family:-apple-system,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px">
<table width="100%" style="max-width:520px" cellpadding="0" cellspacing="0">
<tr><td style="background:linear-gradient(135deg,#7c3aed,#4f46e5);border-radius:20px 20px 0 0;padding:32px;text-align:center">
<p style="margin:0;color:rgba(255,255,255,0.7);font-size:12px;letter-spacing:0.3em;text-transform:uppercase">ZITIKS</p>
<h1 style="margin:8px 0 0;color:#fff;font-size:26px;font-weight:700">Ticket Confirmed</h1>
</td></tr>
<tr><td style="background:#13132b;border-left:1px solid rgba(124,58,237,0.3);border-right:1px solid rgba(124,58,237,0.3);padding:24px 32px">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.3);border-radius:12px;padding:18px">
<p style="margin:0;color:rgba(255,255,255,0.5);font-size:11px;letter-spacing:0.3em;text-transform:uppercase">Ticket ID</p>
<p style="margin:8px 0 0;font-family:'Courier New',monospace;font-size:24px;font-weight:700;color:#a78bfa">${ticketId}</p>
</td></tr></table>
</td></tr>
<tr><td style="background:#13132b;border-left:1px solid rgba(124,58,237,0.3);border-right:1px solid rgba(124,58,237,0.3);padding:0 32px 24px">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="border-bottom:1px solid rgba(255,255,255,0.06);padding:14px 0"><p style="margin:0;color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.15em">Event</p><p style="margin:5px 0 0;color:#fff;font-size:16px;font-weight:600">${eventTitle}</p></td></tr>
<tr><td style="border-bottom:1px solid rgba(255,255,255,0.06);padding:14px 0"><p style="margin:0;color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.15em">Date</p><p style="margin:5px 0 0;color:#fff;font-size:15px">${eventDate}</p></td></tr>
<tr><td style="border-bottom:1px solid rgba(255,255,255,0.06);padding:14px 0"><p style="margin:0;color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.15em">Venue</p><p style="margin:5px 0 0;color:#fff;font-size:15px">${eventLocation}</p></td></tr>
<tr><td style="padding:14px 0"><p style="margin:0;color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.15em">Guest</p><p style="margin:5px 0 0;color:#fff;font-size:15px">${guestName}</p></td></tr>
</table>
</td></tr>
<tr><td style="background:#0f0f22;border:1px solid rgba(124,58,237,0.3);border-top:none;border-radius:0 0 20px 20px;padding:20px 32px;text-align:center">
<p style="margin:0;color:rgba(255,255,255,0.4);font-size:13px">Present this ticket ID at the entrance.</p>
<p style="margin:8px 0 0;color:rgba(255,255,255,0.2);font-size:11px">ZITIKS &mdash; open source event ticketing</p>
</td></tr>
</table></td></tr></table>
</body></html>`;
}

type PageProps = { searchParams: { session_id?: string; payment_intent?: string } };

export default async function SuccessPage({ searchParams }: PageProps) {
  if (!stripeSecret) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white px-8 py-24">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
          <h1 className="text-4xl font-bold">Stripe not configured</h1>
          <p className="mt-4 text-white/70">
            Set <code>STRIPE_SECRET_KEY</code> in your environment.
          </p>
        </div>
      </main>
    );
  }

  const { session_id: sessionId, payment_intent: paymentIntentId } = searchParams;

  if (!sessionId && !paymentIntentId) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white px-8 py-24">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
          <h1 className="text-4xl font-bold">Missing session</h1>
          <p className="mt-4 text-white/70">No payment session ID was provided.</p>
          <Link href="/book" className="mt-8 inline-flex rounded-full bg-purple-600 px-7 py-3 text-white transition hover:bg-purple-700">
            Back to events
          </Link>
        </div>
      </main>
    );
  }

  let ticketId: string;
  let metadata: Record<string, string>;
  let isPaid: boolean;

  if (paymentIntentId) {
    const pi = await getStripe().paymentIntents.retrieve(paymentIntentId);
    isPaid = pi.status === "succeeded";
    ticketId = formatTicketId(pi.id);
    metadata = (pi.metadata as Record<string, string>) ?? {};
  } else {
    const session = await getStripe().checkout.sessions.retrieve(sessionId!, {
      expand: ["payment_intent"],
    });
    isPaid = session.payment_status === "paid";
    ticketId = formatTicketId(session.id);
    metadata = (session.metadata as Record<string, string>) ?? {};
  }

  if (!isPaid) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white px-8 py-24">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
          <h1 className="text-4xl font-bold">Payment incomplete</h1>
          <p className="mt-4 text-white/70">Payment has not completed yet.</p>
          <Link href="/book" className="mt-8 inline-flex rounded-full bg-purple-600 px-7 py-3 text-white transition hover:bg-purple-700">
            Browse events
          </Link>
        </div>
      </main>
    );
  }

  const event = events.find((e) => e.id === Number(metadata.eventId));
  const contactDisplay = metadata.email || metadata.phone || "your contact";

  if (metadata.confirmation_sent !== "true") {
    const title = event?.title ?? "Your Event";
    const date = event?.date ?? "TBD";
    const location = event ? `${event.location}, ${event.city}` : "TBD";
    const html = buildTicketHtml(ticketId, metadata.name ?? "Guest", title, date, location);
    const subject = `Your ZITIKS ticket — ${title}`;
    const sms = `ZITIKS: Ticket ${ticketId} for ${title} on ${date} confirmed. See you there!`;

    await Promise.allSettled([
      metadata.email ? sendEmail(metadata.email, subject, html).catch(() => false) : Promise.resolve(),
      metadata.phone ? sendSms(metadata.phone, sms).catch(() => false) : Promise.resolve(),
    ]);

    if (paymentIntentId) {
      await getStripe().paymentIntents.update(paymentIntentId, {
        metadata: { ...metadata, confirmation_sent: "true" },
      });
    } else if (sessionId) {
      await getStripe().checkout.sessions.update(sessionId, {
        metadata: { ...metadata, confirmation_sent: "true" },
      });
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white px-8 py-24">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl">
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl bg-purple-600/10 p-6 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-purple-300/80">Booking complete</p>
            <h1 className="mt-4 text-4xl font-bold">Ticket confirmed</h1>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Ticket ID</p>
              <p className="mt-3 font-mono text-xl text-purple-300">{ticketId}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Sent to</p>
              <p className="mt-3 text-lg text-white">{contactDisplay}</p>
              <p className="mt-1 text-sm text-white/50">
                Confirmation sent to your {metadata.email ? "email" : "phone"}.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Event</p>
            <h2 className="mt-3 text-2xl font-bold text-purple-200">{event?.title ?? "Unknown event"}</h2>
            <p className="mt-2 text-white/70">{event?.location}, {event?.city}</p>
            <p className="mt-1 text-white/70">{event?.date}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/book"
              className="rounded-full bg-purple-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-purple-700"
            >
              Browse more events
            </Link>
            <Link
              href="/book"
              className="rounded-full border border-white/10 px-6 py-3 text-center font-semibold text-white transition hover:bg-white/10"
            >
              Back to events
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
