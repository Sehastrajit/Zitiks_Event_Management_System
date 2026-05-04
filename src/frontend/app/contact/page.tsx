"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`ZITIKS enquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );
    window.open(`mailto:sehastrajit@gmail.com?subject=${subject}&body=${body}`);
    setSent(true);
  }

  return (
    <>
      <main className="min-h-screen bg-neutral-950 text-white">
        {/* nav */}
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/90 px-8 py-5 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              ZITIKS
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/book" className="text-white/60 hover:text-white">
                Browse
              </Link>
              <Link href="/about" className="text-white/60 hover:text-white">
                About
              </Link>
            </div>
          </div>
        </nav>

        <section
          className="px-8 py-24"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(245,210,122,0.06), transparent 65%), #0a0a0a",
          }}
        >
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-16 lg:grid-cols-[1fr_420px]">
              {/* left — info */}
              <div>
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#f5d27a]/60">
                  Get in touch
                </p>
                <h1 className="text-5xl font-bold leading-tight md:text-6xl">
                  Contact Us
                </h1>
                <p className="mt-6 max-w-sm text-lg leading-8 text-white/50">
                  Have a question about an event, a booking issue, or want to partner
                  with us? We&apos;d love to hear from you.
                </p>

                <div className="mt-12 space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/30">
                      Lead Developer
                    </p>
                    <p className="mt-2 font-semibold text-white">
                      Sehastrajit Selvachandran
                    </p>
                    <p className="mt-1 text-sm text-[#f5d27a]/80">
                      sehastrajit@gmail.com
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/30">
                      Project
                    </p>
                    <p className="mt-2 font-semibold text-white">ZITIKS</p>
                    <p className="mt-1 text-sm text-white/50">
                      Blockchain-powered event ticketing
                    </p>
                  </div>
                </div>
              </div>

              {/* right — form */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
                {sent ? (
                  <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 text-5xl text-[#f5d27a]">✓</div>
                    <h2 className="text-2xl font-bold">Message Ready</h2>
                    <p className="mt-2 text-sm text-white/50">
                      Your email client has been opened with your message.
                    </p>
                    <button
                      onClick={() => {
                        setSent(false);
                        setName("");
                        setEmail("");
                        setMessage("");
                      }}
                      className="mt-8 rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
                    >
                      Send another
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="mb-6 text-xl font-bold">Send a message</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label className="mb-1.5 block text-sm text-white/55">
                          Full Name
                        </label>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          placeholder="Your name"
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-[#f5d27a]/50"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm text-white/55">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="your@email.com"
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-[#f5d27a]/50"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm text-white/55">
                          Message
                        </label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                          rows={5}
                          placeholder="How can we help?"
                          className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-[#f5d27a]/50"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded-full bg-[#f5d27a] py-3 font-semibold text-black transition hover:bg-white"
                      >
                        Send Message
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
