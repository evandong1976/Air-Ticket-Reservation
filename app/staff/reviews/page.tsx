"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/navbar";
import type { User } from "@supabase/supabase-js";

type ReviewRow = {
  airline_name: string;
  flight_number: number;
  departure_date_time: string;
  email: string;
  rating: number;
  comment: string | null;
};

export default function StaffReviewsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [flightAverages, setFlightAverages] = useState<
  { flight_number: string | number; avg_rating: string }[]>([]);


  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setPageError(null);

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
        setPageError("Failed to load session.");
        setLoading(false);
        return;
      }

      if (!session?.user) {
        setPageError("You must be signed in as staff to view reviews.");
        setLoading(false);
        return;
      }

      if (session.user.user_metadata?.role !== "Staff") {
        setPageError("Only staff members can view reviews.");
        setLoading(false);
        return;
      }

      setUser(session.user);

      const { data: reviewData, error: reviewError } = await supabase
        .from("review")
        .select(
          `
          airline_name, 
          flight_number, 
          departure_date_time, 
          email, 
          rating, 
          comment
          `
        )
        .order("departure_date_time", { ascending: false });

      if (reviewError) {
        console.error(reviewError);
        setPageError("Failed to load reviews.");
        setLoading(false);
        return;
      }

      // Compute average rating per flight
      const grouped = (reviewData ?? []).reduce((acc: any, r: ReviewRow) => {
        if (!acc[r.flight_number]) {
          acc[r.flight_number] = { total: 0, count: 0 };
        }
        acc[r.flight_number].total += r.rating;
        acc[r.flight_number].count += 1;
        return acc;
      }, {});

      const averages = Object.entries(grouped).map(([flight, info]: any) => ({
        flight_number: flight,
        avg_rating: (info.total / info.count).toFixed(1),
      }));

      setFlightAverages(averages);
      setReviews((reviewData ?? []) as ReviewRow[]);
      setLoading(false);
    };

    init();
  }, []);

  return (
    <>
      <Navbar user={user} />
      <div className="pt-32 max-w-6xl mx-auto px-4 pb-16 min-h-screen bg-slate-50 text-black">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          Flight Reviews
        </h1>

        {loading && <p className="text-center text-gray-600">Loading...</p>}

        {pageError && (
          <p className="text-center text-red-600 font-semibold mb-4">
            {pageError}
          </p>
        )}

        {!loading && !pageError && reviews.length === 0 && (
          <p className="text-center text-gray-600">
            There are no reviews yet.
          </p>
        )}

        {!loading && !pageError && reviews.length > 0 && (
          <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-3 py-2 font-semibold">Airline</th>
                  <th className="px-3 py-2 font-semibold">Flight #</th>
                  <th className="px-3 py-2 font-semibold">Departure Time</th>
                  <th className="px-3 py-2 font-semibold">Customer Email</th>
                  <th className="px-3 py-2 font-semibold">Rating</th>
                  <th className="px-3 py-2 font-semibold">Comment</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r, idx) => (
                  <tr
                    key={`${r.airline_name}-${r.flight_number}-${r.departure_date_time}-${r.email}-${idx}`}
                    className="border-t"
                  >
                    <td className="px-3 py-2">{r.airline_name}</td>
                    <td className="px-3 py-2">{r.flight_number}</td>
                    <td className="px-3 py-2">
                      {new Date(r.departure_date_time).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">{r.email}</td>
                    <td className="px-3 py-2">{r.rating}</td>
                    <td className="px-3 py-2 max-w-md wrap-break-word">
                      {r.comment ?? ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <br></br>

        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          Average Reviews for Flights
        </h1>

        {!loading && !pageError && reviews.length > 0 && (
          <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-3 py-2 font-semibold">Flight #</th>
                  <th className="px-3 py-2 font-semibold">Average Rating</th>
                </tr>
              </thead>
              <tbody>
                {flightAverages.map((f, idx) => (
                  <tr key={`${f.flight_number}-${idx}`} className="border-t">
                    <td className="px-3 py-2">{f.flight_number}</td>
                    <td className="px-3 py-2">{f.avg_rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}