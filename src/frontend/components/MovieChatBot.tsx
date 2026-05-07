"use client";

import { FormEvent, useRef, useMemo, useState } from "react";
import type { Movie } from "@/lib/movies";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  movies?: Movie[];
};

const genreColors: Record<string, { bg: string; text: string }> = {
  "Action":    { bg: "#fb923c", text: "#000" },
  "Sci-Fi":    { bg: "#67e8f9", text: "#000" },
  "Drama":     { bg: "#fcd34d", text: "#000" },
  "Comedy":    { bg: "#86efac", text: "#000" },
  "Thriller":  { bg: "#f87171", text: "#fff" },
  "Adventure": { bg: "#a5f3fc", text: "#000" },
  "Crime":     { bg: "#d4d4d8", text: "#000" },
  "History":   { bg: "#fef08a", text: "#000" },
  "Romance":   { bg: "#fca5a5", text: "#000" },
};
const defaultMovieColor = { bg: "#c4b5fd", text: "#000" };

function MovieCardScroller({ movies }: { movies: Movie[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: -1 | 1) {
    scrollRef.current?.scrollBy({ left: dir * 160, behavior: "smooth" });
  }

  return (
    <div className="mt-3 flex items-center gap-1.5 -mx-1">
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Scroll left"
        className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 border border-white/15 text-white/70 hover:bg-white/20 hover:text-white transition flex items-center justify-center text-base leading-none"
      >
        ‹
      </button>

      <div
        ref={scrollRef}
        className="flex flex-1 gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {movies.map((movie) => {
          const firstGenre = movie.genre[0] ?? "";
          const color = genreColors[firstGenre] ?? defaultMovieColor;
          return (
            <div
              key={movie.id}
              className="flex-shrink-0 w-[148px] rounded-xl border border-white/10 bg-black/50 overflow-hidden"
            >
              <div className="px-3 pt-3 pb-2">
                <span
                  className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1.5"
                  style={{ background: color.bg, color: color.text }}
                >
                  {firstGenre}
                </span>
                <p className="text-xs font-semibold text-white leading-snug line-clamp-2">
                  {movie.title}
                </p>
                <p className="text-[10px] text-white/45 mt-1 truncate">{movie.theater}</p>
                <p className="text-[10px] text-white/35 truncate">{movie.city}, {movie.state}</p>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 px-3 py-2">
                <div>
                  <p className="text-[10px] text-white/40">{movie.rating} · {movie.duration}</p>
                  <p className="text-xs font-bold text-white/80">{movie.price}</p>
                </div>
                <a
                  href={`/movies/${movie.id}`}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-full transition hover:opacity-80"
                  style={{ background: color.bg, color: color.text }}
                >
                  Book
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Scroll right"
        className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 border border-white/15 text-white/70 hover:bg-white/20 hover:text-white transition flex items-center justify-center text-base leading-none"
      >
        ›
      </button>
    </div>
  );
}

type Props = {
  pageContext: string;
};

export default function MovieChatBot({ pageContext }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi, I can help you find movies, check showtimes, or answer booking questions.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const visibleMessages = useMemo(() => messages.slice(-10), [messages]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const question = input.trim();
    if (!question || loading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: question },
    ];

    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/movie-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          pageContext,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Chat request failed");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.reply, movies: data.movies },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chat request failed");
    } finally {
      setLoading(false);
    }
  }

  function openChat() {
    setOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 50);
  }

  function formatMessage(content: string) {
    return content
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  return (
    <div className="fixed bottom-5 right-5 z-[70]">
      {open && (
        <div className="mb-4 flex h-[520px] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl border border-purple-500/20 bg-neutral-950 shadow-2xl">
          <div className="flex items-center justify-between border-b border-purple-500/20 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-white">ZITIKS Movies</h2>
              <p className="text-xs text-white/45">Ask about movies and showtimes</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-lg leading-none text-white/60 transition hover:bg-white hover:text-black"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {visibleMessages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "ml-8 bg-purple-600 text-white"
                    : "mr-8 border border-purple-500/20 bg-purple-500/[0.06] text-white/75"
                }`}
              >
                <div className="space-y-2">
                  {formatMessage(message.content).map((line, lineIndex) => (
                    <p key={lineIndex}>{line}</p>
                  ))}
                </div>
                {message.movies && message.movies.length > 0 && (
                  <MovieCardScroller movies={message.movies} />
                )}
              </div>
            ))}
            {loading && (
              <div className="mr-8 rounded-2xl border border-purple-500/20 bg-purple-500/[0.06] px-4 py-3 text-sm text-white/45">
                Thinking...
              </div>
            )}
          </div>

          {error && (
            <p className="border-t border-red-400/20 bg-red-400/10 px-4 py-2 text-xs text-red-200">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="border-t border-purple-500/20 p-3">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                id="movie-chat-message"
                name="movie-chat-message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about movies..."
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-purple-500/50"
              />
              <button
                type="submit"
                disabled={loading || input.trim().length === 0}
                className="rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={open ? () => setOpen(false) : openChat}
        aria-label={open ? "Hide movies chat" : "Open movies chat"}
        className="grid h-14 w-14 place-items-center rounded-full bg-white shadow-2xl transition hover:bg-purple-50 border-2 border-purple-400"
      >
        {open ? (
          <span className="text-2xl font-semibold leading-none text-purple-600">&times;</span>
        ) : (
          <svg className="h-7 w-7 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </div>
  );
}
