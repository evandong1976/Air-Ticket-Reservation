import { supabase } from "./supabaseClient";
import { Flight, SearchQuery } from "@/types";

export const fetchFlights = async (query?: SearchQuery): Promise<Flight[]> => {
    let queryBuilder = supabase
        .from("flight")
        .select("*")
        .order("departure_date_time", { ascending: true });

    // optionally applied filters for flight search
    if (query) {
        // filter by airline name
        if(query.airline) {
            queryBuilder = queryBuilder.ilike("airline_name", `%${query.airline}%`)
        }

        // filter by departure airport code
        if(query.departure) {
            queryBuilder = queryBuilder.ilike("departure_airport_code",`%${query.departure}%`)
        }

        // filter by arrival airport code
        if(query.arrival) {
            queryBuilder = queryBuilder.ilike("arrival_airport_code", `%${query.arrival}%`)
        }

        // specific date search: filter by departure time
        if (query.date) {
            queryBuilder = queryBuilder
                .gte("departure_date_time", `${query.date}T00:00:00Z`)
                .lte("departure_date_time", `${query.date}T23:59:59Z`);
        }

        // range search (for 30-day future flight window)
        if (query.startDate) {
            queryBuilder = queryBuilder.gte("departure_date_time", query.startDate);
        }

        if (query.endDate) {
            queryBuilder = queryBuilder.lte("departure_date_time", query.endDate);
        }

    }

    const { data, error } = await queryBuilder;
    if (error) throw error;
    return data as Flight[];
};
