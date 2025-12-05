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
        startDate: "",
        endDate: "",
        roundTrip: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-8 flex flex-col text-black xl:flex-row flex-wrap gap-4 w-full max-w-6xl items-center"
        >   
            {/* Airline Name Field*/}
            <input
                type="text"
                placeholder="Airline Name"
                value={query.airline}
                onChange={(e) => setQuery({ ...query, airline: e.target.value })}
                className="flex-1 border border-gray-300 rounded-lg px-3 text-black py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {/* Departure Airport Code Field*/}
            <input
                type="text"
                placeholder="Departure Code"
                value={query.departure}
                onChange={(e) => setQuery({ ...query, departure: e.target.value })}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {/* Arrival Airport Code Field*/}
            <input
                type="text"
                placeholder="Arrival Code"
                value={query.arrival}
                onChange={(e) => setQuery({ ...query, arrival: e.target.value })}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {/* Departure Date and Time Field*/}
            <input
                type="date"
                value={query.startDate}
                onChange={(e) => setQuery({ ...query, startDate: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none text-black focus:ring-2 focus:ring-blue-400"
            />
            {/* Arrival Date and Time Field*/}
            <input
                type="date"
                value={query.endDate}
                onChange={(e) => setQuery({ ...query, endDate: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none text-black focus:ring-2 focus:ring-blue-400"
            />
            {/* Roundtrip Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                <input
                    type="checkbox"
                    checked={query.roundTrip}
                    onChange={(e) => setQuery({ ...query, roundTrip: e.target.checked })}
                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="font-medium text-sm text-gray-700">Roundtrip</span>
            </label>
            {/* Submit Button */}
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 cursor-pointer rounded-lg font-semibold transition"
            >
                Search
            </button>
        </form>
    );
}
