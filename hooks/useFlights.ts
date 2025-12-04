import { useState, useEffect, useCallback } from "react";
import { Flight, SearchQuery } from "@/types";
import { fetchFlights } from "@/lib/flightService";

export const useFlights = () => {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // default view of flights in next 30 days
    const getFutureFlights = async () => {
        setLoading(true);
        try {
            const today = new Date();
            const thirtyDaysLater = new Date();
            thirtyDaysLater.setDate(today.getDate() + 30);

            const data = await fetchFlights({
                startDate: today.toISOString(),
                endDate: thirtyDaysLater.toISOString()
            });
            
            setFlights(data);

        } catch (error) {
            console.error("Failed to load flights", error);

        } finally {
            setLoading(false);
        }
    };

    const searchFlights = useCallback(async (query?: SearchQuery) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchFlights(query);
            setFlights(data);
        } catch (error) {
            console.error("Error fetching flights:", error);
            setError("Failed to fetch flights");
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        getFutureFlights();
    }, []);

    return { flights, loading, error, searchFlights, reset: getFutureFlights };
};
