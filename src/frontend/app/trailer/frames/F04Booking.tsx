export default function F04Booking() {
  return (
    <div className="h-full w-full flex items-center justify-center text-white relative"
      style={{ background: "radial-gradient(circle at center,#6d28d9,#050008 65%)" }}>

      {/* Blurred background event page */}
      <div className="absolute inset-0 flex flex-col opacity-20 pointer-events-none px-16 pt-16">
        <div className="text-5xl font-black mb-2">Desert Night Concert</div>
        <div className="text-xl text-white/60">Tempe Beach Park · Tempe, AZ · May 12</div>
        <div className="text-4xl text-purple-400 font-bold mt-4">$35</div>
      </div>

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-gray-200 bg-white p-8 shadow-2xl mx-4">

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {["① Guest Details","② Payment","③ Ticket"].map((s,i) => (
            <div key={s} className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${i===0?"bg-purple-600 text-white":"bg-gray-100 text-gray-400"}`}>{s}</span>
              {i<2 && <span className="text-gray-200 text-xs">›</span>}
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-black mb-1">Get your ticket</h2>
        <p className="text-sm text-gray-500 mb-6">Desert Night Concert — $35 · <span className="text-purple-600 font-medium">No account needed</span></p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Full Name</label>
            <div className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-black text-sm bg-gray-50">Alex Johnson</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
            <div className="w-full rounded-2xl border border-purple-500 px-4 py-3 text-black text-sm bg-white ring-2 ring-purple-500/10">alex@example.com</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
            <div className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-400 text-sm bg-gray-50">+1 555 123 4567</div>
            <p className="text-xs text-gray-400 mt-1.5">Enter email, phone, or both — your ticket will be sent there.</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="flex-1 rounded-full border border-gray-300 py-3 text-sm font-semibold text-black">Cancel</button>
          <button className="flex-1 rounded-full bg-purple-600 py-3 text-sm font-semibold text-white">Continue to Payment →</button>
        </div>
      </div>

      {/* Callout */}
      <div className="absolute bottom-8 right-8 rounded-2xl bg-purple-600/20 border border-purple-500/30 px-5 py-3 text-sm text-purple-300 backdrop-blur-sm">
        ✦ No account · No registration · Instant tickets
      </div>
    </div>
  );
}
