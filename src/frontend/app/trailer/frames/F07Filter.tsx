const STATES = ["Arizona","California","New York","Texas","Florida","Illinois"];
const AZ_CITIES = ["Tempe","Phoenix","Scottsdale","Mesa","Tucson"];

const EVENTS = [
  { type:"Concert",    title:"Desert Night Concert",   city:"Tempe",     date:"May 12", price:"$35", color:"#f5d27a" },
  { type:"Conference", title:"AI Builders Conference", city:"Scottsdale", date:"May 18", price:"$20", color:"#93c5fd" },
  { type:"Shows",      title:"Comedy Live Show",       city:"Phoenix",   date:"May 22", price:"$25", color:"#d8b4fe" },
];

export default function F07Filter() {
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
        <aside className="w-64 shrink-0 border-r border-white/8 p-5 space-y-5">
          <div className="font-semibold text-sm">Location Filter</div>

          {/* State */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">State</p>
            <div className="space-y-1.5">
              {STATES.map((s,i) => (
                <div key={s} className={`rounded-xl border px-3 py-2 text-sm flex justify-between items-center cursor-pointer ${i===0?"border-purple-600/50 bg-purple-600/15 text-purple-300":"border-white/8 text-white/40"}`}>
                  <span>{s}</span>
                  {i===0 && <span className="text-purple-400 text-xs">✓</span>}
                </div>
              ))}
            </div>
          </div>

          {/* City — shown after state selected */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">City <span className="text-purple-400 normal-case tracking-normal">(Arizona)</span></p>
            <div className="space-y-1.5">
              {AZ_CITIES.map((c,i) => (
                <div key={c} className={`rounded-xl border px-3 py-2 text-sm flex justify-between items-center cursor-pointer ${i===0?"border-purple-600/50 bg-purple-600/15 text-purple-300":"border-white/8 text-white/40"}`}>
                  <span>{c}</span>
                  {i===0 && <span className="text-purple-400 text-xs">✓</span>}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 p-5">
          {/* Filter breadcrumb */}
          <div className="flex items-center gap-2 mb-4 text-sm">
            <span className="text-white/40">Showing</span>
            <span className="rounded-full bg-purple-600/20 border border-purple-500/40 text-purple-300 px-3 py-1 text-xs">Arizona</span>
            <span className="text-white/30">›</span>
            <span className="rounded-full bg-purple-600/20 border border-purple-500/40 text-purple-300 px-3 py-1 text-xs">All Cities</span>
            <span className="text-white/30 ml-2 text-xs">3 events found</span>
          </div>

          {/* Map mockup */}
          <div className="rounded-2xl border border-white/8 bg-black/40 h-44 mb-4 overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Arizona map silhouette (simplified) */}
              <svg viewBox="0 0 200 220" width="160" className="opacity-30">
                <path d="M30 10 L170 10 L170 130 L140 130 L140 210 L30 210 Z" fill="none" stroke="#a78bfa" strokeWidth="2"/>
              </svg>
            </div>
            {/* Map pins */}
            {[{x:"42%",y:"45%",label:"Tempe"},{x:"38%",y:"38%",label:"Phoenix"},{x:"55%",y:"32%",label:"Scottsdale"}].map(p=>(
              <div key={p.label} className="absolute flex flex-col items-center" style={{left:p.x,top:p.y}}>
                <div className="w-3 h-3 rounded-full bg-purple-500 border-2 border-white shadow-lg shadow-purple-900/60" />
                <span className="text-xs text-white/60 mt-1 whitespace-nowrap">{p.label}</span>
              </div>
            ))}
            <div className="absolute top-3 left-3 text-xs text-white/30">OpenStreetMap · Arizona, USA</div>
          </div>

          {/* Events */}
          <div className="grid grid-cols-3 gap-3">
            {EVENTS.map(ev=>(
              <div key={ev.title} className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="rounded-full border px-2 py-0.5 text-xs"
                    style={{ color:ev.color, borderColor:ev.color+"44", background:ev.color+"14" }}>
                    {ev.type}
                  </span>
                  <span className="text-xs text-white/35">{ev.date}</span>
                </div>
                <div className="font-semibold text-sm leading-snug">{ev.title}</div>
                <div className="text-xs text-white/40 mt-1">{ev.city}, AZ</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-purple-400 font-bold text-sm">{ev.price}</span>
                  <span className="rounded-full bg-purple-600 px-3 py-1 text-xs text-white">Book Now</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Callout */}
      <div className="absolute bottom-6 right-6 rounded-2xl bg-purple-600/20 border border-purple-500/30 px-5 py-3 text-sm text-purple-300 backdrop-blur-sm">
        🗺 15 US States · State → City cascade filter
      </div>
    </div>
  );
}
