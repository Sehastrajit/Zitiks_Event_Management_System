const STACK = [
  {
    layer: "Frontend",
    color: "#818cf8",
    border: "#818cf844",
    bg: "#818cf810",
    items: [
      { name:"Next.js 16", desc:"App Router · RSC · SSR" },
      { name:"Tailwind CSS", desc:"Utility-first styling" },
      { name:"TypeScript", desc:"End-to-end types" },
    ],
  },
  {
    layer: "Payments",
    color: "#34d399",
    border: "#34d39944",
    bg: "#34d39910",
    items: [
      { name:"Stripe PaymentElement", desc:"Apple Pay · Google Pay · Card" },
      { name:"Guest Checkout", desc:"No account required" },
      { name:"Stripe Webhooks", desc:"Async confirmation" },
    ],
  },
  {
    layer: "Notifications",
    color: "#f472b6",
    border: "#f472b644",
    bg: "#f472b610",
    items: [
      { name:"Nodemailer SMTP", desc:"Gmail · Branded HTML tickets" },
      { name:"Twilio SMS", desc:"Instant ticket delivery" },
    ],
  },
  {
    layer: "Data & CMS",
    color: "#fbbf24",
    border: "#fbbf2444",
    bg: "#fbbf2410",
    items: [
      { name:"Airtable", desc:"Events CMS · REST API" },
      { name:"OpenStreetMap", desc:"Venue maps · No API key" },
    ],
  },
  {
    layer: "AI & Media",
    color: "#a78bfa",
    border: "#a78bfa44",
    bg: "#a78bfa10",
    items: [
      { name:"Groq AI Chat", desc:"Llama 3.3 · Event assistant" },
      { name:"YouTube Embed", desc:"Hover-to-play trailers" },
    ],
  },
  {
    layer: "Optional",
    color: "#94a3b8",
    border: "#94a3b844",
    bg: "#94a3b810",
    items: [
      { name:"Solidity NFT Tickets", desc:"On-chain verification" },
      { name:"Python Backend", desc:"Blockchain bridge" },
    ],
  },
];

export default function F09Stack() {
  return (
    <div className="h-full w-full text-white overflow-hidden"
      style={{ background: "radial-gradient(circle at center,#6d28d9,#050008 65%)" }}>

      {/* Header */}
      <div className="px-8 pt-8 pb-5 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-purple-400/60 mb-2">Open Source · MIT License</p>
        <h2 className="text-4xl font-black mb-2">Built With Modern Stack</h2>
        <p className="text-white/40 text-sm">Everything you need to run a production ticketing platform</p>
      </div>

      {/* Stack grid */}
      <div className="px-8 grid grid-cols-3 gap-4">
        {STACK.map(section => (
          <div key={section.layer}
            className="rounded-2xl border p-4"
            style={{ borderColor: section.border, background: section.bg }}>
            <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: section.color }}>
              {section.layer}
            </div>
            <div className="space-y-2">
              {section.items.map(item => (
                <div key={item.name} className="flex flex-col">
                  <span className="text-sm font-semibold text-white">{item.name}</span>
                  <span className="text-xs text-white/40">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom badges */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {["⭐ MIT License","🚀 Production Ready","🔓 No Vendor Lock-in","📦 Self-hostable"].map(b=>(
          <span key={b} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/60 backdrop-blur-sm">
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}
