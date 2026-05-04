import Link from "next/link";

export default function CreateEventPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-8 py-8 text-white">
      <nav className="mb-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          ZITIKS
        </Link>
        <Link href="/book" className="text-sm text-white/60 transition hover:text-white">
          Back to Browse
        </Link>
      </nav>

      <section className="mx-auto max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#f5d27a]/60">
          Organizer
        </p>
        <h1 className="text-5xl font-bold md:text-6xl">Create Event</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/55">
          Event creation is ready for the interface layer. Connect this form to the API or blockchain
          registry when organizer publishing is enabled.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="grid gap-5">
            {["Event title", "Venue", "City", "Date", "Price"].map((label) => (
              <label key={label} className="block">
                <span className="mb-2 block text-sm text-white/60">{label}</span>
                <input
                  name={label.toLowerCase().replaceAll(" ", "-")}
                  placeholder={label}
                  className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-[#f5d27a]/50"
                />
              </label>
            ))}

            <label className="block">
              <span className="mb-2 block text-sm text-white/60">Category</span>
              <select
                name="category"
                className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none focus:border-[#f5d27a]/50"
              >
                <option className="bg-neutral-950">Concert</option>
                <option className="bg-neutral-950">Conference</option>
                <option className="bg-neutral-950">Shows</option>
                <option className="bg-neutral-950">Workshop</option>
              </select>
            </label>

            <button
              type="button"
              className="mt-3 rounded-full bg-[#f5d27a] px-6 py-3 font-semibold text-black transition hover:bg-white"
            >
              Save Draft
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
