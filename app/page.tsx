"use client";

import HomePage from "@/components/homepage";

export type flight = {
  airline_name: string;
  flight_number: string;
  flight_departure_date: Date;
  flight_arrival_date: Date;
  status: string;
  base_price: number;
  departure: string;
  arrival: string;
};

export default function Main() {
  return (
    <HomePage />
  );
}
