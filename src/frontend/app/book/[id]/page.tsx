import Link from "next/link";
import { notFound } from "next/navigation";
import BookingButton from "./BookingButton";
import EventLocationMap from "./EventLocationMap";
import Footer from "@/components/Footer";

const API_BASE_URL = "http://127.0.0.1:8000";

type EventItem = {
  id: number;
  title: string;
  type: string;
  location: string;
  city: string;
  date: string;
  price: string;
  lat: number;
  lng: number;
  description?: string;
};

async function getEvent(id: string): Promise<EventItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/events/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

const typeStyles: Record<string, { accent: string; heroBg: string }> = {
  Concert:    { accent: "#f5d27a", heroBg: "rgba(120,40,10,0.22)" },
  Conference: { accent: "#93c5fd", heroBg: "rgba(10,30,80,0.22)"  },
  Shows:      { accent: "#d8b4fe", heroBg: "rgba(60,10,100,0.22)" },
  Workshop:   { accent: "#86efac", heroBg: "rgba(5,60,30,0.22)"   },
};

const eventDetailsByType: Record<
  string,
  {
    duration: string;
    entry: string;
    capacity: string;
    seating: string;
    ageLimit: string;
    timeline: { time: string; title: string; description: string }[];
    highlights: string[];
  }
> = {
  Concert: {
    duration: "3 hours",
    entry: "Mobile ticket and valid ID",
    capacity: "Limited premium seating",
    seating: "General admission with reserved front rows",
    ageLimit: "All ages",
    timeline: [
      { time: "6:00 PM", title: "Doors open", description: "Check in, scan tickets, and explore food and merch booths." },
      { time: "6:45 PM", title: "Opening set", description: "Local artists start the evening with a warm-up performance." },
      { time: "8:00 PM", title: "Main performance", description: "Headline performance begins with full-stage production." },
      { time: "9:45 PM", title: "Closing session", description: "Final songs, audience photos, and exit coordination." },
    ],
    highlights: ["Live music stage", "Food stalls", "Photo zones", "Premium lounge access"],
  },
  Conference: {
    duration: "4 hours",
    entry: "QR ticket, registration confirmation, and ID",
    capacity: "Auditorium seating",
    seating: "Reserved rows for early arrivals",
    ageLimit: "Students and professionals",
    timeline: [
      { time: "9:00 AM", title: "Registration", description: "Badge pickup, check-in, and networking breakfast." },
      { time: "10:00 AM", title: "Keynote", description: "Main speaker session covering trends, tools, and industry direction." },
      { time: "11:30 AM", title: "Panel discussion", description: "Founder and developer panel with audience questions." },
      { time: "12:45 PM", title: "Networking", description: "Meet speakers, teams, sponsors, and other attendees." },
    ],
    highlights: ["Speaker sessions", "Networking", "Startup demos", "Resource booths"],
  },
  Shows: {
    duration: "2 hours",
    entry: "Mobile ticket and venue check-in",
    capacity: "Theater seating",
    seating: "First come, first served",
    ageLimit: "16+ recommended",
    timeline: [
      { time: "7:00 PM", title: "Doors open", description: "Arrive early for seating, snacks, and pre-show music." },
      { time: "7:30 PM", title: "Opening act", description: "Short opener to set the tone for the main show." },
      { time: "8:00 PM", title: "Main show", description: "Featured performers take the stage." },
      { time: "9:30 PM", title: "Meet and greet", description: "Optional photos and post-show interaction near the lobby." },
    ],
    highlights: ["Live entertainment", "Reserved venue access", "Lobby concessions", "Photo opportunities"],
  },
  Workshop: {
    duration: "3 hours",
    entry: "Registration confirmation and laptop recommended",
    capacity: "Small group format",
    seating: "Collaborative table seating",
    ageLimit: "Open to beginners",
    timeline: [
      { time: "1:00 PM", title: "Check-in", description: "Sign in, set up your laptop, and meet the facilitators." },
      { time: "1:20 PM", title: "Intro session", description: "Overview of the topic, goals, and working format." },
      { time: "2:00 PM", title: "Hands-on activity", description: "Guided build session with mentor support." },
      { time: "3:40 PM", title: "Showcase", description: "Share outcomes, receive feedback, and collect next steps." },
    ],
    highlights: ["Hands-on learning", "Mentor support", "Small teams", "Take-home resources"],
  },
};

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();

  const style = typeStyles[event.type] ?? { accent: "#f5d27a", heroBg: "rgba(40,40,40,0.22)" };
  const eventInfo = eventDetailsByType[event.type] ?? eventDetailsByType.Concert;

  return (
    <>
      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen bg-neutral-950 px-8 pb-20 pt-8"
        style={{
          background: `radial-gradient(ellipse 90% 55% at 60% -10%, ${style.heroBg}, transparent 70%), #0a0a0a`,
        }}
      >
        {/* nav */}
        <nav className="mb-14 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            ZITIKS
          </Link>
          <Link href="/book" className="text-sm text-white/55 hover:text-white">
            Browse Events
          </Link>
        </nav>

        <div className="mx-auto max-w-6xl">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-white"
          >
            ← Back to events
          </Link>

          {/* badges */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span
              className="rounded-full border px-4 py-1.5 text-sm font-medium"
              style={{
                color: style.accent,
                borderColor: `${style.accent}44`,
                backgroundColor: `${style.accent}14`,
              }}
            >
              {event.type}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-sm text-white/55">
              {event.date}
            </span>
          </div>

          {/* title */}
          <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-[1.08] tracking-tight text-white md:text-7xl lg:text-[5.5rem]">
            {event.title}
          </h1>

          {/* location */}
          <p className="mt-7 flex items-center gap-2 text-lg text-white/50">
            <span>📍</span>
            <span>
              {event.location}, {event.city}
            </span>
          </p>

          {/* price */}
          <p
            className="mt-4 text-4xl font-bold md:text-5xl"
            style={{ color: style.accent }}
          >
            {event.price}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap gap-4">
            <BookingButton
              eventId={event.id}
              eventTitle={event.title}
              eventPrice={event.price}
            />
            <Link
              href="/book"
              className="rounded-full border border-white/15 px-8 py-3 font-semibold text-white transition hover:bg-white hover:text-black"
            >
              View More Events
            </Link>
          </div>
        </div>
      </section>

      {/* ─── DETAILS + DESCRIPTION ────────────────────────────────── */}
      <section className="bg-neutral-950 px-6 py-20 md:px-12">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_300px]">
          {/* description */}
          <div>
            <h2 className="mb-6 text-2xl font-bold text-white">About this Event</h2>
            <p className="max-w-3xl text-lg leading-9 text-white/60">
              {event.description ?? "No description provided for this event."}
            </p>
            <p className="mt-5 max-w-3xl text-lg leading-9 text-white/60">
              Expect a polished on-site experience with clear check-in, helpful staff, and a schedule built
              so you can arrive, settle in, and enjoy the main program without rushing. Tickets are limited
              and should be booked in advance to secure entry.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {eventInfo.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <p className="text-sm font-semibold text-white">{highlight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* details card */}
          <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
              Event Details
            </p>
            <dl className="space-y-5">
              {[
                { label: "Date",     value: event.date },
                { label: "Venue",    value: event.location },
                { label: "City",     value: event.city },
                { label: "Category", value: event.type },
                { label: "Price",    value: event.price },
                { label: "Duration", value: eventInfo.duration },
                { label: "Entry",    value: eventInfo.entry },
                { label: "Capacity", value: eventInfo.capacity },
                { label: "Seating",  value: eventInfo.seating },
                { label: "Age",      value: eventInfo.ageLimit },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-white/30">
                    {label}
                  </dt>
                  <dd className="text-sm font-medium text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {/* ─── LOCATION MAP ─────────────────────────────────────────── */}
      <section className="bg-neutral-950 px-6 pb-20 md:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/30">
            Schedule
          </p>
          <h2 className="mb-10 text-3xl font-bold text-white">Event Timeline</h2>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <div className="space-y-8">
              {eventInfo.timeline.map((item, index) => (
                <div key={`${item.time}-${item.title}`} className="grid gap-4 md:grid-cols-[110px_1fr]">
                  <div className="text-sm font-semibold" style={{ color: style.accent }}>
                    {item.time}
                  </div>
                  <div className="relative border-l border-white/10 pl-6">
                    <span
                      className="absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full"
                      style={{ backgroundColor: style.accent }}
                    />
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">
                      {item.description}
                    </p>
                    {index < eventInfo.timeline.length - 1 && (
                      <div className="mt-6 h-px bg-white/10" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0d0d0d] px-6 py-20 md:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/30">
            Location
          </p>
          <h2 className="mb-1 text-3xl font-bold text-white">Find Us</h2>
          <p className="mb-8 text-white/50">
            {event.location}, {event.city}
          </p>

          <div className="h-[480px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <EventLocationMap
              lat={event.lat}
              lng={event.lng}
              title={event.title}
              location={event.location}
              city={event.city}
              type={event.type}
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
