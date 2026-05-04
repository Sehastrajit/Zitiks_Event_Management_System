"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

const videos = [
  { src: "/assets/c1.mp4", title: "Concert" },
  { src: "/assets/c2.mp4", title: "Conference" },
  { src: "/assets/c3.mp4", title: "Shows" },
];

export default function Home() {
  const [current, setCurrent] = useState(0);

  const changeSlide = (nextIndex: number) => {
    if (nextIndex === current) return;
    setCurrent(nextIndex);
  };

  useEffect(() => {
    let locked = false;

    const handleWheel = (e: WheelEvent) => {
      if (locked) return;
      locked = true;

      if (e.deltaY > 0) {
        changeSlide((current + 1) % videos.length);
      } else {
        changeSlide((current - 1 + videos.length) % videos.length);
      }

      setTimeout(() => {
        locked = false;
      }, 1200);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [current]);

  return (
    <>
      <main className="relative h-screen w-full overflow-hidden">
        {videos.map((video, index) => (
          <video
            key={video.src}
            src={video.src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
              current === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-black/45" />

        <nav className="absolute left-0 top-0 z-20 flex w-full items-center justify-between px-8 py-6">
          <Link href="/" className="text-2xl font-bold text-white">
            ZITIKS
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/book" className="text-white hover:text-gray-300">
              Browse
            </Link>
            <Link href="/about" className="text-white hover:text-gray-300">
              About
            </Link>
            <Link href="/contact" className="text-white hover:text-gray-300">
              Contact
            </Link>
          </div>
        </nav>

        <div className="relative z-10 flex h-screen items-center justify-center">
          <div
            key={videos[current].title}
            className="flex animate-[fadeUp_0.7s_ease-out] flex-col items-center gap-6"
          >
            <h1 className="text-9xl font-bold text-white">
              {videos[current].title}
            </h1>

            <Link
              href="/book"
              className="rounded-full bg-white px-8 py-3 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-gray-200"
            >
              Book Now
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 z-30 flex -translate-x-1/2 items-center gap-4">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => changeSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`rounded-full transition-all duration-300 ${
                current === index
                  ? "h-4 w-4 bg-white"
                  : "h-3 w-3 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </main>

    </>
  );
}
