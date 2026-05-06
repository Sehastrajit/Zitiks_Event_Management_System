const MOVIES = [
  { title:"Dune: Part Two",   year:2024, genre:"Sci-Fi · Adventure", rating:"PG-13", duration:"2h 46m", price:"$18", state:"▶ Trailer playing…", playing:true  },
  { title:"Oppenheimer",      year:2023, genre:"Drama · History",    rating:"R",     duration:"3h 0m",  price:"$16", state:"Hover to play",  playing:false },
  { title:"The Batman",       year:2022, genre:"Action · Crime",     rating:"PG-13", duration:"2h 56m", price:"$15", state:"Hover to play",  playing:false },
  { title:"Top Gun: Maverick",year:2022, genre:"Action · Drama",     rating:"PG-13", duration:"2h 11m", price:"$17", state:"Hover to play",  playing:false },
];

export default function F03Movies() {
  return (
    <div className="h-full w-full text-white overflow-hidden"
      style={{ background: "radial-gradient(circle at center,#6d28d9,#050008 65%)" }}>

      <div className="flex items-center justify-between px-8 py-4 border-b border-white/8">
        <span className="text-xl font-bold">ZITIKS</span>
        <div className="flex gap-4 text-sm text-white/50">
          <span>Events</span><span className="text-purple-400">Movies</span>
        </div>
      </div>

      <div className="px-8 pt-6 pb-4">
        <p className="text-xs uppercase tracking-[0.3em] text-purple-400/60 mb-1">Now Showing</p>
        <h2 className="text-3xl font-bold mb-1">Movies &amp; Shows</h2>
        <p className="text-white/40 text-sm">Hover any card to watch the trailer instantly. Book tickets — no account needed.</p>
      </div>

      <div className="px-8 grid grid-cols-4 gap-4">
        {MOVIES.map((m) => (
          <div key={m.title} className={`rounded-2xl border overflow-hidden transition ${m.playing ? "border-purple-500/60 shadow-lg shadow-purple-900/40" : "border-white/8"}`}>

            {/* Poster / player area */}
            <div className="relative aspect-video bg-neutral-900 overflow-hidden">
              {m.playing ? (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 to-indigo-900/80 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mb-2">
                    <span className="text-white text-lg ml-0.5">▶</span>
                  </div>
                  <div className="text-xs text-white/60">Playing trailer…</div>
                  <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-red-600/90 rounded-full px-2 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-white text-xs font-semibold">LIVE</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-white ml-0.5">▶</span>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className="text-xs text-white/40 bg-black/50 rounded px-1.5 py-0.5">Hover to play</span>
                  </div>
                </>
              )}
              <div className="absolute bottom-2 right-2 flex gap-1">
                <span className="text-xs bg-black/60 text-white/60 px-1.5 py-0.5 rounded">{m.rating}</span>
              </div>
            </div>

            {/* Info */}
            <div className="p-3">
              <div className="flex flex-wrap gap-1 mb-2">
                {m.genre.split(" · ").map(g => (
                  <span key={g} className="text-xs bg-purple-600/15 border border-purple-600/20 text-purple-400 px-2 py-0.5 rounded-full">{g}</span>
                ))}
              </div>
              <div className="font-bold text-sm leading-snug">{m.title}</div>
              <div className="text-xs text-white/35 mt-0.5">{m.year} · {m.duration}</div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-purple-400 font-bold">{m.price}</span>
                <span className="rounded-full bg-purple-600 px-3 py-1 text-xs">Book Tickets</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Callout */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-2xl bg-black/60 border border-white/15 px-6 py-3 backdrop-blur-sm">
        <span className="text-2xl">🎬</span>
        <div>
          <div className="text-sm font-semibold">Hover any card to play the official trailer</div>
          <div className="text-xs text-white/40">Powered by YouTube · No redirect · 12 movies available</div>
        </div>
      </div>
    </div>
  );
}
