"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/navbar";
import type { User } from "@supabase/supabase-js";
import FlightCard from "@/components/FlightCard";

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

export default function PurchaseTicketPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);

  // pageError = fatal issues (no session, cannot load flight)
  const [pageError, setPageError] = useState<string | null>(null);

  // formError = validation / insert errors (show with the form)
  const [formError, setFormError] = useState<string | null>(null);

  const [cardType, setCardType] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [expDate, setExpDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setPageError(null);
      setFormError(null);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error(sessionError);
        setPageError("Failed to load session.");
        setLoading(false);
        return;
      }

      if (!session?.user) {
        setPageError("You must be logged in as a customer to purchase a ticket.");
        setLoading(false);
        return;
      }

      if (session.user.user_metadata?.role !== "User") {
        setPageError("Only customers can purchase tickets.");
        setLoading(false);
        return;
      }

      setUser(session.user);

      const airline_name = searchParams.get("airline_name");
      const flight_number = searchParams.get("flight_number");
      const departure = searchParams.get("departure");

      if (!airline_name || !flight_number || !departure) {
        setPageError("Missing flight information.");
        setLoading(false);
        return;
      }

      const { data, error: flightError } = await supabase
        .from("flight")
        .select(`
            flight_number,
            airline_name,
            base_price,
            status,
            departure_airport_code,
            arrival_airport_code,
            departure_date_time,
            arrival_date_time,
            airplane_id
        `)
        .eq("airline_name", airline_name)
        .eq("flight_number", flight_number)
        .eq("departure_date_time", departure)
        .maybeSingle();

        if (flightError || !data) {
        console.error(flightError);
        setPageError("Could not find this flight.");
        } else {
        const loadedFlight = data as Flight;

        const now = new Date();
        const departureTime = new Date(loadedFlight.departure_date_time);

        if (departureTime <= now) {
            setPageError(
            "This flight has already departed. Tickets cannot be purchased."
            );
            setFlight(null);
        } else {
            setFlight(loadedFlight);
        }
        }

        setLoading(false);
    };

    init();
  }, [searchParams]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user || !flight) return;

  setSubmitting(true);
  setFormError(null);
  setSuccessMessage(null);

  try {
    // 1) Required fields
    if (!cardType || !cardNumber || !nameOnCard || !expDate) {
      setFormError("Please fill out all payment fields.");
      setSubmitting(false);
      return;
    }

    // 2) Ensure user has email
    const email = user.email;
    if (!email) {
      setFormError("Current user has no email.");
      setSubmitting(false);
      return;
    }

    // 3) Card type check (must be "Credit" or "Debit")
    const normalizedType = cardType.trim();
    if (!["Credit", "Debit"].includes(normalizedType)) {
      setFormError('Card type must be "Credit" or "Debit".');
      setSubmitting(false);
      return;
    }

    // 4) Card number cleaning and check
    const digitsOnly = cardNumber.replace(/\D/g, "");
    if (digitsOnly.length !== 16) {
      setFormError(
        "Card number must be exactly 16 digits (numbers only, no spaces)."
      );
      setSubmitting(false);
      return;
    }

    // 5) Expiration MM/YY parse & validation
    const parts = expDate.split("/");
    if (parts.length !== 2) {
      setFormError("Expiration date must be in MM/YY format.");
      setSubmitting(false);
      return;
    }

    const [mm, yy] = parts;
    const monthNum = parseInt(mm, 10);
    const yearNum = parseInt(yy, 10);

    if (
      isNaN(monthNum) ||
      isNaN(yearNum) ||
      monthNum < 1 ||
      monthNum > 12 ||
      mm.length !== 2 ||
      yy.length !== 2
    ) {
      setFormError("Expiration date must be a valid month and year (MM/YY).");
      setSubmitting(false);
      return;
    }

    // 6) Convert MM/YY -> YYYY-MM-01 for database date column
    const expirationDateForDB = `20${yy}-${mm}-01`;

    // 7) Insert into ticket table
    const { error: insertError } = await supabase.from("ticket").insert({
      email: email,
      airline_name: flight.airline_name,
      flight_number: flight.flight_number,
      departure_date_time: flight.departure_date_time,
      purchase_date_time: new Date().toISOString(),
      card_type: normalizedType,
      card_number: digitsOnly,
      expiration_date: expirationDateForDB,
    });

    if (insertError) {
      console.error("Insert error:", insertError);
      setFormError(`Purchase failed: ${insertError.message}`);
    } else {
      setSuccessMessage("Ticket purchased successfully!");
      setTimeout(() => {
        router.push("/tickets");
      }, 1500);
    }
  } finally {
    setSubmitting(false);
  }
};




  return (
    <>
      <Navbar user={user} />
      <div className="pt-32 max-w-5xl mx-auto px-4 min-h-screen bg-slate-50">
        {loading && <p className="text-center text-gray-600">Loading...</p>}

        {/* Fatal error: show only message */}
        {!loading && pageError && (
        <div className="flex flex-col items-center mt-6">
            <p className="text-center text-red-600 font-semibold mb-4">
            {pageError}
            </p>

            <button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
            Return to Home
            </button>
        </div>
        )}


        {/* Normal case: show flight + form; formError stays with the form */}
        {!loading && !pageError && flight && (
          <>
            <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
              Purchase Ticket
            </h1>

            <div className="mb-8">
              <FlightCard f={flight} />
            </div>

            {formError && (
              <p className="text-center text-red-600 font-semibold mb-3">
                {formError}
              </p>
            )}
            {successMessage && (
              <p className="text-center text-green-700 font-semibold mb-3">
                {successMessage}
              </p>
            )}

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-md p-6 space-y-4"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Payment Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Type
                  </label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 text-black"
                    value={cardType}
                    onChange={(e) => setCardType(e.target.value)}
                    placeholder="Credit/Debit"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 text-black"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="16-digit card number (numbers only)"

                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name on Card
                  </label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 text-black"
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                    placeholder="Your Name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 text-black"
                    value={expDate}
                    onChange={(e) => {
                        let v = e.target.value;

                        // 1) Remove everything that's not a digit
                        v = v.replace(/\D/g, "");

                        // 2) Insert "/" after the first two digits if we have at least 3 digits
                        if (v.length >= 3) {
                        v = v.slice(0, 2) + "/" + v.slice(2, 4); // "0927" -> "09/27"
                        }

                        // 3) Limit to "MM/YY" 
                        if (v.length > 5) {
                        v = v.slice(0, 5);
                        }

                        setExpDate(v);
                    }}
                    maxLength={5}
                    placeholder="MM/YY"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-4 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-6 py-2 rounded-lg font-semibold"
              >
                {submitting ? "Processing..." : "Confirm Purchase"}
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}