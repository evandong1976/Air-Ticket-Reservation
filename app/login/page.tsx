"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"User" | "Staff">("User");

  const [error, setError] = useState();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (role == "User") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col bg-white p-10 rounded-lg shadow-xl w-full max-w-md">
        {/* Staff / User */}
        <div className="inline-flex justify-center mb-4 cursor-pointer">
          <button
            className={`hover:bg-blue-300 text-gray-800 font-bold py-2 px-4 rounded-l cursor-pointer
              ${
                role == "Staff"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            onClick={() => {
              setRole("Staff");
              setPassword("");
              setEmail("");
            }}
          >
            Staff
          </button>
          <button
            className={` hover:bg-blue-300 text-gray-800 font-bold py-2 px-4 rounded-r cursor-pointer 
              ${
                role == "User"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            onClick={() => {
              setRole("User");
              setPassword("");
            }}
          >
            User
          </button>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Welcome Back!
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Group */}
          <div className={`space-y-2 ${role == "User" ? "" : "hidden"}`}>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
              className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* User Group */}
          <div className={`space-y-2 ${role == "Staff" ? "" : "hidden"}`}>
            <label
              htmlFor="usernameInput"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Group */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              onChange={() => {}}
              required
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-150 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
          >
            Log In
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 pt-4">
            Don&apos;t have an account?
            <a
              href="/signup"
              className="text-blue-600 hover:text-blue-800 font-medium ml-1"
            >
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
