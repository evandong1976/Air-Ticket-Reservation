"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Airplane } from "@/types";
import type { User } from "@supabase/supabase-js"
import Link from "next/link";

export default function AirplanePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [staffAirline, setStaffAirline] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [airplaneList, setAirplanes] = useState<Airplane[]>([]);

    const initializeNewAirplaneState: Airplane = {
        airline_name: "",
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

    useEffect(() => {
        // fetch all airplanes under the staff's airline
        const loadAirplanes = async () => {
            if (!staffAirline) return;

            const { data, error } = await supabase
            .from("airplane")
            .select("*")
            .eq("airline_name", staffAirline);

            if (!error && data) setAirplanes(data);
        }
        loadAirplanes();
    }, [staffAirline]);

    const handleNewAirplane = (
        field: keyof typeof initializeNewAirplaneState,
        value: string | number
        ) => {
        setNewAirplane((prev) => ({ ...prev, [field]: value }));
    };

    const addNewAirplane = async () => {
        setSaving(true);

        // check if primary key fields are filled
        if (!newAirplane.airline_name || !newAirplane.airplane_id) {
            alert("Please enter the airplane ID.");
            setSaving(false);
            return;
        }

        // attempt to send new airplane info to supabase
        try {
            const { data, error } = await supabase
                .from("airplane")
                .insert([newAirplane])
                .select(); // Return the data so we can update the UI
                
                if (error) throw error; // in case insert violates database constraints

                // if successful, update the table without refreshing
                if (data) {
                setAirplanes((prev) => [...data, ...prev]); // add new airplane to top of airplane list
                setNewAirplane(initializeNewAirplaneState); // clear input fields
                setNewAirplane(prev => ({ ...prev, airline_name: staffAirline }));
                alert("Airplane added successfully!");
            }

        } catch (error) {
            console.error("Error adding airplane:", error);
            alert("Failed to add airplane");

        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="p-10">Loading...</div>;

    return (
        <div className="p-10 min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center mb-4">Add Airplane for {""}
            <span className="text-blue-500">{staffAirline}</span>
        </h1>
        
        <table className="min-w-full text-sm">
            {/* Start of: Setup column headers and Homepage return buttom */}
            <thead className="bg-gray-100 sticky top-0 text-gray-700 font-semibold">
                <tr>
                    <th className="px-4 py-3 border-b">Airline</th>
                    <th className="px-4 py-3 border-b">Airplane ID</th>
                    <th className="px-4 py-3 border-b"># of Seats</th>
                    <th className="px-4 py-3 border-b">Manufacturing Company</th>
                    <th className="px-4 py-3 border-b">Airplane Age</th>
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
            {/* End of: Setup column headers and Homepage return buttom */}    
            
            <tbody>
                {/* Start of Airplane Insert Row */}
                <tr className="px-4 py-3 border border-black">
                    {/* Airline Name Field (locked to staff's airline) */}
                    <td className="px-4 py-3">
                        <input
                            type="string"
                            className="border border-gray-300 bg-gray-200 text-gray-600 rounded-lg px-2 py-1 w-full cursor-not-allowed"
                            value={newAirplane.airline_name}
                            disabled
                            readOnly 
                        />
                    </td>

                    {/* Airplane ID Input */}
                    <td className="px-4 py-3">
                        <input
                            type="number"
                            className="border border-black rounded-lg px-2 py-1 w-full text-black"
                            value = {newAirplane.airplane_id || ""}
                            onChange={(e) => handleNewAirplane("airplane_id", Number(e.target.value))}
                        />
                    </td>

                    {/* Number of Seats Input */}
                    <td className="px-4 py-3">
                        <input
                            type="number"
                            className="border border-black rounded-lg px-2 py-1 w-full text-black"
                            value = {newAirplane.num_seats || ""}
                            onChange={(e) => handleNewAirplane("num_seats", Number(e.target.value))}
                        />
                    </td>

                    {/* Manufacturing Company Input */}
                    <td className="px-4 py-3">
                        <input
                            type="string"
                            className="border border-black rounded-lg px-2 py-1 w-full text-black"
                            value = {newAirplane.manufacturing_company || ""}
                            onChange={(e) => handleNewAirplane("manufacturing_company", e.target.value)}
                        />
                    </td>

                    {/* Airplane Age Input */}
                    <td className="px-4 py-3">
                        <input
                            type="number"
                            className="border border-black rounded-lg px-2 py-1 w-full text-black"
                            value = {newAirplane.age|| ""}
                            onChange={(e) => handleNewAirplane("age", Number(e.target.value))}
                        />
                    </td>

                    {/* Add New Flight Button */}
                    <td className="px-4 py-3 text-center">
                        <button
                        onClick={addNewAirplane}
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg shadow-md font-bold"
                        >
                        {saving ? "..." : "Add"}
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        </div>
    );

}