"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur ${
        scrolled ? "bg-white/60 dark:bg-black/40" : "bg-transparent"
      }`}
    >
      <div className="bg-amber-400/50 rounded-full mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-white sm:px-6 lg:px-8">
        <div>
          Home
        </div>
        <form>
          
        </form>
        <a>
          
        </a>
      </div>
    </header>
  );
}
