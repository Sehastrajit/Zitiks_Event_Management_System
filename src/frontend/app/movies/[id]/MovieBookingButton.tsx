"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import type { Showtime } from "@/lib/movies";

const stripePromise =
  typeof process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === "string" &&
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.length > 0
    ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    : null;

type Props = {
  movieId: number;
  movieTitle: string;
  moviePrice: string;
  showtimes: Showtime[];
};

type Step = "showtime" | "details" | "payment" | "success";

function PaymentStep({
  onSuccess,
  onBack,
}: {
  onSuccess: (ticketId: string) => void;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? "Submission failed");
      setLoading(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed. Please try again.");
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      try {
        const res = await fetch("/api/confirm-ticket", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Ticket confirmation failed");
        onSuccess(data.ticketId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ticket confirmation failed");
      }
    } else {
      setError("Payment did not complete. Please try again.");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handlePay} className="space-y-5">
      <PaymentElement options={{ wallets: { applePay: "auto", googlePay: "auto" }, layout: "tabs" }} />
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onBack} className="flex-1 rounded-full border border-gray-300 py-3 font-semibold text-black transition hover:bg-gray-50">
          Back
        </button>
        <button type="submit" disabled={loading || !stripe} className="flex-1 rounded-full bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50">
          {loading ? "Processing…" : "Pay Now"}
        </button>
      </div>
    </form>
  );
}

export default function MovieBookingButton({ movieId, movieTitle, moviePrice, showtimes }: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("showtime");
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() && !phone.trim()) {
      setError("Please enter an email or phone number.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/movie-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId,
          showtime: `${selectedShowtime?.time} · ${selectedShowtime?.format}`,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to initialise payment");
      setClientSecret(data.clientSecret);
      setStep("payment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function closeModal() {
    setOpen(false);
    setStep("showtime");
    setSelectedShowtime(null);
    setName("");
    setEmail("");
    setPhone("");
    setClientSecret("");
    setTicketId("");
    setError("");
  }

  const elementsOptions = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: "stripe" as const,
          variables: { colorPrimary: "#9333ea", borderRadius: "12px" },
        },
      }
    : undefined;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full bg-purple-600 px-8 py-3 font-semibold text-white transition hover:bg-purple-700"
      >
        Book Tickets
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="w-full max-w-md rounded-[2rem] border border-gray-200 bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto">

            {step === "success" && (
              <>
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">✓</div>
                  <h2 className="text-2xl font-bold text-black">Ticket Confirmed</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Your movie ticket has been issued{email ? " and emailed to you" : phone ? " via SMS" : ""}.
                  </p>
                </div>
                <div className="space-y-3 rounded-2xl border border-purple-200 bg-purple-50 p-5">
                  <div>
                    <p className="text-xs text-gray-400">Ticket ID</p>
                    <p className="mt-0.5 font-mono text-base font-semibold text-purple-700">{ticketId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Movie</p>
                    <p className="mt-0.5 text-sm font-medium text-black">{movieTitle}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Showtime</p>
                    <p className="mt-0.5 text-sm text-black">{selectedShowtime?.time} &middot; {selectedShowtime?.format}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Name</p>
                    <p className="mt-0.5 text-sm text-black">{name}</p>
                  </div>
                  {email && (
                    <div>
                      <p className="text-xs text-gray-400">Sent to</p>
                      <p className="mt-0.5 text-sm text-black">{email}</p>
                    </div>
                  )}
                </div>
                <button onClick={closeModal} className="mt-6 w-full rounded-full bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700">
                  Done
                </button>
              </>
            )}

            {step === "payment" && clientSecret && elementsOptions && (
              <>
                <div className="mb-5">
                  <h2 className="text-2xl font-bold text-black">Payment</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {movieTitle} &mdash; {selectedShowtime?.time} &middot; {selectedShowtime?.format} &mdash; {moviePrice}
                  </p>
                </div>
                <Elements stripe={stripePromise} options={elementsOptions}>
                  <PaymentStep onSuccess={(id) => { setTicketId(id); setStep("success"); }} onBack={() => setStep("details")} />
                </Elements>
              </>
            )}

            {step === "details" && (
              <>
                <div className="mb-5">
                  <h2 className="text-2xl font-bold text-black">Your details</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {movieTitle} &mdash; {selectedShowtime?.time} &middot; {selectedShowtime?.format} · No account needed
                  </p>
                </div>
                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-600">Full Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Your name"
                      className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-black outline-none placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-600">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-black outline-none placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-600">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 555 123 4567"
                      className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-black outline-none placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
                    />
                    <p className="mt-1.5 text-xs text-gray-400">Enter email, phone, or both — your ticket will be sent there.</p>
                  </div>
                  {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setStep("showtime")} className="flex-1 rounded-full border border-gray-300 py-3 font-semibold text-black transition hover:bg-gray-50">
                      Back
                    </button>
                    <button type="submit" disabled={loading} className="flex-1 rounded-full bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50">
                      {loading ? "Loading…" : "Continue to Payment"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {step === "showtime" && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-black">Choose Showtime</h2>
                  <p className="mt-1 text-sm text-gray-500">{movieTitle} &mdash; {moviePrice} per ticket</p>
                </div>
                <div className="space-y-3">
                  {showtimes.map((st) => (
                    <button
                      key={st.time}
                      type="button"
                      disabled={!st.available}
                      onClick={() => { setSelectedShowtime(st); setStep("details"); }}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        !st.available
                          ? "border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed"
                          : "border-gray-200 hover:border-purple-500 hover:bg-purple-50 cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-black">{st.time}</p>
                          <p className="text-sm text-gray-500">{st.format}</p>
                        </div>
                        {st.available ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Available</span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400">Sold Out</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <button type="button" onClick={closeModal} className="mt-6 w-full rounded-full border border-gray-300 py-3 font-semibold text-black transition hover:bg-gray-50">
                  Cancel
                </button>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}
