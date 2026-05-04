"use client";

import { FormEvent, useMemo, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type Props = {
  pageContext: string;
};

export default function ChatBot({ pageContext }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi, I can help you find events, compare tickets, or answer booking questions.",
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
      const response = await fetch("/api/chat", {
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
        { role: "assistant", content: data.reply },
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
      .flatMap((line) => {
        return line
          .split(/(?=\s*\d+\.\s)/g)
          .map((part) => part.trim())
          .filter(Boolean);
      });
  }

  return (
    <div className="fixed bottom-5 right-5 z-[70]">
      {open && (
        <div className="mb-4 flex h-[520px] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-white">ZITIKS Assistant</h2>
              <p className="text-xs text-white/45">Ask about events and booking</p>
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
                    ? "ml-8 bg-[#f5d27a] text-black"
                    : "mr-8 border border-white/10 bg-white/[0.04] text-white/75"
                  }`}
              >
                <div className="space-y-2">
                  {formatMessage(message.content).map((line, lineIndex) => (
                    <p key={lineIndex}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div className="mr-8 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/45">
                Thinking...
              </div>
            )}
          </div>

          {error && (
            <p className="border-t border-red-400/20 bg-red-400/10 px-4 py-2 text-xs text-red-200">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="border-t border-white/10 p-3">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                id="chat-message"
                name="chat-message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about events..."
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#f5d27a]/50"
              />
              <button
                type="submit"
                disabled={loading || input.trim().length === 0}
                className="rounded-full bg-[#f5d27a] px-5 py-3 text-sm font-semibold text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
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
        aria-label={open ? "Hide ZITIKS chat" : "Open ZITIKS chat"}
        className="grid h-14 w-14 place-items-center rounded-full bg-[#f5d27a] text-2xl font-semibold text-black shadow-2xl transition hover:bg-white"
      >
        {open ? "×" : "?"}
      </button>
    </div>
  );
}
