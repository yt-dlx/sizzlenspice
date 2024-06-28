// app/routes/page.tsx
"use server";
import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default async function RoutesPage() {
  const session = await auth();

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
            <Link href="/routes/server" className="px-6 py-3 font-bold text-center transition duration-300 ease-in-out bg-[#172B25] rounded-full hover:bg-[#172B25]/80 text-[#FFF4E9]">
              Go to Server Route
            </Link>
            <Link href="/routes/client" className="px-6 py-3 font-bold text-center transition duration-300 ease-in-out bg-[#172B25] rounded-full hover:bg-[#172B25]/80 text-[#FFF4E9]">
              Go to Client Route
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
