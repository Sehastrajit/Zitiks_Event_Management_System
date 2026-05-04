import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950 px-8 py-14 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 sm:grid-cols-3">
          <div>
            <p className="text-2xl font-bold tracking-tight text-[#f5d27a]">ZITIKS</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/50">
              Premium event experiences — concerts, conferences, shows, and workshops.
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Navigate
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-white/60 transition hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-white/60 transition hover:text-white">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/60 transition hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/60 transition hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Built by
            </p>
            <ul className="space-y-2 text-sm">
              <li className="text-white/55">Sehastrajit Selvachandran </li>
              <li className="text-white/55">Manya Mehta</li>
              <li className="text-white/55">Samyogita Bhandari</li>
              <li className="text-white/55">Reshikesh Reddy Puttamreddy</li>
              <li className="text-white/55">Nandan Reddy Jalli</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-white/10 pt-6 text-xs text-white/30 sm:flex-row sm:items-center">
          <p>© 2026 ZITIKS. All rights reserved.</p>
          <p>Blockchain-powered event ticketing.</p>
        </div>
      </div>
    </footer>
  );
}
