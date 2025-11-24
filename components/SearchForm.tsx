import { useState } from "react";
import { SearchQuery } from "@/types";

interface SearchFormProps {
    onSearch: (query: SearchQuery) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
    const [query, setQuery] = useState<SearchQuery>({
        airline: "",
        departure: "",
        arrival: "",
        date: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-8 flex flex-col text-black md:flex-row gap-4 w-full max-w-6xl"
        >
            <input
                type="text"
                placeholder="Airline"
                value={query.airline}
                onChange={(e) => setQuery({ ...query, airline: e.target.value })}
                className="flex-1 border border-gray-300 rounded-lg px-4 text-black py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
                type="text"
                placeholder="Departure"
                value={query.departure}
                onChange={(e) => setQuery({ ...query, departure: e.target.value })}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
                type="text"
                placeholder="Arrival"
                value={query.arrival}
                onChange={(e) => setQuery({ ...query, arrival: e.target.value })}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
                type="date"
                value={query.date}
                onChange={(e) => setQuery({ ...query, date: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none text-black focus:ring-2 focus:ring-blue-400"
            />
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 cursor-pointer rounded-lg font-semibold transition"
            >
                Search
            </button>
        </form>
    );
}
