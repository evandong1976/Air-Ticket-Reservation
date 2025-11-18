"use client";

import type { flight } from "./homepage";

export default function FlightCard({ f }: { f: flight }) {
  return (
    <div
      key={f.flight_number}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 transform hover:-translate-y-1"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-700">{f.airline_name}</h2>
        <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
          {f.status}
        </span>
      </div>

      <div className="space-y-2 text-gray-800">
        <p className="text-lg font-semibold">Flight {f.flight_number}</p>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="font-semibold text-gray-500 text-sm">FROM</p>
            <p className="text-xl font-bold text-blue-900">
              {f.departure_airport_code}
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-500 text-sm">TO</p>
            <p className="text-xl font-bold text-blue-900">
              {f.arrival_airport_code}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <p>
            <span className="font-semibold text-gray-500">Departure:</span>{" "}
            {new Date(f.departure_date_time).toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
          <p>
            <span className="font-semibold text-gray-500">Arrival:</span>{" "}
            {new Date(f.arrival_date_time).toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>

        <p className="mt-4 text-xl font-bold text-green-600">${f.base_price}</p>
      </div>
    </div>
  );
}
