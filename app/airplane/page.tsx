"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Airplane } from "@/types";
import type { User } from "@supabase/supabase-js"

export default function AirplanePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [staffAirline, setStaffAirline] = useState<string>("");
    const [loading, setLoading] = useState(true);

    const initializeNewAirplaneState: Airplane = {
        airline: "",
        airplane_id: 0, 
        num_seats: 0,
        manufacturing_company: "",
        age: 0,
    }

    const [newAirplane, setNewAirplane] = useState<Airplane>(initializeNewAirplaneState);

    useEffect(() => {
        const loadPage = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (!user) {
            alert("Please log in before attempting to access this page");
            router.push("/login"); 
            return;
            }

            if (user.email) {
                const { data, error } = await supabase
                .from("airline_staff")
                .select("airline_name") 
                .eq("email_address", user.email)
                .maybeSingle();

                // get staff's airline name and pre-fill into new airplane form
                if (data && data.airline_name) {
                    setStaffAirline(data.airline_name);
                    setNewAirplane(prev => ({ ...prev, airline_name: data.airline_name }));
                }
            }

            setLoading(false);
        };
        
        loadPage();
    }, [router]);

    if (loading) return <div className="p-10">Loading...</div>;

    return (
        <div className="p-10 min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center mb-4">Add Airplane for {""}
            <span className="text-blue-500">{staffAirline}</span>
        </h1>
        
        {/* form will go here */}
        </div>
    );

}