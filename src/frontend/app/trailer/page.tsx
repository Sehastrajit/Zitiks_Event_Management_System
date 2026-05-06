"use client";
import { useState } from "react";
import F01Hero    from "./frames/F01Hero";
import F02Events  from "./frames/F02Events";
import F03Movies  from "./frames/F03Movies";
import F04Booking from "./frames/F04Booking";
import F05Payment from "./frames/F05Payment";
import F06Ticket  from "./frames/F06Ticket";
import F07Filter  from "./frames/F07Filter";
import F08Create  from "./frames/F08Create";
import F09Stack   from "./frames/F09Stack";

const FRAMES = [
  { id: "F01", label: "Hero",        component: F01Hero,    desc: "Landing · Brand · Feature pills" },
  { id: "F02", label: "Events",      component: F02Events,  desc: "Browse page · Filter sidebar · Grid" },
  { id: "F03", label: "Movies",      component: F03Movies,  desc: "Movie trailers · Hover to play" },
  { id: "F04", label: "Booking",     component: F04Booking, desc: "Guest details · Step 1 of 3" },
  { id: "F05", label: "Payment",     component: F05Payment, desc: "Stripe · Apple Pay · Google Pay" },
  { id: "F06", label: "Ticket",      component: F06Ticket,  desc: "Confirmation · Email · SMS" },
  { id: "F07", label: "Filter",      component: F07Filter,  desc: "US State → City cascade" },
  { id: "F08", label: "Create",      component: F08Create,  desc: "Create event → Airtable CMS" },
  { id: "F09", label: "Tech Stack",  component: F09Stack,   desc: "Full stack overview · OSS" },
];

export default function TrailerGallery() {
  const [active, setActive] = useState(0);
  const Frame = FRAMES[active].component;

  return (
    <div className="min-h-screen bg-[#050008] text-white flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/8 shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm">ZITIKS</span>
          <span className="text-white/20">·</span>
          <span className="text-xs text-white/40">Trailer Frames</span>
          <span className="text-white/20">·</span>
          <span className="text-xs text-purple-400">{FRAMES[active].id} — {FRAMES[active].label}</span>
        </div>
        <div className="text-xs text-white/30">{FRAMES[active].desc}</div>
      </div>

      {/* Frame tabs */}
      <div className="flex items-center gap-1.5 px-6 py-2.5 border-b border-white/8 overflow-x-auto shrink-0">
        {FRAMES.map((f, i) => (
          <button
            key={f.id}
            onClick={() => setActive(i)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              i === active
                ? "bg-purple-600 text-white"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="text-white/40 mr-1">{f.id}</span>{f.label}
          </button>
        ))}
      </div>

      {/* Viewport */}
      <div className="flex-1 flex flex-col min-h-0 p-6 gap-4">
        {/* 16:9 frame */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <div
            className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative"
            style={{ maxWidth: "1280px", aspectRatio: "16/9" }}
          >
            <Frame />
          </div>
        </div>

        {/* Navigation row */}
        <div className="flex items-center justify-center gap-4 shrink-0">
          <button
            onClick={() => setActive(i => Math.max(0, i - 1))}
            disabled={active === 0}
            className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm disabled:opacity-30 hover:bg-white/10 transition"
          >
            ← Prev
          </button>

          <div className="flex gap-1.5">
            {FRAMES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === active ? "bg-purple-500" : "bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setActive(i => Math.min(FRAMES.length - 1, i + 1))}
            disabled={active === FRAMES.length - 1}
            className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm disabled:opacity-30 hover:bg-white/10 transition"
          >
            Next →
          </button>
        </div>

        {/* Thumbnail strip */}
        <div className="flex gap-2 overflow-x-auto pb-1 shrink-0 justify-center">
          {FRAMES.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setActive(i)}
              className={`shrink-0 flex flex-col items-center gap-1 group`}
            >
              <div className={`w-28 h-16 rounded-xl overflow-hidden border transition ${
                i === active ? "border-purple-500 shadow-lg shadow-purple-900/40" : "border-white/10 opacity-50 hover:opacity-80"
              }`}>
                <div className="w-full h-full scale-[0.25] origin-top-left" style={{ width: "400%", height: "400%" }}>
                  <f.component />
                </div>
              </div>
              <span className="text-xs text-white/40 group-hover:text-white/60">{f.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
