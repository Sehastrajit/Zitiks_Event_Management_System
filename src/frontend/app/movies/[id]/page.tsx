import Link from "next/link";
import { notFound } from "next/navigation";
import { getMovieById } from "@/lib/movies";
import MovieBookingButton from "./MovieBookingButton";
import Footer from "@/components/Footer";

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = getMovieById(Number(id));
  if (!movie) notFound();

  const thumbUrl = `https://img.youtube.com/vi/${movie.trailerYoutubeId}/maxresdefault.jpg`;

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
              <Link href="/movies" className="text-sm text-white/70 hover:text-white">← All Movies</Link>
              <Link href="/book" className="text-sm text-white/70 hover:text-white">Events</Link>
            </div>
          </div>
        </nav>

        <section className="px-6 pt-10 pb-0 md:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genre.map((g) => (
                <span key={g} className="rounded-full border border-purple-600/30 bg-purple-600/10 px-3 py-1 text-sm text-purple-400">
                  {g}
                </span>
              ))}
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/60">{movie.rating}</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/60">{movie.duration}</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/60">{movie.year}</span>
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">{movie.title}</h1>
            <p className="mt-4 text-lg text-white/50">Directed by {movie.director}</p>
            <p className="mt-1 text-white/50">📍 {movie.theater} &middot; {movie.city}, {movie.state}</p>

            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-white/65">{movie.description}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <MovieBookingButton
                movieId={movie.id}
                movieTitle={movie.title}
                moviePrice={movie.price}
                showtimes={movie.showtimes}
              />
              <Link href="/movies" className="rounded-full border border-white/15 px-8 py-3 font-semibold text-white transition hover:bg-purple-600">
                Browse Movies
              </Link>
            </div>
          </div>
        </section>

        <section className="px-6 py-12 md:px-12">
          <div className="mx-auto max-w-6xl">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-purple-400/60">Official Trailer</p>
            <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-black">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${movie.trailerYoutubeId}?rel=0&modestbranding=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${movie.title} — Official Trailer`}
              />
            </div>
          </div>
        </section>

        <section className="px-6 py-12 md:px-12">
          <div className="mx-auto max-w-6xl">
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-purple-400/60">Showtimes</p>
            <h2 className="mb-8 text-3xl font-bold">Select a Showtime</h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {movie.showtimes.map((st) => (
                <div
                  key={st.time}
                  className={`rounded-3xl border p-6 transition ${
                    st.available
                      ? "border-white/10 bg-white/[0.04] hover:border-purple-600/40 hover:bg-white/[0.07]"
                      : "border-white/5 bg-white/[0.02] opacity-40"
                  }`}
                >
                  <p className="text-2xl font-bold">{st.time}</p>
                  <p className="mt-1 text-sm text-purple-400">{st.format}</p>
                  <p className="mt-4 text-lg font-semibold text-white">{movie.price}</p>
                  {st.available ? (
                    <div className="mt-4">
                      <MovieBookingButton
                        movieId={movie.id}
                        movieTitle={movie.title}
                        moviePrice={movie.price}
                        showtimes={movie.showtimes}
                      />
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-white/30">Sold Out</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
