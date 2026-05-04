"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ComponentType } from "react";
import Footer from "@/components/Footer";
import EventMapBase from "./EventMapDynamic";

// Cast after static import — avoids the dynamic import() path TS can't resolve from this file
const EventMap = EventMapBase as ComponentType<{
  events: EventWithDistance[];
  userLocation: { lat: number; lng: number };
}>;

const API_BASE_URL = "http://localhost:8000";

const eventTypes = ["All", "Concert", "Conference", "Shows", "Workshop"];

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

type EventWithDistance = EventItem & { distance: number };

function getDistanceMiles(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function BookPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: 33.4255, lng: -111.94 });

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/events`);
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Events fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      () => setUserLocation({ lat: 33.4255, lng: -111.94 })
    );
  }, []);

  const filteredEvents: EventWithDistance[] = useMemo(() => {
    return events
      .map((event) => ({
        ...event,
        distance: getDistanceMiles(userLocation.lat, userLocation.lng, event.lat, event.lng),
      }))
      .filter((event) => {
        const s = search.toLowerCase();
        const matchesSearch =
          event.title.toLowerCase().includes(s) ||
          event.location.toLowerCase().includes(s) ||
          event.city.toLowerCase().includes(s) ||
          event.type.toLowerCase().includes(s);
        return matchesSearch && (activeType === "All" || event.type === activeType);
      })
      .sort((a, b) => a.distance - b.distance);
  }, [events, search, activeType, userLocation]);

  return (
    <>
      <main className="min-h-screen bg-neutral-950 text-white">
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/90 px-8 py-5 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              ZITIKS
            </Link>

            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm text-white/70 hover:text-white">
                Home
              </Link>
              <button
                onClick={() => setShowMap((prev) => !prev)}
                className="rounded-full border border-[#f5d27a]/30 px-5 py-2 text-sm text-[#f5d27a] transition hover:bg-[#f5d27a] hover:text-black"
              >
                Map
              </button>
            </div>
          </div>
        </nav>

        <section className="mx-auto max-w-7xl px-8 py-10">
          <div className="mb-8">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#f5d27a]/70">
              Premium Events
            </p>
            <h1 className="text-4xl font-bold md:text-5xl">Browse Events</h1>
            <p className="mt-3 max-w-2xl text-white/55">
              Search concerts, conferences, shows, and workshops near your area.
            </p>
          </div>

          <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search concerts, conferences, shows..."
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none placeholder:text-white/35 focus:border-[#f5d27a]/50"
            />

            <div className="mt-4 flex flex-wrap gap-3">
              {eventTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`rounded-full px-5 py-2 text-sm transition ${
                    activeType === type
                      ? "bg-[#f5d27a] text-black"
                      : "bg-white/10 text-white/75 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {showMap && (
            <div className="mb-8 overflow-hidden rounded-3xl border border-[#f5d27a]/15 bg-white/[0.04] shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div>
                  <h2 className="font-semibold">
                    {activeType === "All" ? "All Events" : `${activeType} Events`}
                  </h2>
                  <p className="text-sm text-white/45">
                    {filteredEvents.length} event{filteredEvents.length === 1 ? "" : "s"} near you.
                  </p>
                </div>
                <button
                  onClick={() => setShowMap(false)}
                  className="text-sm text-white/55 hover:text-white"
                >
                  Close
                </button>
              </div>
              <EventMap events={filteredEvents} userLocation={userLocation} />
            </div>
          )}

          {loading && <p className="text-white/60">Loading events...</p>}

          {!loading && filteredEvents.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
              <h2 className="text-2xl font-semibold">No events found</h2>
              <p className="mt-2 text-white/50">Try a different search or category.</p>
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-[#f5d27a]/30 hover:bg-white/[0.07]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full border border-[#f5d27a]/25 bg-[#f5d27a]/10 px-3 py-1 text-xs text-[#f5d27a]">
                    {event.type}
                  </span>
                  <span className="text-sm text-white/50">{event.date}</span>
                </div>

                <h2 className="text-2xl font-semibold">{event.title}</h2>

                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  {event.location}
                  <br />
                  {event.city}
                </p>

                <p className="mt-3 text-sm text-white/40">{event.distance.toFixed(1)} miles away</p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-lg font-semibold text-[#f5d27a]">{event.price}</span>
                  <Link
                    href={`/book/${event.id}`}
                    className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-[#f5d27a]"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
