import { airlineTicket } from "@/app/page";

export default function TicketCard( {
  airline_name,
  flight_number,
  flight_departure_date, 
  flight_arrival_date,
  status,
  base_price} : airlineTicket){
  
  return (
    <div className="flex max-w-full max-h-full bg-amber-700">
      <a> {airline_name} </a>
      <a> {flight_number} </a>
      <a> {flight_departure_date.getDate()} </a>
      <a> {flight_arrival_date.getDate()} </a>
      <a> {status} </a>
      <a> {base_price} </a>
    </div>
  )
}