"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ComponentType } from "react";
import ChatBot from "@/components/ChatBot";
import Footer from "@/components/Footer";
import EventMapBase from "./EventMapDynamic";
import MapErrorBoundary from "./MapErrorBoundary";
import { US_STATES, STATE_CODES, parseState, parseCityName } from "@/lib/us-locations";

// Cast after static import — avoids the dynamic import() path TS can't resolve from this file
const EventMap = EventMapBase as ComponentType<{
  events: EventWithDistance[];
  userLocation: { lat: number; lng: number };
}>;

const eventTypes = ["All", "Concert", "Conference", "Shows", "Workshop"];
const priceFilters = ["All", "Free", "Under $30", "$30-$50", "$50+"] as const;

const typeColors: Record<string, { accent: string; bg: string; border: string }> = {
  Concert:    { accent: "#f5d27a", bg: "rgba(245,210,122,0.10)", border: "rgba(245,210,122,0.28)" },
  Conference: { accent: "#93c5fd", bg: "rgba(147,197,253,0.10)", border: "rgba(147,197,253,0.28)" },
  Shows:      { accent: "#d8b4fe", bg: "rgba(216,180,254,0.10)", border: "rgba(216,180,254,0.28)" },
  Workshop:   { accent: "#86efac", bg: "rgba(134,239,172,0.10)", border: "rgba(134,239,172,0.28)" },
};

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

type PriceFilter = (typeof priceFilters)[number];

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

