export default function Page() {
  const events = [
    { title: "Sunburn Arena", date: "24 MAY", price: "₹999" },
    { title: "EDM Night", date: "25 MAY", price: "₹799" },
    { title: "Stand-up Comedy", date: "26 MAY", price: "₹499" },
  ];

  return (
    <main className="min-h-screen bg-white text-black">
      {/* HERO */}
      <section className="bg-[radial-gradient(circle_at_center,#6d28d9,#050008_65%)] text-white rounded-b-3xl px-6 py-12 overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="text-7xl font-black text-purple-400 mb-3">Z</div>
            <h1 className="text-6xl font-black tracking-wide">ZITIKS</h1>
            <p className="text-3xl mt-4">
              Discover Events. <br />
              Book <span className="text-purple-400 font-bold">Instantly.</span>
            </p>
          </div>

          <div className="mx-auto w-64 h-[500px] rounded-[3rem] bg-black border-8 border-zinc-800 shadow-2xl p-6 rotate-6">
            <div className="h-full rounded-[2rem] bg-gradient-to-b from-zinc-950 to-purple-950 flex flex-col items-center justify-center text-center">
              <div className="text-5xl font-black text-purple-400">Z</div>
              <h2 className="text-3xl font-bold">ZITIKS</h2>
              <p className="text-sm mt-4 text-zinc-300">
                Discover Events.
                <br />
                Book Instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BROWSE EVENTS */}
      <Section
        icon="📅"
        title="BROWSE EVENTS"
        text="Explore concerts, nightlife, festivals, workshops, sports and more."
      >
        <div className="phone">
          <div className="flex justify-between mb-6">
            <div>
              <h3 className="font-bold">Z ZITIKS</h3>
              <p className="text-xs text-zinc-400">Mumbai, India</p>
            </div>
            <span>🔍</span>
          </div>

          <p className="text-sm font-semibold mb-3">Featured Events</p>

          <div className="grid grid-cols-3 gap-3">
            {events.map((event) => (
              <div key={event.title} className="rounded-xl bg-zinc-900 overflow-hidden">
                <div className="h-24 bg-gradient-to-br from-purple-500 to-pink-500" />
                <div className="p-2">
                  <h4 className="text-xs font-bold">{event.title}</h4>
                  <p className="text-xs text-zinc-400">{event.date}</p>
                  <p className="text-xs font-bold">{event.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* SEARCH FILTER */}
      <DarkSection
        icon="🔎"
        title="SEARCH & FILTER"
        text="Find exactly what you want by event name, category, date or location."
      >
        <div className="phone">
          <input
            placeholder="Search events, artists, venues..."
            className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm outline-none"
          />

          <div className="flex gap-2 mt-4 text-xs">
            {["All", "Music", "Nightlife", "Sports", "Workshops"].map((item) => (
              <span
                key={item}
                className="rounded-lg bg-zinc-800 px-3 py-2 first:bg-purple-600"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            {["Arijit Singh Live", "Food Festival", "Tech Meetup"].map((item) => (
              <div key={item} className="flex items-center justify-between bg-zinc-900 p-3 rounded-xl">
                <div>
                  <h4 className="text-sm font-semibold">{item}</h4>
                  <p className="text-xs text-zinc-400">20 May · Mumbai</p>
                </div>
                <span>♡</span>
              </div>
            ))}
          </div>
        </div>

        <FeatureList items={["By Category", "By Date", "By Location", "Top Rated"]} />
      </DarkSection>

      {/* MAP VIEW */}
      <Section
        icon="📍"
        title="MAP VIEW"
        text="Discover events around your city in real-time."
      >
        <div className="relative w-full max-w-xl rounded-[2rem] bg-blue-100 p-6 shadow-xl">
          <div className="h-72 rounded-2xl bg-[linear-gradient(135deg,#dbeafe,#f0fdf4)] relative overflow-hidden">
            {[1, 2, 3, 5, 8].map((pin, i) => (
              <div
                key={pin}
                className="absolute bg-purple-600 text-white rounded-full w-9 h-9 flex items-center justify-center font-bold"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${20 + (i % 3) * 22}%`,
                }}
              >
                {pin}
              </div>
            ))}
          </div>

          <div className="absolute right-2 top-20 bg-white rounded-2xl shadow-xl p-4 w-52">
            <div className="h-20 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 mb-3" />
            <h4 className="font-bold text-sm">Live Music Night</h4>
            <p className="text-xs text-zinc-500">Hard Rock Cafe</p>
            <p className="font-bold text-sm mt-1">₹799</p>
          </div>
        </div>
      </Section>

      {/* EVENT DETAILS */}
      <DarkSection
        icon="⭐"
        title="EVENT DETAILS"
        text="All the info you need at a glance. Choose your tickets and book securely."
      >
        <div className="phone">
          <div className="h-40 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 mb-4" />
          <h3 className="text-xl font-bold">Sunburn Arena</h3>
          <p className="text-sm text-zinc-400">Mumbai</p>
          <p className="text-xs mt-2 text-zinc-400">24 May 2024 · 6:00 PM onwards</p>

          <div className="mt-5 bg-zinc-900 rounded-xl p-4 flex justify-between">
            <span>Early Bird</span>
            <strong>₹999</strong>
          </div>
        </div>

        <FeatureList
          items={[
            "Event Info",
            "Venue Details",
            "Date & Time",
            "Ticket Options",
            "Secure Payment",
          ]}
        />
      </DarkSection>

      {/* CONFIRMATION */}
      <Section
        icon="✅"
        title="BOOKING CONFIRMED!"
        text="Your tickets are booked. See you at the event!"
      >
        <div className="phone bg-white text-black">
          <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center text-3xl">
            ✓
          </div>

          <h3 className="text-center text-xl font-bold">Booking Confirmed!</h3>
          <p className="text-center text-sm text-zinc-500 mb-6">
            Your tickets are booked successfully.
          </p>

          <div className="rounded-2xl border p-4 flex gap-4">
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500" />
            <div>
              <h4 className="font-bold">Sunburn Arena</h4>
              <p className="text-sm text-zinc-500">Mumbai</p>
              <p className="text-sm mt-2">24 May 2024 · 6:00 PM</p>
              <p className="font-bold mt-2">2 Tickets · ₹1998</p>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}

function Section({
  icon,
  title,
  text,
  children,
}: {
  icon: string;
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-6 py-12 bg-zinc-50">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[260px_1fr] gap-10 items-center">
        <Intro icon={icon} title={title} text={text} />
        <div className="flex flex-wrap gap-8 justify-center items-center">{children}</div>
      </div>
    </section>
  );
}

function DarkSection({
  icon,
  title,
  text,
  children,
}: {
  icon: string;
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-6 py-12 bg-black text-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[260px_1fr] gap-10 items-center">
        <Intro icon={icon} title={title} text={text} />
        <div className="flex flex-wrap gap-8 justify-center items-center">{children}</div>
      </div>
    </section>
  );
}

function Intro({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div>
      <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-3xl mb-5 shadow-lg">
        {icon}
      </div>
      <h2 className="text-4xl font-black leading-tight">{title}</h2>
      <p className="mt-4 text-lg opacity-80">{text}</p>
    </div>
  );
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <div className="space-y-5">
      {items.map((item) => (
        <div key={item} className="flex items-center gap-3 text-lg">
          <span className="w-9 h-9 rounded-full border border-purple-500 text-purple-400 flex items-center justify-center">
            ✓
          </span>
          {item}
        </div>
      ))}
    </div>
  );
}