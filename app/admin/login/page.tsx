// app/admin/login/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/app/utils/components/Navbar";
import Footer from "@/app/utils/components/Footer";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/admin");
  };

  return (
    <React.Fragment>
      <Navbar />
      <div className="mx-auto overflow-hidden bg-[#FFF4E9] max-w-6xl p-2">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-6 text-3xl font-bold text-[#172B25]">Admin Login</h1>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="px-4 py-2 border rounded-md focus:outline-none" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="px-4 py-2 border rounded-md focus:outline-none" />
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold transition duration-700 ease-in-out transform rounded-full bg-[#FFF4E9] hover:bg-[#468353] text-[#172B25] hover:text-[#FFF4E9] flex items-center justify-center gap-2"
            >
              Login
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
