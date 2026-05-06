export default function F01Hero() {
  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col items-center justify-center text-white"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%,#4c1d95,#1a0533 55%,#050008)" }}>

      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle,#7c3aed,transparent 70%)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-8" style={{ background: "radial-gradient(circle,#a78bfa,transparent 70%)" }} />

      {/* Floating event cards — left */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 space-y-4 opacity-60 -rotate-3 scale-90">
        {[["🎵","Desert Night Concert","Tempe, AZ","May 12","$35"],
          ["🎙","Brooklyn Jazz Festival","NYC, NY","Jun 21","$40"]].map(([icon,title,city,date,price])=>(
          <div key={title} className="w-56 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
            <div className="text-lg mb-1">{icon}</div>
            <div className="text-sm font-semibold">{title}</div>
            <div className="text-xs text-white/50 mt-1">{city} · {date}</div>
            <div className="text-purple-400 font-bold mt-2 text-sm">{price}</div>
          </div>
        ))}
      </div>

      {/* Floating movie card — right */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-60 rotate-3 scale-90">
        <div className="w-48 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 h-28 flex items-center justify-center text-4xl">🎬</div>
          <div className="p-3">
            <div className="text-xs text-purple-300 mb-1">IMAX · PG-13</div>
            <div className="text-sm font-bold">Oppenheimer</div>
            <div className="text-xs text-white/40 mt-1">▶ Hover to watch trailer</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-8 max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-purple-400/70 mb-6">Open Source · Production Ready</p>

        <h1 className="text-7xl font-black tracking-[-0.04em] mb-6 leading-none"
          style={{ background: "linear-gradient(135deg,#fff 40%,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          ZITIKS
        </h1>

        <p className="text-2xl font-light text-white/70 mb-10 tracking-wide">
          Event Discovery &amp; Ticketing Platform
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {["💳 Stripe Wallets","📧 SMTP Tickets","📱 SMS Delivery","🤖 AI Chat","📊 Airtable CMS","🗺 15 US States","🎬 Movie Trailers"].map(f => (
            <span key={f} className="rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300 backdrop-blur-sm">
              {f}
            </span>
          ))}
        </div>

        <p className="mt-10 text-white/30 text-sm">No account needed · Guest checkout · Open source</p>
      </div>
    </div>
  );
}
