"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

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
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
          <div className="flex flex-col space-y-3 p-4">
            <Link
              href="/"
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Home
            </Link>
            <Link
              href="/flights"
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Flights
            </Link>
            <Link
              href="/about"
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Contact
            </Link>
            <Link
              href="/login"
              onClick={toggleMenu}
              className="bg-blue-600 hover:bg-blue-700 text-white text-center px-4 py-2 rounded-lg font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
