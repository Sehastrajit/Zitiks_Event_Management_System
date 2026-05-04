import Link from "next/link";
import Footer from "@/components/Footer";

const team = [
  {
    name: "Sehastrajit Selvachandran",
    role: "Developer",
    bio: "Designed and built ZITIKS across the Next.js frontend, event discovery experience, interactive maps, API routes, and blockchain ticketing integration.",
    linkedin: "https://www.linkedin.com/in/sehastrajit-s/",
  },
];

export default function AboutPage() {
  return (
    <>
      <main className="min-h-screen bg-neutral-950 text-white">
        {/* nav */}
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/90 px-8 py-5 backdrop-blur">
          <div className="flex w-full items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              ZITIKS
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/book" className="text-white/60 hover:text-white">
                Browse
              </Link>
              <Link href="/contact" className="text-white/60 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </nav>

        {/* hero */}
        <section
          className="px-8 py-24"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(245,210,122,0.07), transparent 65%), #0a0a0a",
          }}
        >
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#f5d27a]/60">
              About Us
            </p>
            <h1 className="text-5xl font-bold leading-tight md:text-7xl">
              Built for the{" "}
              <span className="text-[#f5d27a]">experience</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/55">
              ZITIKS is a blockchain-powered event ticketing platform that combines
              premium event discovery with secure, on-chain ticket issuance. Every ticket
              is a verifiable credential that is immutable, transferable, and fraud-proof.
            </p>
          </div>
        </section>

        {/* mission */}
        <section className="border-y border-white/10 bg-white/[0.02] px-8 py-20">
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-3">
            {[
              {
                title: "On-Chain Tickets",
                body: "Every booking issues a real ERC-style credential stored on a local Ethereum node, not a database record.",
              },
              {
                title: "Fraud-Proof",
                body: "Cryptographic credential hashes prevent counterfeiting. Gate verification checks the hash against the on-chain record.",
              },
              {
                title: "Premium Discovery",
                body: "Real-time geolocation, interactive maps, and filtered browsing make finding the right event effortless.",
              },
            ].map(({ title, body }) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
                <div className="mb-4 h-1 w-10 rounded-full bg-[#f5d27a]/60" />
                <h3 className="mb-3 text-lg font-bold">{title}</h3>
                <p className="text-sm leading-7 text-white/55">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* team */}
        <section className="px-8 py-24">
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#f5d27a]/60">
              Developer
            </p>
            <h2 className="mb-14 text-4xl font-bold md:text-5xl">Who built this</h2>

            {team.map((member) => (
              <div
                key={member.name}
                className="mb-8 rounded-3xl border border-[#f5d27a]/20 bg-gradient-to-br from-[#f5d27a]/[0.07] to-white/[0.02] p-10"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-2xl font-bold text-white md:text-3xl">
                      {member.name}
                    </p>
                    <p className="mt-2 flex items-center gap-2">
                      <span className="rounded-full border border-[#f5d27a]/35 bg-[#f5d27a]/10 px-3 py-1 text-xs font-semibold text-[#f5d27a]">
                        {member.role}
                      </span>
                    </p>
                  </div>
                </div>
                <p className="mt-6 max-w-2xl leading-8 text-white/60">{member.bio}</p>
                <Link
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex rounded-full border border-[#f5d27a]/35 px-5 py-2 text-sm font-semibold text-[#f5d27a] transition hover:bg-[#f5d27a] hover:text-black"
                >
                  LinkedIn
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
