// app/routes/page.tsx
"use server";
import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "@/app/utils/components/Navbar";
import Footer from "@/app/utils/components/Footer";

export default async function RoutesPage() {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <React.Fragment>
      <Navbar />
      <div className="mx-auto overflow-hidden bg-[#FFF4E9] max-w-6xl p-2">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-6 text-3xl font-bold text-[#172B25]">Routes Page</h1>
          {session ? (
            <p className="mb-4 text-lg text-[#172B25]">
              Welcome, <span className="font-semibold">{session.user?.name}</span>!
            </p>
          ) : (
            <p className="mb-4 text-lg text-[#172B25]">You are not signed in.</p>
          )}
          <div className="flex flex-col space-y-4">
            <Link href="/routes/server">
              <button className="w-full px-4 py-2 font-bold transition duration-700 ease-in-out transform rounded-full bg-[#172B25] hover:bg-[#468353] text-[#FFF4E9] hover:text-[#FFF4E9] flex items-center justify-center gap-2">
                Go to Server Route
              </button>
            </Link>
            <Link href="/routes/client">
              <button className="w-full px-4 py-2 font-bold transition duration-700 ease-in-out transform rounded-full bg-[#172B25] hover:bg-[#468353] text-[#FFF4E9] hover:text-[#FFF4E9] flex items-center justify-center gap-2">
                Go to Client Route
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
