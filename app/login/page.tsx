"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"User" | "Staff">("User");

  const [error, setError] = useState("");

  const handleCustomerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email, password)
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // if there is an error
    if (authError) {
      setError(authError.message);
      console.log(authError.message)
      return;
    }

    // check if email entered was in the customer table (and not staff table)
    if (data.user?.email) {
      const { data: customerData } = await supabase
        .from("customer")
        .select("email")
        .eq("email", data.user.email)
        .maybeSingle();

      // if they are not a customer (thus they are staff), sign them out
      if (!customerData) {
        await supabase.auth.signOut();
        setError("Invalid login credentials");
        return;
      }
    }
    // successful sign-in -> redirect to homepage
    router.push("/");
  };

  const handleStaffSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Get the email for the given username
    const { data: staffData, error: staffError } = await supabase
      .from("airline_staff")
      .select("email_address")
      .eq("username", username)
      .single();

    if (staffError) {
      setError("Invalid login credentials");
      return;
    }

    const retrieved_email = staffData.email_address;

    // 2. Sign in using that email
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: retrieved_email,
        password: password,
      });

    if (signInError) {
      setError("Invalid login credentials");
      return;
    }

    router.push("/");

  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col bg-white p-10 rounded-lg shadow-xl w-full max-w-md">
        {/* Staff / User */}
        <div className="inline-flex justify-center mb-4 cursor-pointer">
          <button
            className={`hover:bg-green-300 text-gray-800 font-bold py-2 px-4 rounded-l cursor-pointer
              ${
                role == "Staff"
                  ? "bg-green-500 text-white"
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
            className={` hover:bg-green-300 text-gray-800 font-bold py-2 px-4 cursor-pointer 
              ${
                role == "User"
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            onClick={() => {
              setRole("User");
              setPassword("");
            }}
          >
            User
          </button>
          <button
            className="hover:bg-green-300 bg-gray-300 text-gray-800 rounder-r font-bold py-2 px-4 rounded-r cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          >
            Home
          </button>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Welcome Back!
        </h2>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            return role === "Staff"
              ? handleStaffSubmit(e)
              : handleCustomerSubmit(e);
          }}
        >
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
              required={role == "User"}
              className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
              required={role == "Staff"}
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
              onChange={(e) => {setPassword(e.target.value);}}
              required
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-150 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
          >
            Log In
          </button>

          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}

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
