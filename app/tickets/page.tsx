"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import FlightCard from "@/components/FlightCard";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

type Flight = {
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

type TicketWithFlight = {
  id: number;
  purchase_date_time: string;
  email: string;
  airline_name: string;
  flight_number: number;
  departure_date_time: string;
  flight: Flight | null;
};

type ReviewRow = {
  airline_name: string;
  flight_number: number;
  departure_date_time: string;
  email: string;
  rating: number;
  comment: string | null;
};

// helper: unique key for a ticket/user review
const reviewKeyForTicket = (t: TicketWithFlight) =>
  `${t.airline_name}__${t.flight_number}__${t.departure_date_time}__${t.email}`;

const reviewKeyFromRow = (r: ReviewRow) =>
  `${r.airline_name}__${r.flight_number}__${r.departure_date_time}__${r.email}`;

export default function MyTicketsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<TicketWithFlight[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // key is the composite string from reviewKeyForTicket / reviewKeyFromRow
  const [reviewsByKey, setReviewsByKey] = useState<
    Record<string, ReviewRow | undefined>
  >({});
  const [reviewForm, setReviewForm] = useState<
    Record<string, { rating: string; comment: string }>
  >({});
  const [savingReviewFor, setSavingReviewFor] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadTickets = async () => {
      setLoading(true);
      setError(null);
      setReviewError(null);
      setReviewSuccess(null);

      // 1. Get current session / user
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Session error:", sessionError);
        setError("Failed to load session.");
        setLoading(false);
        return;
      }

      if (!session?.user) {
        setError("You must be logged in to view your flights.");
        setLoading(false);
        return;
      }

      setUser(session.user);

      const email = session.user.email;
      if (!email) {
        setError("Current user has no email.");
        setLoading(false);
        return;
      }

      // 2. Query tickets for customer
      const { data, error } = await supabase
        .from("ticket")
        .select(
          `
          id,
          purchase_date_time,
          email,
          airline_name,
          flight_number,
          departure_date_time,
          flight:flight (
            flight_number,
            base_price,
            departure_date_time,
            arrival_date_time,
            airplane_id,
            arrival_airport_code,
            status,
            departure_airport_code,
            airline_name
          )
        `
        )
        .eq("email", email)
        .order("departure_date_time", { ascending: true });

      if (error) {
        console.error("Ticket query error:", error);
        setError("Could not load your flights.");
        setLoading(false);
        return;
      }

      // 3. Normalize "flight" in case Supabase returns an array
      const normalized: TicketWithFlight[] = (data ?? []).map((row: any) => ({
        ...row,
        flight: Array.isArray(row.flight) ? row.flight[0] : row.flight,
      }));

      setTickets(normalized);

      // 4. Load this user's reviews
      const { data: reviewData, error: reviewErr } = await supabase
        .from("review")
        .select(
          "airline_name, flight_number, departure_date_time, email, rating, comment"
        )
        .eq("email", email);

      if (reviewErr) {
        console.error("Failed to load reviews:", reviewErr);
        // don't block page; just show without prefilled reviews
      } else {
        const map: Record<string, ReviewRow> = {};
        (reviewData ?? []).forEach((r: any) => {
          const row = r as ReviewRow;
          map[reviewKeyFromRow(row)] = row;
        });
        setReviewsByKey(map);
      }

      setLoading(false);
    };

    loadTickets();
  }, []);

  const now = new Date();

  const upcomingTickets = tickets.filter((t) => {
    const d = new Date(t.departure_date_time);
    return d >= now;
  });

  const pastTickets = tickets.filter((t) => {
    const d = new Date(t.departure_date_time);
    return d < now;
  });

  const handleSaveReview = async (ticket: TicketWithFlight) => {
    const key = reviewKeyForTicket(ticket);
    setReviewError(null);
    setReviewSuccess(null);
    setSavingReviewFor(key);

    const form = reviewForm[key];
    if (!form || !form.rating) {
      setReviewError("Please select a rating.");
      setSavingReviewFor(null);
      return;
    }

    const ratingNum = Number(form.rating);
    if (Number.isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      setReviewError("Rating must be a number between 1 and 5.");
      setSavingReviewFor(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("review")
        .upsert(
          {
            airline_name: ticket.airline_name,
            flight_number: ticket.flight_number,
            departure_date_time: ticket.departure_date_time,
            email: ticket.email,
            rating: ratingNum,
            comment: form.comment ?? null,
          },
          {
            onConflict:
              "airline_name,flight_number,departure_date_time,email",
          }
        )
        .select(
          "airline_name, flight_number, departure_date_time, email, rating, comment"
        )
        .single();

      if (error) {
        console.error("Review upsert error:", error);
        setReviewError(`Failed to save review: ${error.message}`);
      } else if (data) {
        const newRow = data as ReviewRow;
        setReviewSuccess("Review saved!");
        setReviewsByKey((prev) => ({
          ...prev,
          [reviewKeyFromRow(newRow)]: newRow,
        }));
      }
    } finally {
      setSavingReviewFor(null);
    }
  };

  return (
    <>
      <Navbar user={user} />
      <div className="pt-32 max-w-6xl mx-auto px-4 min-h-screen bg-slate-50">
        <h1 className="text-4xl font-bold text-blue-800 mb-8 text-center">
          My Flights
        </h1>

        {loading && <p className="text-center text-gray-600">Loading...</p>}

        {error && (
          <p className="text-center text-red-600 font-semibold">{error}</p>
        )}

        {!loading && !error && tickets.length === 0 && (
          <p className="text-center text-gray-600">
            You have no flights yet.
          </p>
        )}

        {!loading && !error && tickets.length > 0 && (
          <div className="space-y-10">
            {/* Upcoming Flights View */}
            <section>
              <h2 className="text-2xl font-semibold text-blue-700 mb-4">
                Upcoming Flights
              </h2>
              {upcomingTickets.length === 0 ? (
                <p className="text-sm text-gray-600">
                  You have no upcoming flights.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingTickets.map((t) => (
                    <div key={t.id} className="flex flex-col gap-3">
                      {t.flight ? (
                        <FlightCard f={t.flight} />
                      ) : (
                        <div className="p-4 rounded-xl bg-white shadow">
                          <p className="font-semibold">
                            {t.airline_name} {t.flight_number}
                          </p>
                          <p className="text-sm text-gray-600">
                            Departs:{" "}
                            {new Date(
                              t.departure_date_time
                            ).toLocaleString()}
                          </p>
                          <p className="text-xs text-red-500 mt-1">
                            (Flight details not found – check FK/relationship)
                          </p>
                        </div>
                      )}

                      <div className="text-sm text-gray-600 text-right pr-2">
                        Purchased on{" "}
                        {new Date(t.purchase_date_time).toLocaleString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Past Flights and Reviews Display */}
            <section>
              <h2 className="text-2xl font-semibold text-blue-700 mb-2">
                Past Flights (Reviewable)
              </h2>

              {reviewError && (
                <p className="text-sm text-red-600 mb-1">{reviewError}</p>
              )}
              {reviewSuccess && (
                <p className="text-sm text-green-700 mb-1">
                  {reviewSuccess}
                </p>
              )}

              {pastTickets.length === 0 ? (
                <p className="text-sm text-gray-600">
                  You have no past flights yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastTickets.map((t) => {
                    const key = reviewKeyForTicket(t);
                    const existingReview = reviewsByKey[key];
                    const form = reviewForm[key] || {
                      rating: "",
                      comment: "",
                    };

                    return (
                      <div key={t.id} className="flex flex-col gap-3">
                        {t.flight ? (
                          <FlightCard f={t.flight} />
                        ) : (
                          <div className="p-4 rounded-xl bg-white shadow">
                            <p className="font-semibold">
                              {t.airline_name} {t.flight_number}
                            </p>
                            <p className="text-sm text-gray-600">
                              Departs:{" "}
                              {new Date(
                                t.departure_date_time
                              ).toLocaleString()}
                            </p>
                          </div>
                        )}

                        <div className="text-sm text-gray-600 text-right pr-2">
                          Purchased on{" "}
                          {new Date(t.purchase_date_time).toLocaleString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}
                        </div>

                        {/* Review Section */}
                        <div className="bg-white rounded-xl shadow p-3 space-y-2 text-sm">
                          {existingReview ? (
                            <>
                              <p className="font-semibold text-gray-800">
                                Your Review
                              </p>
                              <p className="text-yellow-600">
                                Rating: {existingReview.rating} / 5
                              </p>
                              {existingReview.comment && (
                                <p className="text-gray-700">
                                  “{existingReview.comment}”
                                </p>
                              )}
                              <button
                                className="mt-2 text-xs text-blue-600 hover:underline"
                                onClick={() =>
                                  setReviewForm((prev) => ({
                                    ...prev,
                                    [key]: {
                                      rating: String(
                                        existingReview.rating
                                      ),
                                      comment:
                                        existingReview.comment ?? "",
                                    },
                                  }))
                                }
                              >
                                Edit review
                              </button>
                            </>
                          ) : (
                            <p className="font-semibold text-gray-800">
                              Leave a review for this flight
                            </p>
                          )}

                          {/* Always show form so customer can create/edit review */}
                          <div className="flex flex-col gap-2 mt-2">
                            <div className="flex items-center gap-2">
                              <label className="text-xs text-gray-600">
                                Rating (1–5)
                              </label>
                              <input
                                type="number"
                                min={1}
                                max={5}
                                className="w-20 border rounded px-2 py-1 text-xs text-black"
                                value={form.rating}
                                onChange={(e) =>
                                  setReviewForm((prev) => ({
                                    ...prev,
                                    [key]: {
                                      ...prev[key],
                                      rating: e.target.value,
                                      comment: form.comment,
                                    },
                                  }))
                                }
                              />
                            </div>

                            <textarea
                              rows={2}
                              className="w-full border rounded px-2 py-1 text-xs text-black"
                              placeholder="Optional comment about your experience"
                              value={form.comment}
                              onChange={(e) =>
                                setReviewForm((prev) => ({
                                  ...prev,
                                  [key]: {
                                    ...prev[key],
                                    rating: form.rating,
                                    comment: e.target.value,
                                  },
                                }))
                              }
                            />

                            <button
                              onClick={() => handleSaveReview(t)}
                              disabled={savingReviewFor === key}
                              className="self-start bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-3 py-1 rounded-md text-xs font-semibold"
                            >
                              {savingReviewFor === key
                                ? "Saving..."
                                : "Save Review"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </>
  );
}