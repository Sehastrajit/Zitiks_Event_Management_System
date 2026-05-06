"use client";

import { useState } from "react";
import Link from "next/link";

const categories = ["Concert", "Conference", "Shows", "Workshop"] as const;
type Category = (typeof categories)[number];

type Step = "form" | "success";

export default function CreateEventPage() {
  const [step, setStep] = useState<Step>("form");
  const [title, setTitle]       = useState("");
  const [venue, setVenue]       = useState("");
  const [city, setCity]         = useState("");
  const [date, setDate]         = useState("");
  const [price, setPrice]       = useState("");
  const [category, setCategory] = useState<Category>("Concert");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [recordId, setRecordId] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/create-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, venue, city, date, price, category }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed");

      setRecordId(data.id ?? "");
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep("form");
    setTitle(""); setVenue(""); setCity("");
    setDate(""); setPrice(""); setCategory("Concert");
    setError(""); setRecordId("");
  }

  return (
    <main
      className="min-h-screen px-8 py-8 text-white"
      style={{ background: "radial-gradient(circle_at_center,#6d28d9,#050008_65%)" }}
    >
      <nav className="mb-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">ZITIKS</Link>
        <Link href="/book" className="text-sm text-white/70 transition hover:text-white">
          ← Back to Browse
        </Link>
      </nav>

      <section className="mx-auto max-w-2xl">
        {step === "success" ? (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/15 border border-green-500/30 text-4xl">
              ✓
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-purple-400/70 mb-3">
              Submitted
            </p>
            <h1 className="text-4xl font-bold">Event received</h1>
            <p className="mt-4 text-lg text-white/55 max-w-lg mx-auto leading-relaxed">
              Your event has been submitted successfully. It will appear in the Airtable base for review.
            </p>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-left space-y-3">
              <div>
                <p className="text-xs text-white/35 uppercase tracking-widest">Event</p>
                <p className="mt-1 font-semibold">{title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-white/35 uppercase tracking-widest">Venue</p>
                  <p className="mt-1 text-sm text-white/80">{venue}</p>
                </div>
                <div>
                  <p className="text-xs text-white/35 uppercase tracking-widest">City</p>
                  <p className="mt-1 text-sm text-white/80">{city}</p>
                </div>
                <div>
                  <p className="text-xs text-white/35 uppercase tracking-widest">Category</p>
                  <p className="mt-1 text-sm text-purple-400">{category}</p>
                </div>
                <div>
                  <p className="text-xs text-white/35 uppercase tracking-widest">Price</p>
                  <p className="mt-1 text-sm text-white/80">${price}</p>
                </div>
              </div>
              {recordId && (
                <div>
                  <p className="text-xs text-white/25 uppercase tracking-widest">Airtable Record</p>
                  <p className="mt-1 font-mono text-xs text-white/40">{recordId}</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={reset}
                className="rounded-full border border-white/15 px-7 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Submit Another
              </button>
              <Link
                href="/book"
                className="rounded-full bg-purple-600 px-7 py-3 font-semibold text-white transition hover:bg-purple-700"
              >
                Browse Events
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-purple-400/60">
              Organizer
            </p>
            <h1 className="text-5xl font-bold md:text-6xl">Create Event</h1>
            <p className="mt-4 text-white/50 text-lg leading-relaxed">
              Fill in your event details. Submissions go directly to our Airtable base for review and publishing.
            </p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-5">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/30">Event Info</p>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/65">Event Title <span className="text-purple-400">*</span></span>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Desert Night Concert"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-purple-600/50 focus:ring-2 focus:ring-purple-600/10"
                  />
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-white/65">Category <span className="text-purple-400">*</span></span>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                      required
                      className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none focus:border-purple-600/50"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c} className="bg-neutral-950">{c}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-white/65">Price (USD) <span className="text-purple-400">*</span></span>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-semibold">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        placeholder="0.00"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 pl-8 pr-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-purple-600/50 focus:ring-2 focus:ring-purple-600/10"
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-5">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/30">Location & Time</p>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-white/65">Venue <span className="text-purple-400">*</span></span>
                    <input
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      required
                      placeholder="e.g. Tempe Beach Park"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-purple-600/50 focus:ring-2 focus:ring-purple-600/10"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-white/65">City <span className="text-purple-400">*</span></span>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      placeholder="e.g. Tempe, AZ"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-purple-600/50 focus:ring-2 focus:ring-purple-600/10"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/65">Date & Time <span className="text-purple-400">*</span></span>
                  <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-purple-600/50 focus:ring-2 focus:ring-purple-600/10 [color-scheme:dark]"
                  />
                </label>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-purple-600 py-4 font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50 text-base"
              >
                {loading ? "Submitting…" : "Create Event"}
              </button>

              <p className="text-center text-xs text-white/30">
                Submissions are saved to Airtable and reviewed before publishing.
              </p>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
