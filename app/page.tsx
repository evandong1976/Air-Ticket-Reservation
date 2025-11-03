"use client";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-6">Welcome to My App</h1>
        <div className="space-x-4">
            <Link href="./login" className="text-blue-600 hover:text-blue-800 text-lg">
                Go to Login
            </Link>
            <Link href="./signup" className="text-blue-600 hover:text-blue-800 text-lg">
                Go to Sign Up
            </Link>
        </div>
    </div>
  );
}