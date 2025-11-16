"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import { flight } from "@/app/page";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";


export default function HomePage() {
  const [flights, setFlights] = useState<flight[]>([]);
  const [query, setQuery] = useState({
    airline: "",
    departure: "",
    arrival: "",
    date: "",
  });
  const [user, setUser] = useState<User | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  // gets the user
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };
    checkSession();
  }, []);

  return (
    <>
      <Navbar user={user} />
      <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-blue-100 to-blue-300 p-8">
        <h1 className="text-5xl font-bold text-blue-900 mb-8 text-center">
          Search for Future Flights
        </h1>

        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-xl p-8 flex flex-col text-black md:flex-row gap-4 w-full max-w-6xl"
        >
          <input
            type="text"
            placeholder="Airline"
            value={query.airline}
            onChange={(e) => setQuery({ ...query, airline: e.target.value })}
            className="flex-1 border border-gray-300 rounded-lg px-4 text-black py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Departure"
            value={query.departure}
            onChange={(e) => setQuery({ ...query, departure: e.target.value })}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Arrival"
            value={query.arrival}
            onChange={(e) => setQuery({ ...query, arrival: e.target.value })}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="date"
            value={query.date}
            onChange={(e) => setQuery({ ...query, date: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none text-black focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 cursor-pointer rounded-lg font-semibold transition"
          >
            Search
          </button>
        </form>

        {/* Display the flights */}
      </div>
    </>
  );
}
