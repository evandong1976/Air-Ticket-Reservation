"use client"

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function monthlyReport() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    
    
    interface Ticket {
        id: number,
        purchase_date_time: string;
    }

    const[tickets, setTickets] = useState<Ticket[]>([]);

    useEffect(() => {
        const loadTickets = async () => {
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

            const { data, error } = await supabase
                .from("ticket")
                .select("id, purchase_date_time")
                .gte("purchase_date_time", oneYearAgo.toISOString())
                .order("purchase_date_time", { ascending: false }); // newest tickets load first
                
                console.log("Data returned:", data); // Check if this is []
                console.log("Error returned:", error); // Check if this exists

            if (data && !error) setTickets(data);
            setLoading(false);
        }
        loadTickets();
    }, []);

    const getMonthlySales = () => {
        const counts: { [key: string]: number } = {};

        tickets.forEach((ticket) => {
            const date = new Date(ticket.purchase_date_time);
            const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
            counts[monthYear] = (counts[monthYear] || 0) + 1;
        });

        // Convert to array
        return Object.entries(counts).map(([month, count]) => ({ 
            month, 
            count 
        }));
    };

    const monthlyData = getMonthlySales();

    if (loading) return <div className="p-10">Loading...</div>;

    return (
        <div className="p-10 min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center mb-4">Ticket Report Details</h1>
            {/* Display total tickets in past year */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8 w-full max-w-4xl flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-700">
                        Total Tickets Sold In Past Year: {tickets.length}
                    </h2>
                </div>
            </div>
        

            {/* Monthly Sales Table */}
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full text-sm text-left">
                    {/* Monthly Sales Table Column Headers */}
                    <thead className="bg-gray-100 text-gray-700 font-semibold uppercase">
                        <tr>
                            <th className="px-6 py-4 border-b">Month</th>
                            <th className="px-6 py-4 border-b text-right">Tickets Sold</th>
                        </tr>
                    </thead>

                    {/* Monthly Sales Table Body */}
                    <tbody className="divide-y divide-gray-200">
                        {monthlyData.length > 0 ? (
                            monthlyData.map((row) => (
                                <tr key={row.month} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{row.month}</td>
                                    <td className="px-6 py-4 text-gray-600 text-right">{row.count}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={2} className="p-6 text-center text-gray-400">
                                No sales found in the past year.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}