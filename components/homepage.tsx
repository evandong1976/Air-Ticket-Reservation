"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import FlightCard from "@/components/FlightCard";

export type flight = {
  flight_number: number;
  base_price: number;
  departure_date_time: string;
  arrival_date_time: string;
  airplane_id: number;
  arrival_airport_code: string;
  status: string;
  departure_airport_code: string;
  airline_name: string;
};

export default function HomePage() {
  const [flights, setFlights] = useState<flight[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [query, setQuery] = useState({
    airline: "",
    departure: "",
    arrival: "",
    date: "",
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("flight")
      .select("*")
      .ilike("airline_name", query.airline ? `%${query.airline}%` : "%*")
      .ilike(
        "departure_airport_code",
        query.departure ? `%${query.departure}%` : "%*"
      )
      .ilike(
        "arrival_airport_code",
        query.arrival ? `%${query.arrival}%` : "%*"
      )
      .gte(
        "departure_date_time",
        query.date ? `${query.date}T00:00:00Z` : "1970-01-01T00:00:00Z"
      )
      .lte(
        "departure_date_time",
        query.date ? `${query.date}T23:59:59Z` : "2100-01-01T00:00:00Z"
      )
      .order("departure_date_time", { ascending: true });

    if (error) {
      console.error("Error searching flights:", error);
    } else {
      setFlights(data);
    }
  };

  // gets the user
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };
    checkSession();
  }, []);

  // finds all the flights
  useEffect(() => {
    const fetchFlights = async () => {
      const { data, error } = await supabase
        .from("flight")
        .select("*")
        .order("departure_date_time", { ascending: true });

      if (error) {
        console.error("Error fetching flights:", error);
      } else {
        setFlights(data);
      }
    };

    fetchFlights();
  }, []);

  return (
    <>
      <Navbar user={user} />
      <div className="pt-52 flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-blue-100 to-blue-300 p-8">
        <h1 className="text-5xl font-bold text-blue-900 mb-16 text-center">
          Welcome {user? "" : "Customer!"}
        </h1>

        <h1 className="text-5xl font-bold text-blue-500 mb-8 text-center">
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
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flights.map((flightObj) => (
            <FlightCard key={flightObj.flight_number} f={flightObj} />
          ))}
        </div>
      </div>
    </>
  );
}
