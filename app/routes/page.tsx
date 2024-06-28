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
            <Link href="/routes/server">
              <button className="button-style">Go to Server Route</button>
            </Link>
            <Link href="/routes/client">
              <button className="button-style">Go to Client Route</button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
