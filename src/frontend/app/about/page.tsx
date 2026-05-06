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
      <main className="min-h-screen text-white" style={{ background: "radial-gradient(circle_at_center,#6d28d9,#050008_65%)" }}>
        {/* nav */}
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-white/10 px-8 py-5 backdrop-blur">
          <div className="flex w-full items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              ZITIKS
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/book" className="text-white/70 hover:text-white">
                Browse
              </Link>
              <Link href="/contact" className="text-white/70 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </nav>

        {/* hero */}
        <section className="px-8 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-purple-400/60">
              Open Source
            </p>
            <h1 className="text-5xl font-bold leading-tight md:text-7xl">
              Built in the{" "}
              <span className="text-purple-400">open</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/55">
              ZITIKS is a blockchain-powered event ticketing platform that combines
              premium event discovery with secure, on-chain ticket issuance. Every ticket
              is a verifiable credential that is immutable, transferable, and fraud-proof.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/45">
              The source code is public under the MIT License so developers can study it,
              fork it, open issues, and contribute improvements through pull requests.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="https://github.com/Sehastrajit/Zitiks_Event_Management_System"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                View Source
              </Link>
              <Link
                href="https://github.com/Sehastrajit/Zitiks_Event_Management_System/issues"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
              >
                Open Issues
              </Link>
            </div>
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
              {
                title: "Open Contributions",
                body: "Issues, pull requests, release notes, and contributor docs are set up so anyone can help improve the project.",
              },
            ].map(({ title, body }) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
                <div className="mb-4 h-1 w-10 rounded-full bg-purple-600" />
                <h3 className="mb-3 text-lg font-bold">{title}</h3>
                <p className="text-sm leading-7 text-white/55">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* team */}
        <section className="px-8 py-24">
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-purple-400/60">
              Developer
            </p>
            <h2 className="mb-14 text-4xl font-bold md:text-5xl">Who built this</h2>

            {team.map((member) => (
              <div
                key={member.name}
                className="mb-8 rounded-3xl border border-purple-600/20 bg-gradient-to-br from-purple-600/[0.07] to-white/[0.02] p-10"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-2xl font-bold text-white md:text-3xl">
                      {member.name}
                    </p>
                    <p className="mt-2 flex items-center gap-2">
                      <span className="rounded-full border border-purple-600/35 bg-purple-600/10 px-3 py-1 text-xs font-semibold text-purple-400">
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
                  className="mt-8 inline-flex rounded-full border border-purple-600/35 px-5 py-2 text-sm font-semibold text-purple-400 transition hover:bg-purple-600 hover:text-white"
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
