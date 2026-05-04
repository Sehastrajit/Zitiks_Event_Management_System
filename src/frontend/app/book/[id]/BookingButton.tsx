"use client";

import { useState } from "react";

type Props = {
  eventId: number;
  eventTitle: string;
  eventPrice: string;
};

type BookingResult = {
  ticketId: string;
  issuedAt: string;
};

export default function BookingButton({ eventId, eventTitle, eventPrice }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BookingResult | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, name: name.trim(), email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Booking failed");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function closeModal() {
    setOpen(false);
    setResult(null);
    setName("");
    setEmail("");
    setError("");
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full bg-[#f5d27a] px-8 py-3 font-semibold text-black transition hover:bg-white"
      >
        Confirm Booking
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-neutral-950 p-8 shadow-2xl">
            {result ? (
              <>
                <div className="mb-6 text-center">
                  <div className="mb-3 text-5xl text-[#f5d27a]">✓</div>
                  <h2 className="text-2xl font-bold">Booking Confirmed</h2>
                  <p className="mt-1 text-sm text-white/55">
                    Your ticket has been issued.
                  </p>
                </div>

                <div className="space-y-3 rounded-2xl border border-[#f5d27a]/20 bg-[#f5d27a]/5 p-5">
                  <div>
                    <p className="text-xs text-white/45">Ticket ID</p>
                    <p className="mt-0.5 font-mono text-sm text-[#f5d27a]">
                      {result.ticketId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/45">Event</p>
                    <p className="mt-0.5 text-sm text-white">{eventTitle}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/45">Name</p>
                    <p className="mt-0.5 text-sm text-white">{name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/45">Email</p>
                    <p className="mt-0.5 text-sm text-white">{email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/45">Issued At</p>
                    <p className="mt-0.5 text-sm text-white">
                      {new Date(result.issuedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeModal}
                  className="mt-6 w-full rounded-full border border-white/15 py-3 font-semibold text-white transition hover:bg-white hover:text-black"
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <h2 className="mb-1 text-2xl font-bold">Confirm Booking</h2>
                <p className="mb-6 text-sm text-white/55">
                  {eventTitle} &mdash; {eventPrice}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm text-white/60">
                      Full Name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Your name"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#f5d27a]/50"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm text-white/60">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="your@email.com"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#f5d27a]/50"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-400">{error}</p>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 rounded-full border border-white/15 py-3 font-semibold text-white transition hover:bg-white hover:text-black"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 rounded-full bg-[#f5d27a] py-3 font-semibold text-black transition hover:bg-white disabled:opacity-50"
                    >
                      {loading ? "Booking..." : "Confirm"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
