"use client";

import React, { useState } from "react";

function SignUpForm() {
  const [role, setRole] = useState<"User" | "Staff">("User");

  const [userFormData, setUserFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Submitted!", userFormData);
    setUserFormData({ username: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col bg-white p-10 rounded-lg shadow-xl w-full max-w-md">
        <div className="inline-flex justify-center mb-4 cursor-pointer">
          { /* Staff / User */}
          <button
            className={`hover:bg-blue-300 text-gray-800 font-bold py-2 px-4 rounded-l cursor-pointer
              ${
                role == "Staff"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            onClick={() => {
              setRole("Staff");
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
            }}
          >
            User
          </button>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Your Account
        </h2>

        <form className="space-y-6 text-black" onSubmit={handleSubmit}>
          {/* Username Group */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={userFormData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              name="password"
              value={userFormData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Sign Up
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 pt-2">
            Already have an account?
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-800 font-medium ml-1"
            >
              Log In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUpForm;
