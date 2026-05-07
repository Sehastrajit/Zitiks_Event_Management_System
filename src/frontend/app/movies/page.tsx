"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { movies } from "@/lib/movies";
import { US_STATES, STATE_CODES } from "@/lib/us-locations";
import Footer from "@/components/Footer";
import MovieChatBot from "@/components/MovieChatBot";

const ALL_GENRES = ["All", ...Array.from(new Set(movies.flatMap((m) => m.genre))).sort()];
const ALL_RATINGS = ["All", "PG-13", "R", "PG", "NR"];

function TrailerCard({ movie }: { movie: (typeof movies)[number] }) {
  const [hovered, setHovered] = useState(false);

  const thumbUrl = `https://img.youtube.com/vi/${movie.trailerYoutubeId}/maxresdefault.jpg`;

  return (
    <Link
      href={`/movies/${movie.id}`}
      className="group block rounded-3xl border border-white/10 bg-white/[0.04] overflow-hidden transition hover:-translate-y-1 hover:border-purple-600/40 hover:shadow-2xl hover:shadow-purple-900/30"
    >
      <div
        className="relative aspect-video w-full overflow-hidden bg-neutral-900"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {hovered ? (
          <iframe
            className="absolute inset-0 h-full w-full pointer-events-none"
            src={`https://www.youtube.com/embed/${movie.trailerYoutubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${movie.trailerYoutubeId}&rel=0&modestbranding=1`}
            allow="autoplay; encrypted-media"
            title={`${movie.title} trailer`}
          />
        ) : (
          <img
            src={thumbUrl}
            alt={movie.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {!hovered && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <svg className="ml-1 h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className="rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white/80 border border-white/10">
            {movie.rating}
          </span>
          <span className="rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white/80 border border-white/10">
            {movie.duration}
          </span>
        </div>

        {hovered && (
          <div className="absolute top-3 right-3">
            <span className="rounded-full bg-red-600/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-white flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              Trailer
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {movie.genre.map((g) => (
            <span key={g} className="rounded-full bg-purple-600/15 border border-purple-600/25 px-2.5 py-0.5 text-xs text-purple-400">
              {g}
            </span>
          ))}
        </div>

        <h2 className="text-xl font-bold leading-snug">{movie.title}</h2>
        <p className="mt-1 text-sm text-white/45">{movie.year} &middot; {movie.director}</p>

        <p className="mt-3 text-sm text-white/55 line-clamp-2 leading-relaxed">
          {movie.description}
        </p>

        <div className="mt-4 pt-4 border-t border-white/8 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/35">{movie.theater}</p>
            <p className="text-xs text-white/35">{movie.city}, {movie.state}</p>
          </div>
          <span className="text-lg font-bold text-purple-400">{movie.price}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {movie.showtimes.slice(0, 3).map((st) => (
            <span
              key={st.time}
              className={`rounded-xl border px-3 py-1 text-xs font-medium transition ${
                st.available
                  ? "border-white/15 bg-white/[0.04] text-white/70"
                  : "border-white/6 bg-white/[0.02] text-white/25 line-through"
              }`}
            >
              {st.time}
            </span>
          ))}
          {movie.showtimes.length > 3 && (
            <span className="rounded-xl border border-white/10 px-3 py-1 text-xs text-white/35">
              +{movie.showtimes.length - 3} more
            </span>
          )}
        </div>

        <div className="mt-4">
          <span className="block w-full rounded-full bg-purple-600 px-5 py-2.5 text-center text-sm font-semibold text-white transition group-hover:bg-purple-700">
            Book Tickets
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function MoviesPage() {
  const [selectedState, setSelectedState] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedRating, setSelectedRating] = useState("All");
  const [search, setSearch] = useState("");

  const citiesForState = useMemo(() => {
    if (selectedState === "All") return [];
    return US_STATES[selectedState]?.cities ?? [];
  }, [selectedState]);

  const filtered = useMemo(() => {
    return movies.filter((m) => {
      const matchState = selectedState === "All" || m.state === selectedState;
      const matchCity  = selectedCity === "All"  || m.city === selectedCity;
      const matchGenre = selectedGenre === "All" || m.genre.includes(selectedGenre);
      const matchRating = selectedRating === "All" || m.rating === selectedRating;
      const s = search.toLowerCase();
      const matchSearch =
        !s ||
        m.title.toLowerCase().includes(s) ||
        m.director.toLowerCase().includes(s) ||
        m.genre.some((g) => g.toLowerCase().includes(s));
      return matchState && matchCity && matchGenre && matchRating && matchSearch;
    });
  }, [selectedState, selectedCity, selectedGenre, selectedRating, search]);

  function handleStateChange(state: string) {
    setSelectedState(state);
    setSelectedCity("All");
  }

  return (
    <>
      <main
        className="min-h-screen text-white"
        style={{ background: "radial-gradient(circle_at_center,#6d28d9,#050008_65%)" }}
      >
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-white/10 px-8 py-5 backdrop-blur">
          <div className="flex w-full items-center justify-between">
            <Link href="/" className="text-2xl font-bold">ZITIKS</Link>
            <div className="flex items-center gap-6">
              <Link href="/book"   className="text-sm text-white/70 hover:text-white">Events</Link>
              <Link href="/movies" className="text-sm text-purple-400">Movies</Link>
              <Link href="/about"  className="text-sm text-white/70 hover:text-white">About</Link>
            </div>
          </div>
        </nav>

        <section className="w-full px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-purple-400/70 mb-2">Now Showing</p>
            <h1 className="text-4xl font-bold md:text-5xl">Movies & Shows</h1>
            <p className="mt-2 text-white/50">Hover over any card to watch the trailer. Book tickets instantly — no account needed.</p>
          </div>

          <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movies, directors, genres..."
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none placeholder:text-white/35 focus:border-purple-600/50"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {ALL_GENRES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelectedGenre(g)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    selectedGenre === g
                      ? "bg-purple-600 text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl lg:sticky lg:top-28">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Location</h2>
                <button
                  type="button"
                  onClick={() => { setSelectedState("All"); setSelectedCity("All"); setSelectedRating("All"); }}
                  className="text-sm text-white/40 hover:text-white transition"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/70">State</span>
                  <select
                    value={selectedState}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-purple-600/50"
                  >
                    <option value="All" className="bg-neutral-950">All States</option>
                    {STATE_CODES.map((code) => (
                      <option key={code} value={code} className="bg-neutral-950">
                        {US_STATES[code].name}
                      </option>
                    ))}
                  </select>
                </label>

                {selectedState !== "All" && (
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-white/70">City</span>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-purple-600/50"
                    >
                      <option value="All" className="bg-neutral-950">All Cities</option>
                      {citiesForState.map((c) => (
                        <option key={c} value={c} className="bg-neutral-950">{c}</option>
                      ))}
                    </select>
                  </label>
                )}

                <div>
                  <p className="mb-2 text-sm font-medium text-white/70">Rating</p>
                  <div className="grid gap-2">
                    {ALL_RATINGS.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setSelectedRating(r)}
                        className={`rounded-2xl border px-4 py-2.5 text-left text-sm transition ${
                          selectedRating === r
                            ? "border-purple-600/60 bg-purple-600/15 text-purple-400"
                            : "border-white/10 bg-black/25 text-white/60 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {r === "All" ? "All Ratings" : r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <div>
              {filtered.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
                  <h2 className="text-2xl font-semibold">No movies found</h2>
                  <p className="mt-2 text-white/50">Try a different filter or state.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((movie) => (
                    <TrailerCard key={movie.id} movie={movie} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MovieChatBot pageContext="Movies browse page with filters for state, city, genre, and rating. Users can search movies, check showtimes, and book tickets." />
    </>
  );
}
