import Link from "next/link";

export default function CreateEventPage() {
  return (
    <main className="min-h-screen px-8 py-8 text-white" style={{ background: "radial-gradient(circle_at_center,#6d28d9,#050008_65%)" }}>
      <nav className="mb-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          ZITIKS
        </Link>
        <Link href="/book" className="text-sm text-white/70 transition hover:text-white">
          Back to Browse
        </Link>
      </nav>

      <section className="mx-auto max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-purple-400/60">
          Organizer
        </p>
        <h1 className="text-5xl font-bold md:text-6xl">Create Event</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/50">
          Event creation is ready for the interface layer. Connect this form to the API or blockchain
          registry when organizer publishing is enabled.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="grid gap-5">
            {["Event title", "Venue", "City", "Date", "Price"].map((label) => (
              <label key={label} className="block">
                <span className="mb-2 block text-sm text-white/55">{label}</span>
                <input
                  name={label.toLowerCase().replaceAll(" ", "-")}
                  placeholder={label}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-purple-600/50"
                />
              </label>
            ))}

            <label className="block">
              <span className="mb-2 block text-sm text-white/55">Category</span>
              <select
                name="category"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-purple-600/50"
              >
                <option className="bg-neutral-950">Concert</option>
                <option className="bg-neutral-950">Conference</option>
                <option className="bg-neutral-950">Shows</option>
                <option className="bg-neutral-950">Workshop</option>
              </select>
            </label>

            <button
              type="button"
              className="mt-3 rounded-full bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
            >
              Save Draft
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
