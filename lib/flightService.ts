import { supabase } from "./supabaseClient";
import { Flight, SearchQuery } from "@/types";

export const fetchFlights = async (query?: SearchQuery): Promise<Flight[]> => {
    let queryBuilder = supabase
        .from("flight")
        .select("*")
        .order("departure_date_time", { ascending: true });

    if (query) {
        queryBuilder = queryBuilder
            .ilike("airline_name", query.airline ? `%${query.airline}%` : "%*")
            .ilike(
                "departure_airport_code",
                query.departure ? `%${query.departure}%` : "%*"
            )
            .ilike(
                "arrival_airport_code",
                query.arrival ? `%${query.arrival}%` : "%*"
            )
            .gte(
                "departure_date_time",
                query.date ? `${query.date}T00:00:00Z` : "1970-01-01T00:00:00Z"
            )
            .lte(
                "departure_date_time",
                query.date ? `${query.date}T23:59:59Z` : "2100-01-01T00:00:00Z"
            );
    }

    const { data, error } = await queryBuilder;

    if (error) {
        throw error;
    }

    return data as Flight[];
};
