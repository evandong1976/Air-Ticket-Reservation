"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Flight } from "@/types";
import Link from "next/link";

export default function FlightsPage() {
  const initialNewFlightState: Flight = {
    flight_number: 0,
    base_price: 0,
    departure_date_time: "",
    arrival_date_time: "",
    airplane_id: 0,
    arrival_airport_code: "",
    status: "On Time",
    departure_airport_code: "",
    airline_name: "",
};

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [newFlight, setNewFlight] = useState(initialNewFlightState);

  // Format: "May 26, 2025, 5:30 PM"
  const formatDate = (iso: string) => {
    const date = new Date(iso);
    if (isNaN(date.getTime())) return iso; // fallback if invalid
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from("flight").select("*");
      if (!error && data) setFlights(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleNewFlightChange = (
    field: keyof typeof initialNewFlightState, 
    value: string | number
    ) => {
    setNewFlight((prev) => ({ ...prev, [field]: value }));
};

  const handleNewFlight = async () => {
    setSaving(true);

    // check if primary key fields are filled
    if (!newFlight.airline_name || !newFlight.departure_airport_code) {
      alert("Please enter the airline name and airport codes.");
      setSaving(false);
      return;
    }

    // attempt to send new flight info to supabase
    try {
    const { data, error } = await supabase
      .from("flight")
      .insert([newFlight])
      .select(); // Return the data so we can update the UI

    if (error) throw error; // in case insert violates database constraints

    // if successful, update the table without refreshing
    if (data) {
      setFlights((prev) => [...data, ...prev]); // add new flight to top of flights list
      setNewFlight(initialNewFlightState); // clear input fields
      alert("Flight added successfully!");
    }

  } catch (error) {
    console.error("Error adding flight:", error);
    alert("Failed to add flight. Check console.");

  } finally {
    setSaving(false);
  }
}

  const handleChange = (
    flight_number: number,
    field: keyof Flight,
    value: string | number
  ) => {
    setFlights((prev) =>
      prev.map((f) =>
        f.flight_number === flight_number ? { ...f, [field]: value } : f
      )
    );
  };

  const handleSave = async (flightToSave: Flight) => {
    setSaving(true);
    try {
      // attempt to send update to supabase
      const { error } = await supabase
        .from("flight")
        .update({
          airline_name: flightToSave.airline_name,
          airplane_id: flightToSave.airplane_id,
          base_price: flightToSave.base_price,
          status: flightToSave.status,
          departure_airport_code: flightToSave.departure_airport_code,
          arrival_airport_code: flightToSave.arrival_airport_code,
          departure_date_time: flightToSave.departure_date_time,
          arrival_date_time: flightToSave.arrival_date_time,
        })
        .eq("flight_number", flightToSave.flight_number); // condition to ensure correct flight is updated

      if (error) throw error; // in case flight update violates database constraints

      alert(`Success! Flight #${flightToSave.flight_number} updated.`);

    } catch (error) {
      console.error("Error updating flight:", error);
      alert("Failed to save changes. Check the console for details.");
      
    } finally {
      setSaving(false);
    }
    
  }
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
              <th className="px-4 py-3 font-bold border-b">
                <Link 
                  href="/" 
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-xs hover:bg-gray-300 transition"
                >
                  Home
                </Link>
              </th>
            </tr>
          </thead>

          <tbody>
            {/* Start of Flight Insert Row */}
            <tr className="border border-green-300 rounded-lg px-2 py-1 w-full">
              {/* Flight Number Input */}
              <td className="px-4 py-3">
                <input
                  type="number"
                  placeholder="XXX"
                  className="border border-green-300 rounded-lg px-2 py-1 w-full placeholder-gray-400 placeholder-opacity-100 text-black"
                  value={newFlight.flight_number || ""}
                  onChange={(e) => handleNewFlightChange("flight_number", Number(e.target.value))}
                />
              </td>

              {/* Airline Input */}
              <td className="px-4 py-3">
                <input
                  placeholder=""
                  className="border border-green-300 rounded-lg px-2 py-1 w-full placeholder-gray-400 placeholder-opacity-100 text-black"
                  value={newFlight.airline_name}
                  onChange={(e) => handleNewFlightChange("airline_name", e.target.value)}
                />
              </td>

              {/* Airplane ID Input */}
              <td className="px-4 py-3">
                <input
                  type="number"
                  placeholder="ID"
                  className="border border-green-300 rounded-lg px-2 py-1 w-full placeholder-gray-600 placeholder-opacity-100 text-black"
                  value={newFlight.airplane_id || ""}
                  onChange={(e) => handleNewFlightChange("airplane_id", Number(e.target.value))}
                />
              </td>

              {/* Price Input */}
              <td className="px-4 py-3">
                <input
                  type="number"
                  placeholder="$"
                  className="border border-green-300 rounded-lg px-2 py-1 w-full placeholder-gray-400 placeholder-opacity-100 text-black"
                  value={newFlight.base_price || ""}
                  onChange={(e) => handleNewFlightChange("base_price", Number(e.target.value))}
                />
              </td>

              {/* Status Dropdown Menu */}
              <td className="px-4 py-3">
                <select 
                  className="border border-green-300 rounded-lg px-2 py-1 w-full text-black"
                  value={newFlight.status}
                  onChange={(e) => handleNewFlightChange("status", e.target.value)}
                >
                  <option value="On Time">On Time</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>

              {/* Departure Airport */}
              <td className="px-4 py-3">
                <input
                  placeholder="XXX"
                  className="border border-green-300 rounded-lg px-2 py-1 w-full placeholder-gray-400 placeholder-opacity-100 text-black"
                  maxLength={3}
                  value={newFlight.departure_airport_code}
                  onChange={(e) => handleNewFlightChange("departure_airport_code", e.target.value)}
                />
              </td>

              {/* Arrival Airport */}
              <td className="px-4 py-3">
                <input
                  placeholder="XXX"
                  className="border border-green-300 rounded-lg px-2 py-1 w-full placeholder-gray-400 placeholder-opacity-100 text-black"
                  maxLength={3}
                  value={newFlight.arrival_airport_code}
                  onChange={(e) => handleNewFlightChange("arrival_airport_code", e.target.value)}
                />
              </td>

              {/* Departure Time */}
              <td className="px-4 py-3">
                <input
                  type="datetime-local"
                  className="border border-green-300 rounded-lg px-2 py-1 w-full text-black"
                  value={newFlight.departure_date_time}
                  onChange={(e) => handleNewFlightChange("departure_date_time", e.target.value)}
                />
              </td>

              {/* Arrival Time */}
              <td className="px-4 py-3">
                <input
                  type="datetime-local"
                  className="border border-green-300 rounded-lg px-2 py-1 w-full text-black"
                  value={newFlight.arrival_date_time}
                  onChange={(e) => handleNewFlightChange("arrival_date_time", e.target.value)}
                />
              </td>

              {/* Add New Flight Button */}
              <td className="px-4 py-3 text-center">
                <button
                  onClick={handleNewFlight}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg shadow-md font-bold"
                >
                  {saving ? "..." : "Add"}
                </button>
              </td>
            </tr>
            {/* End of Flight Insert Row */}

            {/* Flight List Start */}
            {flights.map((f, idx) => (
              <tr
                key={f.flight_number}
                className={`text-black ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="px-4 py-3 border-b">{f.flight_number}</td>

                {/* Airline name */}
                <td className="px-4 py-3 border-b">
                  <input
                    className="border text-black rounded-lg px-2 py-1 w-full"
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

                {/* Airplane ID */}
                <td className="px-4 py-3 border-b">
                  <input
                    type="number"
                    className="border text-black rounded-lg px-2 py-1 w-full"
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

                {/* Base price */}
                <td className="px-4 py-3 border-b">
                  <input
                    type="number"
                    className="border text-black rounded-lg px-2 py-1 w-full"
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

                {/* Status */}
                <td className="px-4 py-3 border-b">
                  <select
                      className="border text-black rounded-lg px-2 py-1 w-full"
                      value={f.status}
                      onChange={(e) =>
                        handleChange(f.flight_number, "status", e.target.value)
                      }
                  >                 
                    <option value="On Time">On Time</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>

                {/* Depart airport */}
                <td className="px-4 py-3 border-b">
                  <input
                    className="border text-black rounded-lg px-2 py-1 w-full"
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

                {/* Arrive airport */}
                <td className="px-4 py-3 border-b">
                  <input
                    className="border text-black rounded-lg px-2 py-1 w-full"
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

                {/* Formatted + editable departure time */}
                <td className="px-4 py-3 border-b">
                  <div className="text-gray-500 text-xs mb-1">
                    {formatDate(f.departure_date_time)}
                  </div>
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

                {/* Formatted + editable arrival time */}
                <td className="px-4 py-3 border-b">
                  <div className="text-gray-500 text-xs mb-1">
                    {formatDate(f.arrival_date_time)}
                  </div>
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

                {/* Save button */}
                <td className="px-4 py-3 border-b text-center">
                  <button
                    onClick={() => handleSave(f)}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-3 py-1 rounded-lg transition shadow-sm"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </td>
              </tr>
            ))}
            {/* Flight List End */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