function getPriceAmount(price: string) {
  if (price.toLowerCase() === "free") return 0;
  const amount = Number(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

function matchesPriceFilter(price: string, filter: PriceFilter) {
  const amount = getPriceAmount(price);

  if (filter === "All") return true;
  if (filter === "Free") return amount === 0;
  if (filter === "Under $30") return amount > 0 && amount < 30;
  if (filter === "$30-$50") return amount >= 30 && amount <= 50;
  return amount > 50;
}

export default function BookPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [selectedDate, setSelectedDate] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState<PriceFilter>("All");
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: 33.4255, lng: -111.94 });

  useEffect(() => {
    setShowMap(new URLSearchParams(window.location.search).get("map") === "1");
  }, []);

  function updateMapVisibility(nextShowMap: boolean) {
    setShowMap(nextShowMap);

    const url = new URL(window.location.href);
    if (nextShowMap) {
      url.searchParams.set("map", "1");
    } else {
      url.searchParams.delete("map");
    }
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
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

  const dates = useMemo(() => {
    return ["All", ...Array.from(new Set(events.map((event) => event.date)))];
  }, [events]);



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
        const matchesType  = activeType === "All" || event.type === activeType;
        const matchesDate  = selectedDate === "All" || event.date === selectedDate;
        const eventState   = parseState(event.city);
        const eventCity    = parseCityName(event.city);
        const matchesState = selectedState === "All" || eventState === selectedState;
        const matchesCity  = selectedCity === "All"  || eventCity === selectedCity;
        const matchesPrice = matchesPriceFilter(event.price, selectedPrice);

        return matchesSearch && matchesType && matchesDate && matchesState && matchesCity && matchesPrice;
      })
      .sort((a, b) => a.distance - b.distance);
  }, [events, search, activeType, selectedDate, selectedState, selectedCity, selectedPrice, userLocation]);

  return (
    <>
      <main className="min-h-screen text-white" style={{ background: "radial-gradient(circle_at_center,#6d28d9,#050008_65%)" }}>
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-white/10 px-8 py-5 backdrop-blur">
          <div className="flex w-full items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              ZITIKS
            </Link>

            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm text-white/70 hover:text-white">
                Home
              </Link>
              <Link href="/movies" className="text-sm text-white/70 hover:text-white">
                Movies
              </Link>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  updateMapVisibility(!showMap);
                }}
                className="rounded-full border border-purple-600/30 px-5 py-2 text-sm text-purple-400 transition hover:bg-purple-600 hover:text-white"
              >
                Map
              </button>
            </div>
          </div>
        </nav>

        <section className="w-full px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold md:text-5xl">Available Events</h1>
          </div>

          <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl">
            <input
              id="event-search"
              name="event-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search concerts, conferences, shows..."
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none placeholder:text-white/35 focus:border-purple-600/50"
            />

            <div className="mt-4 flex flex-wrap gap-3">
              {eventTypes.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`rounded-full px-5 py-2 text-sm transition ${
                    activeType === type
                      ? "bg-purple-600 text-white"
                      : "bg-white/10 text-white/75 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {showMap && (
            <div className="mb-8 overflow-hidden rounded-3xl border border-purple-600/15 bg-white/[0.04] shadow-2xl">
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
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    updateMapVisibility(false);
                  }}
                  className="text-sm text-white/55 hover:text-white"
                >
                  Close
                </button>
              </div>
              <MapErrorBoundary>
                <EventMap events={filteredEvents} userLocation={userLocation} />
              </MapErrorBoundary>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl lg:sticky lg:top-28">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDate("All");
                    setSelectedState("All");
                    setSelectedCity("All");
                    setSelectedPrice("All");
                  }}
                  className="text-sm text-white/45 transition hover:text-white"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/70">Date</span>
                  <select
                    id="date-filter"
                    name="date-filter"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-purple-600/50"
                  >
                    {dates.map((date) => (
                      <option key={date} value={date} className="bg-neutral-950">
                        {date === "All" ? "All dates" : date}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/70">State</span>
                  <select
                    value={selectedState}
                    onChange={(e) => { setSelectedState(e.target.value); setSelectedCity("All"); }}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-purple-600/50"
                  >
                    <option value="All" className="bg-neutral-950">All States</option>
                    {STATE_CODES.map((code) => (
                      <option key={code} value={code} className="bg-neutral-950">
                        {US_STATES[code].name}
                      </option>
                    ))}
                  </select>
                </label>

                {selectedState !== "All" && (
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-white/70">City</span>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-purple-600/50"
                    >
                      <option value="All" className="bg-neutral-950">All Cities</option>
                      {(US_STATES[selectedState]?.cities ?? []).map((c) => (
                        <option key={c} value={c} className="bg-neutral-950">{c}</option>
                      ))}
                    </select>
                  </label>
                )}

                <fieldset>
                  <legend className="mb-2 text-sm font-medium text-white/70">Price</legend>
                  <div className="grid gap-2">
                    {priceFilters.map((price) => (
                      <button
                        type="button"
                        key={price}
                        onClick={() => setSelectedPrice(price)}
                        className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                          selectedPrice === price
                            ? "border-purple-600/60 bg-purple-600/15 text-purple-400"
                            : "border-white/10 bg-black/25 text-white/65 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {price === "All" ? "All prices" : price}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>
            </aside>

            <div>
              {loading && <p className="text-white/60">Loading events...</p>}

              {!loading && filteredEvents.length === 0 && (
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
                  <h2 className="text-2xl font-semibold">No events found</h2>
                  <p className="mt-2 text-white/50">Try a different search or filter.</p>
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-purple-600/30 hover:bg-white/[0.07]"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      {(() => {
                        const c = typeColors[event.type] ?? typeColors.Concert;
                        return (
                          <span
                            className="rounded-full border px-3 py-1 text-xs font-medium"
                            style={{ color: c.accent, backgroundColor: c.bg, borderColor: c.border }}
                          >
                            {event.type}
                          </span>
                        );
                      })()}
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
                      <span className="text-lg font-semibold text-purple-400">{event.price}</span>
                      <Link
                        href={`/book/${event.id}`}
                        className="rounded-full bg-purple-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <ChatBot pageContext="Browse page with all ZITIKS events, filters, map, and booking links." />
      <Footer />
    </>
  );
}
