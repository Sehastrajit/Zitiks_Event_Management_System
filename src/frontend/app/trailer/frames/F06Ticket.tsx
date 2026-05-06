export default function F06Ticket() {
  return (
    <div className="h-full w-full flex items-center justify-center text-white relative"
      style={{ background: "radial-gradient(circle at center,#6d28d9,#050008 65%)" }}>

      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-lg mx-4 space-y-4">

        {/* Success modal */}
        <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-black mb-1">You&apos;re in!</h2>
          <p className="text-gray-500 text-sm mb-6">Your ticket is confirmed. Check your email and phone.</p>

          {/* Ticket card */}
          <div className="rounded-2xl overflow-hidden border border-purple-200 mb-6">
            <div className="bg-purple-600 px-6 py-4 text-left">
              <div className="text-xs text-purple-200 uppercase tracking-widest mb-1">E-Ticket</div>
              <div className="text-lg font-bold text-white">Desert Night Concert</div>
              <div className="text-purple-200 text-sm">Tempe Beach Park · Tempe, AZ · May 12, 2025</div>
            </div>
            <div className="bg-white px-6 py-4 flex items-center justify-between">
              <div className="text-left">
                <div className="text-xs text-gray-400 mb-0.5">Guest</div>
                <div className="font-semibold text-black text-sm">Alex Johnson</div>
                <div className="text-xs text-gray-400 mt-1">alex@example.com</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400 mb-0.5">Ticket ID</div>
                <div className="font-mono font-bold text-purple-600 text-sm tracking-wide">TKT-A7B3C91F</div>
                <div className="text-xs text-green-600 font-semibold mt-1">✓ Verified</div>
              </div>
            </div>
            {/* Perforation */}
            <div className="relative h-px bg-gray-200 mx-4">
              <div className="absolute -left-5 -top-2 w-4 h-4 rounded-full bg-purple-50 border border-purple-200" />
              <div className="absolute -right-5 -top-2 w-4 h-4 rounded-full bg-purple-50 border border-purple-200" />
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-center">
              {/* Barcode mockup */}
              <div className="flex gap-px items-end h-10">
                {Array.from({length:40},(_,i)=>(
                  <div key={i} style={{width:2,height:Math.random()>0.4?40:24,background:"#1f2937",opacity:0.8}} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 text-xs text-gray-400 justify-center">
            <span className="flex items-center gap-1"><span>📧</span> Sent to alex@example.com</span>
            <span>·</span>
            <span className="flex items-center gap-1"><span>📱</span> SMS sent</span>
          </div>
        </div>

        {/* Email preview strip */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-4">
          <div className="text-xs text-white/40 uppercase tracking-widest mb-2">Email Preview</div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold shrink-0">Z</div>
            <div>
              <div className="text-sm font-semibold">Your ticket for Desert Night Concert</div>
              <div className="text-xs text-white/40">From: tickets@zitiks.com · To: alex@example.com</div>
              <div className="text-xs text-white/50 mt-1 line-clamp-2">Hi Alex! Your ticket is confirmed. Ticket ID: TKT-A7B3C91F. Show this at the gate. See you there!</div>
            </div>
          </div>
        </div>
      </div>

      {/* Callout */}
      <div className="absolute bottom-8 right-8 rounded-2xl bg-green-600/20 border border-green-500/30 px-5 py-3 text-sm text-green-300 backdrop-blur-sm">
        ✓ Instant delivery · Email + SMS · No account
      </div>
    </div>
  );
}
