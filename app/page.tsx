"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';

export type airlineTicket = {
  airline_name: string;
  flight_number: string;
  flight_departure_date: Date;
  flight_arrival_date: Date;
  status: string;
  base_price: number;
}

export default function Home() {

  const [signedIn, setSignedIn] = useState<boolean>(false);
  
  const getUser = () => {
    
  }

  // gets the flights of that user
  useEffect(() =>{
    getUser();
    if (signedIn) {

    }
  });


  if (signedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-black text-4xl font-bold mb-6">Welcome to My App</h1>
        <div className="space-x-4">
            <Link href="./login" className="text-blue-600 hover:text-blue-800 text-lg">
                Go to Login
            </Link>
            <Link href="./signup" className="text-blue-600 hover:text-blue-800 text-lg">
                Go to Sign Up
            </Link>
        </div>
      </div>
    )
  }

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