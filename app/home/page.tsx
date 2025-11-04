import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          ✈️ Air Ticket Reservation
        </h1>
        <p className="text-gray-600 mb-8">
          Book your flights quickly and securely.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all duration-200"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
