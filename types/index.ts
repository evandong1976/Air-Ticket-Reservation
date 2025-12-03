export interface Flight {
    flight_number: number;
    base_price: number;
    departure_date_time: string;
    arrival_date_time: string;
    airplane_id: number;
    arrival_airport_code: string;
    status: string;
    departure_airport_code: string;
    airline_name: string;
}

export interface SearchQuery {
    airline: string;
    departure: string;
    arrival: string;
    date: string;
}

export interface Airplane {
    airline_name: string;
    airplane_id: number;
    num_seats: number;
    manufacturing_company: string;
    age: number;
}