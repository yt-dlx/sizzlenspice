// app/admin/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/utils/components/Navbar";
import Footer from "@/app/utils/components/Footer";
import { useMutation } from "@tanstack/react-query";

const checkEmail = async (email: string): Promise<boolean> => {
  const response = await fetch("/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) throw new Error("Failed to check email");
  const data = await response.json();
  return data.exists;
};

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const mutation = useMutation<boolean, Error, string>({
    mutationFn: checkEmail,
    onSuccess: (exists) => {
      if (exists) router.push("/admin/login");
      else router.push("/admin/register");
    },
  });

  return (
    <React.Fragment>
      <Navbar />
      <div className="mx-auto overflow-hidden bg-[#FFF4E9] max-w-6xl p-2">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-6 text-3xl font-bold text-[#172B25]">Admin Page</h1>
          <form
            onSubmit={(e: React.FormEvent) => {
              e.preventDefault();
              mutation.mutate(email);
            }}
            className="mb-4"
          >
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 mb-4 border rounded" />
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold transition duration-700 ease-in-out transform rounded-full bg-[#172B25] hover:bg-[#468353] text-[#FFF4E9] hover:text-[#FFF4E9] flex items-center justify-center gap-2"
            >
              Check Email
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
