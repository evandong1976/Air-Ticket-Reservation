import { useState, useEffect, useCallback } from "react";
import { Flight, SearchQuery } from "@/types";
import { fetchFlights } from "@/lib/flightService";

export const useFlights = () => {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchFlights = useCallback(async (query?: SearchQuery) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchFlights(query);
            setFlights(data);
        } catch (err) {
            console.error("Error fetching flights:", err);
            setError("Failed to fetch flights");
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        searchFlights();
    }, [searchFlights]);

    return { flights, loading, error, searchFlights };
};
