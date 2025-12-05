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

        if (query.departure && query.arrival) {
            // roundtrip filtering (considers paths from airport A->B and B->A)
            if (query.roundTrip) {
                queryBuilder = queryBuilder.or(
                    // flights from airport A->B
                    `and(departure_airport_code.ilike.%${query.departure}%,
                         arrival_airport_code.ilike.%${query.arrival}%),`
                    +
                    // flights from airport B->A
                    `and(departure_airport_code.ilike.%${query.arrival}%,
                         arrival_airport_code.ilike.%${query.departure}%)`
                );
            // once way filtering (considers paths from airport A->B only)
            } else {
                queryBuilder = queryBuilder.ilike("departure_airport_code",`%${query.departure}%`);
                queryBuilder = queryBuilder.ilike("arrival_airport_code", `%${query.arrival}%`);
            }
        }

        // date range start
        if (query.startDate) {
            queryBuilder = queryBuilder.gte("departure_date_time", query.startDate);
        }

        // date range end
        if (query.endDate) {
            queryBuilder = queryBuilder.lte("departure_date_time", query.endDate);
        }

    }

    const { data, error } = await queryBuilder;
    if (error) throw error;
    return data as Flight[];
};
