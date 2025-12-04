"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import FlightCard from "@/components/FlightCard";
import SearchForm from "@/components/SearchForm";
import { useFlights } from "@/hooks/useFlights";
import { Flight } from "@/types"
import { useRouter } from "next/navigation";

/**
 * HomePage Component
 *
 * This component is responsible for displaying the main landing page of the application.
 * It includes the navigation bar, a welcome message, a search form for flights,
 * and a list of available flights.
 */
export default function HomePage() {
  // Custom hook to manage flight data and search logic
  const { flights, searchFlights } = useFlights();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(false);
  const router = useRouter();

  // handle purchase button click
  const handlePurchaseClick = (flightObj: Flight) => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (role !== "customer") {
      return;
    }

    router.push(
      `/tickets/purchase?airline_name=${encodeURIComponent(
        flightObj.airline_name
      )}&flight_number=${flightObj.flight_number}&departure=${encodeURIComponent(
        flightObj.departure_date_time
      )}`
    );
  };

  // Effect to check for an active user session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      // check if user has logged in
      if (session && session.user.email) {
        setUser(session.user);
        setLoadingRole(true); // begin loading role
        const email = session.user.email;
        
        // check whether the logged in user is staff or customer
        const [customerResponse, staffResponse] = await Promise.all([
          supabase.from("customer").select("*").eq("email", email).maybeSingle(),
          supabase.from("airline_staff").select("*").eq("email_address", email).maybeSingle()
        ]);

        // set role accordingly
        if (staffResponse.data) {
          setRole("staff");
        } else if (customerResponse.data) {
          setRole("customer");
        }
        
        setLoadingRole(false); // finish loading role
      }
    
    };
    checkSession();
  }, []);

  // function to help determine welcome display
  const getWelcomeText = () => {
    if (!user) return "Guest";           // not logged in
    if (loadingRole) return "...";       // logged in but checking role
    if (role === "staff") return "Staff"; // logged in as staff
    return "Customer";                   // logged in as customer
  };



  return (
    <>
      <Navbar user={user} />
      <div className="pt-52 flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-blue-100 to-blue-300 p-8">
        <h1 className="text-5xl font-bold text-blue-900 mb-16 text-center">
          Welcome {getWelcomeText()}!
        </h1>

        <h1 className="text-5xl font-bold text-blue-500 mb-8 text-center">
          Search for Future Flights
        </h1>

        {/* Search Form Component */}
        <SearchForm onSearch={searchFlights} />

        {/* Display the flights */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flights.map((flightObj) => (
            <div key={flightObj.flight_number} className="flex flex-col h-full"> 
              
              {/* Flight card to display fight info */}
              <FlightCard f={flightObj} />

              {/* Purchase button (only visible to non-staff) */}
              {!user && (
                <button
                  onClick={() => handlePurchaseClick(flightObj)}
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors duration-200"
                >
                  Log In to Purchase
                </button>
              )}

              {role == "customer" && (
                <button
                  onClick={() => handlePurchaseClick(flightObj)}
                  className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors duration-200"
                >
                  Purchase Ticket
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
