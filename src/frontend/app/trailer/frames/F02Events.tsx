const EVENTS = [
  { type:"Concert",    title:"Desert Night Concert",    city:"Tempe, AZ",    date:"May 12", price:"$35", color:"#f5d27a" },
  { type:"Conference", title:"AI Builders Conference",  city:"Tempe, AZ",    date:"May 18", price:"$20", color:"#93c5fd" },
  { type:"Shows",      title:"Comedy Live Show",        city:"Phoenix, AZ",  date:"May 22", price:"$25", color:"#d8b4fe" },
  { type:"Concert",    title:"Hollywood Bowl Night",    city:"Los Angeles, CA", date:"Jun 14", price:"$55", color:"#f5d27a" },
  { type:"Workshop",   title:"Startup Workshop",        city:"Austin, TX",   date:"Jul 5",  price:"Free", color:"#86efac" },
  { type:"Conference", title:"NYC Founders Summit",     city:"New York, NY", date:"Jun 28", price:"$75", color:"#93c5fd" },
];

export default function F02Events() {
  return (
    <div className="h-full w-full text-white overflow-hidden"
      style={{ background: "radial-gradient(circle at center,#6d28d9,#050008 65%)" }}>

      {/* Nav */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-white/8">
        <span className="text-xl font-bold">ZITIKS</span>
        <div className="flex gap-4 text-sm text-white/50">
          <span>Home</span><span className="text-purple-400">Events</span><span>Movies</span>
        </div>
      </div>

      <div className="flex h-[calc(100%-57px)]">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 border-r border-white/8 p-4 space-y-4">
          <div className="font-semibold text-sm">Filters</div>

          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">State</p>
            <div className="rounded-xl border border-purple-600/50 bg-purple-600/15 px-3 py-2 text-sm text-purple-300 flex justify-between items-center">
              Arizona <span className="text-white/30">▾</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">City</p>
            <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/60 flex justify-between items-center">
              All Cities <span className="text-white/30">▾</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Price</p>
            {["All prices","Under $30","$30–$50","$50+"].map((p,i) => (
              <div key={p} className={`rounded-xl border px-3 py-2 text-sm mb-1.5 ${i===0?"border-purple-600/50 bg-purple-600/10 text-purple-300":"border-white/8 text-white/40"}`}>{p}</div>
            ))}
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 overflow-hidden p-5">
          {/* Search + type pills */}
          <div className="mb-4">
            <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white/30 mb-3">
              🔍  Search concerts, conferences, shows…
            </div>
            <div className="flex gap-2">
              {["All","Concert","Conference","Shows","Workshop"].map((t,i)=>(
                <span key={t} className={`rounded-full px-4 py-1.5 text-xs font-medium ${i===0?"bg-purple-600 text-white":"bg-white/8 text-white/50"}`}>{t}</span>
              ))}
            </div>
          </div>

          {/* Event grid */}
          <div className="grid grid-cols-3 gap-3">
            {EVENTS.map(ev=>(
              <div key={ev.title} className="rounded-2xl border border-white/8 bg-white/[0.04] p-4 hover:border-purple-600/30 transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="rounded-full border px-2 py-0.5 text-xs"
                    style={{ color:ev.color, borderColor:ev.color+"44", background:ev.color+"14" }}>
                    {ev.type}
                  </span>
                  <span className="text-xs text-white/35">{ev.date}</span>
                </div>
                <div className="font-semibold text-sm leading-snug">{ev.title}</div>
                <div className="text-xs text-white/40 mt-1.5">{ev.city}</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-purple-400 font-bold text-sm">{ev.price}</span>
                  <span className="rounded-full bg-purple-600 px-3 py-1 text-xs text-white">Book Now</span>
                </div>
              </div>
            ))}
          </div>

          {/* Stats bar */}
          <div className="mt-3 flex gap-6 text-xs text-white/30">
            <span>18 events found</span><span>·</span><span>8 US states</span><span>·</span><span>Sorted by distance</span>
          </div>
        </div>
      </div>

      {/* Callout */}
      <div className="absolute bottom-6 right-6 rounded-2xl bg-purple-600/20 border border-purple-500/30 px-5 py-3 text-sm text-purple-300 backdrop-blur-sm">
        ✦ Filter by US State → City
      </div>
    </div>
  );
}
