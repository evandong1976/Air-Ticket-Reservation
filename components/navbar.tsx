"use client";
import Link from "next/link";
import { useState } from "react";
import type { User } from "@supabase/supabase-js";

export default function Navbar({ user }: { user: User | null }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-700 tracking-tight"
        >
          ✈️ AirReserve
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Home
          </Link>
          <Link
            href="/flights"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Flights
          </Link>
          <Link
            href="/about"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Contact
          </Link>

          {/* Profile / Sign In */}
          <Link
            href={user ? "/profile" : "/login"}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            {user ? "Profile" : "Sign In"}
          </Link>
        </div>
      </div>
    </nav>
  );
}
