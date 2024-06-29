// app/admin/backup.tsx
"use client";
import { SiAuthelia } from "react-icons/si";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/app/utils/components/Navbar";
import Footer from "@/app/utils/components/Footer";
import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

const checkCredentials = async (credentials: { email: string; phone: string; password: string }): Promise<boolean> => {
  const response = await fetch("/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) throw new Error("Failed to check credentials");
  const data = await response.json();
  return data.exists;
};

export default function AdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/");
    fetch("/api/admin")
      .then((res) => res.json())
      .then((data) => {
        if (!data.isAdmin) router.push("/");
        else setIsAdmin(true);
      });
  }, [session, status, router]);

  const mutation = useMutation<boolean, Error, { email: string; phone: string; password: string }>({
    mutationFn: checkCredentials,
    onSuccess: (exists) => {
      if (exists) router.push("/admin/profile");
      else router.push("/admin/register");
    },
  });

  if (status === "loading" || !isAdmin) return <p>Loading...</p>;

  return (
    <React.Fragment>
      <Navbar />
      <div className="mx-auto overflow-hidden bg-[#FFF4E9] max-w-6xl p-2">
        <div className="m-2">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-6xl sm:text-8xl font-Hatton_Bold mb-6 font-bold text-[#172B25]">Restaurant Partner Login</h1>
            <img src="/login.gif" className="object-contain h-72 sm:h-80 lg:h-96" alt="Login" />
          </div>
          <form
            onSubmit={(e: React.FormEvent) => {
              e.preventDefault();
              mutation.mutate({ email, phone, password });
            }}
            className="flex flex-col max-w-7xl bg-[#172B25] p-8 rounded-3xl text-[#E6DFD4] shadow-md shadow-[#172B25] pb-10"
          >
            <span className="flex items-center justify-center gap-2 text-xl font-black xl:text-6xl">
              <SiAuthelia size={80} className="animate-pulse text-[#FFF4E9]" /> Verify Your Restaurant Email Registered With Sizzle 'n Spice!
            </span>
            <div className="space-y-2 mt-2">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="registered restaurant email"
                className="w-full px-4 py-2 transition duration-700 ease-in-out transform rounded-full bg-[#468353]/60 hover:bg-[#468353] placeholder-[#FFF4E9] hover:placeholder-[#FFF4E9] flex items-center justify-center text-center gap-2 border-2 border-[#172B25]"
              />
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="registered phone number"
                className="w-full px-4 py-2 transition duration-700 ease-in-out transform rounded-full bg-[#468353]/60 hover:bg-[#468353] placeholder-[#FFF4E9] hover:placeholder-[#FFF4E9] flex items-center justify-center text-center gap-2 border-2 border-[#172B25]"
              />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className="w-full px-4 py-2 transition duration-700 ease-in-out transform rounded-full bg-[#468353]/60 hover:bg-[#468353] placeholder-[#FFF4E9] hover:placeholder-[#FFF4E9] flex items-center justify-center text-center gap-2 border-2 border-[#172B25]"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 transition duration-700 ease-in-out transform rounded-full bg-[#FFF4E9] hover:bg-[#468353] text-[#172B25] hover:text-[#FFF4E9] flex items-center justify-center text-center gap-2"
              >
                {mutation.isPending ? "Checking Credentials..." : "Check Credentials and Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
