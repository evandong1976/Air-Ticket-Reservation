"use client";
import Link from "next/link";
import { useState } from "react";
import type { User } from "@supabase/supabase-js";

export default function Navbar({ user }: { user: User | null }) {
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

        <div className="flex gap-3">
          {/* See Monthly Ticket Report (STAFF ONLY) */}
          <Link
            href="/report"
            className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition ${user && user.user_metadata.role == "Staff" ? "" : "hidden"}`}
          >
            View Report
          </Link>

          {/* Add Airplane (STAFF ONLY) */}
          <Link
            href="/airplane"
            className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition ${user && user.user_metadata.role == "Staff" ? "" : "hidden"}`}
          >
            Update Airplanes
          </Link>

          {/* Flight Add/Update (STAFF ONLY) */}
          <Link
            href="/staff"
            className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition ${user && user.user_metadata.role == "Staff" ? "" : "hidden"}`}
          >
            Update Flight
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
