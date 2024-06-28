// app/admin/register/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/utils/components/Navbar";
import Footer from "@/app/utils/components/Footer";
import { useSession } from "next-auth/react";

export default function AdminRegister() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      fetch("/api/check-admin")
        .then((res) => res.json())
        .then((data) => {
          if (data.isAdmin) router.push("/admin/profile");
        });
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/admin");
  };

  if (status === "loading") return <p>Loading...</p>;

  return (
    <React.Fragment>
      <Navbar />
      <div className="mx-auto overflow-hidden bg-[#FFF4E9] max-w-6xl p-2">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-6 text-3xl font-bold text-[#172B25]">Admin Register</h1>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="px-4 py-2 border rounded-md focus:outline-none" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="px-4 py-2 border rounded-md focus:outline-none" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="px-4 py-2 border rounded-md focus:outline-none" />
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold transition duration-700 ease-in-out transform rounded-full bg-[#172B25] hover:bg-[#468353] text-[#FFF4E9] hover:text-[#FFF4E9] flex items-center justify-center gap-2"
            >
              Register
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
