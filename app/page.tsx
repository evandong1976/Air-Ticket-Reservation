"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import Home from './home/page';

export type airlineTicket = {
  airline_name: string;
  flight_number: string;
  flight_departure_date: Date;
  flight_arrival_date: Date;
  status: string;
  base_price: number;
}

export default function Main() {

  const [signedIn, setSignedIn] = useState<boolean>(false);
  
  const getUser = () => {
    
  }

  // gets the flights of that user
  useEffect(() =>{
    getUser();
    if (signedIn) {
      
    }
  });


  if (!signedIn) return <Home/>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen min-w-screen border-2 p-10 px-46">
        <div className="flex flex-col text-5xl text-white min-w-full border-2 border-amber-50">
          <a>
            yeah
          </a>
          <a>
            yeah
          </a>
          <a>
            yeah
          </a>
          <a>
            yeah
          </a>
        </div>
      </div>
    </>
  );
}