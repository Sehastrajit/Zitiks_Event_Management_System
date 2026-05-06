export default function F05Payment() {
  return (
    <div className="h-full w-full flex items-center justify-center text-white relative"
      style={{ background: "radial-gradient(circle at center,#6d28d9,#050008 65%)" }}>

      {/* Blurred bg */}
      <div className="absolute inset-0 flex flex-col opacity-15 pointer-events-none px-16 pt-16">
        <div className="text-4xl font-black mb-2">Desert Night Concert</div>
        <div className="text-lg text-white/50">Step 1 complete — Guest Details</div>
      </div>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Step indicator */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          {["① Guest Details","② Payment","③ Ticket"].map((s,i) => (
            <div key={s} className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${i===1?"bg-purple-600 text-white":i===0?"bg-green-600/80 text-white":"bg-gray-100 text-gray-400"}`}>{s}</span>
              {i<2 && <span className="text-gray-500 text-xs">›</span>}
            </div>
          ))}
        </div>

        <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-black mb-1">Complete Payment</h2>
          <p className="text-sm text-gray-500 mb-5">Desert Night Concert — <span className="font-semibold text-black">$35.00</span></p>

          {/* Apple Pay / Google Pay */}
          <div className="space-y-2.5 mb-5">
            <button className="w-full rounded-2xl bg-black text-white py-3.5 text-sm font-semibold flex items-center justify-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.32.06 2.23.72 3.02.73.95.01 2.25-.76 3.76-.64 1.37.11 2.59.63 3.5 1.73-3.01 1.94-2.5 5.7.44 7.04-.51 1.17-1.15 2.34-2.72 4zM12.03 7.25c-.19-2.74 2.18-5.02 4.76-5.25.3 2.93-2.56 5.25-4.76 5.25z"/></svg>
              Pay with Apple Pay
            </button>
            <button className="w-full rounded-2xl border border-gray-300 py-3.5 text-sm font-semibold text-gray-700 flex items-center justify-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Pay with Google Pay
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or pay with card</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Card fields mockup */}
          <div className="space-y-3 mb-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Card Number</label>
              <div className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 flex justify-between items-center bg-gray-50">
                <span>4242 4242 4242 4242</span>
                <span className="text-gray-400 text-xs">VISA</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Expiry</label>
                <div className="rounded-xl border border-purple-500 px-4 py-3 text-sm text-gray-800 bg-white ring-2 ring-purple-500/10">12 / 28</div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">CVC</label>
                <div className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-400 bg-gray-50">•••</div>
              </div>
            </div>
          </div>

          <button className="w-full rounded-full bg-purple-600 py-3.5 text-sm font-bold text-white">
            Pay $35.00 →
          </button>

          <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
            <span>🔒</span> Secured by Stripe · PCI DSS Compliant
          </p>
        </div>
      </div>

      {/* Callout */}
      <div className="absolute bottom-8 left-8 rounded-2xl bg-purple-600/20 border border-purple-500/30 px-5 py-3 text-sm text-purple-300 backdrop-blur-sm">
        💳 Apple Pay · Google Pay · Card — all in one modal
      </div>
    </div>
  );
}
