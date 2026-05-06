export default function F08Create() {
  return (
    <div className="h-full w-full text-white overflow-hidden"
      style={{ background: "radial-gradient(circle at center,#6d28d9,#050008 65%)" }}>

      {/* Nav */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-white/8">
        <span className="text-xl font-bold">ZITIKS</span>
        <div className="flex gap-4 text-sm text-white/50">
          <span className="text-purple-400">Create Event</span>
        </div>
      </div>

      <div className="flex h-[calc(100%-57px)] items-start gap-6 px-8 pt-8">

        {/* Form */}
        <div className="flex-1 max-w-lg">
          <h2 className="text-2xl font-bold mb-1">Create New Event</h2>
          <p className="text-white/40 text-sm mb-6">Submitted directly to your Airtable base</p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-widest">Event Title</label>
              <div className="w-full rounded-2xl border border-purple-500/50 bg-white/5 px-4 py-3 text-white text-sm ring-2 ring-purple-500/10">
                Summer Jazz Nights
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-widest">Category</label>
                <div className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white text-sm flex justify-between">
                  <span>Concert</span><span className="text-white/30">▾</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-widest">Price ($)</label>
                <div className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white text-sm flex gap-2">
                  <span className="text-white/40">$</span><span>45</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-widest">Venue</label>
              <div className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white text-sm">
                Tempe Beach Park
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-widest">City</label>
                <div className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white text-sm">
                  Tempe, AZ
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-widest">Date & Time</label>
                <div className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white text-sm">
                  Jun 14 · 7:00 PM
                </div>
              </div>
            </div>

            <button className="w-full rounded-full bg-purple-600 py-3.5 text-sm font-bold text-white mt-2">
              Publish to Airtable →
            </button>
          </div>
        </div>

        {/* Airtable connection panel */}
        <div className="w-72 shrink-0 space-y-4">
          {/* Connection card */}
          <div className="rounded-2xl border border-green-500/30 bg-green-600/10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-300 text-sm font-semibold">Airtable Connected</span>
            </div>
            <div className="text-xs text-white/50 space-y-1">
              <div className="flex justify-between"><span>Base</span><span className="text-white/70">Zitiks Events</span></div>
              <div className="flex justify-between"><span>Table</span><span className="text-white/70">Events</span></div>
              <div className="flex justify-between"><span>Records</span><span className="text-white/70">47 events</span></div>
            </div>
          </div>

          {/* Field mapping */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-white/40 uppercase tracking-widest mb-3">Field Mapping</div>
            {[
              ["Event Title","text"],
              ["Category","single select"],
              ["Price","number"],
              ["Venue","text"],
              ["City","text"],
              ["Date","date"],
            ].map(([field,type])=>(
              <div key={field} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                <span className="text-sm text-white/80">{field}</span>
                <span className="text-xs text-purple-400 bg-purple-600/10 px-2 py-0.5 rounded-full">{type}</span>
              </div>
            ))}
          </div>

          {/* API call preview */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4 font-mono text-xs text-white/50">
            <div className="text-purple-400 mb-1">POST /api/create-event</div>
            <div className="text-white/30">→ Airtable REST API</div>
            <div className="text-white/30">→ appNhBL4aHe7HTv7t</div>
            <div className="text-green-400 mt-2">200 OK · record created</div>
          </div>
        </div>
      </div>

      {/* Callout */}
      <div className="absolute bottom-6 left-8 rounded-2xl bg-purple-600/20 border border-purple-500/30 px-5 py-3 text-sm text-purple-300 backdrop-blur-sm">
        📊 Events auto-sync to Airtable · Use as your CMS
      </div>
    </div>
  );
}
