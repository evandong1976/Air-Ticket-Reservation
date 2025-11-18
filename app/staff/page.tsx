"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { flight } from "@/components/homepage";

export default function FlightsPage() {
  const [flights, setFlights] = useState<flight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from("flight").select("*");
      if (!error && data) setFlights(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleChange = (
    flight_number: number,
    field: keyof flight,
    value: string | number
  ) => {
    setFlights((prev) =>
      prev.map((f) =>
        f.flight_number === flight_number ? { ...f, [field]: value } : f
      )
    );
  };

  if (loading) {
    return (
      <p className="text-center text-lg mt-10 animate-pulse text-gray-600">
        Loading flights...
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Update Flights</h1>

      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          {/* Header */}
          <thead className="bg-gray-100 sticky top-0 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-3 border-b">Flight #</th>
              <th className="px-4 py-3 border-b">Airline</th>
              <th className="px-4 py-3 border-b">Airplane ID</th>
              <th className="px-4 py-3 border-b">Base Price</th>
              <th className="px-4 py-3 border-b">Status</th>
              <th className="px-4 py-3 border-b">Depart Airport</th>
              <th className="px-4 py-3 border-b">Arrive Airport</th>
              <th className="px-4 py-3 border-b">Depart Time</th>
              <th className="px-4 py-3 border-b">Arrive Time</th>
              <th className="px-4 py-3 border-b">Save</th>
            </tr>
          </thead>

          <tbody>
            {flights.map((f, idx) => (
              <tr
                key={f.flight_number}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-3 border-b">{f.flight_number}</td>

                {/* Inputs */}
                <td className="px-4 py-3 border-b">
                  <input
                    className="border rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-blue-400 outline-none"
                    value={f.airline_name}
                    onChange={(e) =>
                      handleChange(
                        f.flight_number,
                        "airline_name",
                        e.target.value
                      )
                    }
                  />
                </td>

                <td className="px-4 py-3 border-b">
                  <input
                    type="number"
                    className="border rounded-lg px-2 py-1 w-full"
                    value={f.airplane_id}
                    onChange={(e) =>
                      handleChange(
                        f.flight_number,
                        "airplane_id",
                        Number(e.target.value)
                      )
                    }
                  />
                </td>

                <td className="px-4 py-3 border-b">
                  <input
                    type="number"
                    className="border rounded-lg px-2 py-1 w-full"
                    value={f.base_price}
                    onChange={(e) =>
                      handleChange(
                        f.flight_number,
                        "base_price",
                        Number(e.target.value)
                      )
                    }
                  />
                </td>

                <td className="px-4 py-3 border-b">
                  <input
                    className="border rounded-lg px-2 py-1 w-full"
                    value={f.status}
                    onChange={(e) =>
                      handleChange(f.flight_number, "status", e.target.value)
                    }
                  />
                </td>

                <td className="px-4 py-3 border-b">
                  <input
                    className="border rounded-lg px-2 py-1 w-full"
                    value={f.departure_airport_code}
                    onChange={(e) =>
                      handleChange(
                        f.flight_number,
                        "departure_airport_code",
                        e.target.value
                      )
                    }
                  />
                </td>

                <td className="px-4 py-3 border-b">
                  <input
                    className="border rounded-lg px-2 py-1 w-full"
                    value={f.arrival_airport_code}
                    onChange={(e) =>
                      handleChange(
                        f.flight_number,
                        "arrival_airport_code",
                        e.target.value
                      )
                    }
                  />
                </td>

                <td className="px-4 py-3 border-b">
                  <input
                    type="datetime-local"
                    className="border rounded-lg px-2 py-1 w-full"
                    value={f.departure_date_time}
                    onChange={(e) =>
                      handleChange(
                        f.flight_number,
                        "departure_date_time",
                        e.target.value
                      )
                    }
                  />
                </td>

                <td className="px-4 py-3 border-b">
                  <input
                    type="datetime-local"
                    className="border rounded-lg px-2 py-1 w-full"
                    value={f.arrival_date_time}
                    onChange={(e) =>
                      handleChange(
                        f.flight_number,
                        "arrival_date_time",
                        e.target.value
                      )
                    }
                  />
                </td>

                <td className="px-4 py-3 border-b text-center">
                  <button
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-3 py-1 rounded-lg transition shadow-sm"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
