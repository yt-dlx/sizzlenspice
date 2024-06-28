// app/server/settings/page.tsx
"use server";
import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default async function Settings() {
  const session = await auth();

  if (!session) {
    return <div className="text-xl font-semibold text-[#172B25]">Not authenticated</div>;
  }

  return (
    <React.Fragment>
      <Navbar />
      <h1 className="mb-4 text-2xl font-bold text-[#172B25]">Settings</h1>
      <div className="mb-6">
        <p className="text-md text-[#172B25]">This is where you can manage your account settings.</p>
      </div>
      <div className="navigation">
        <Link href="/client" className="block px-4 py-2 font-bold text-center transition duration-300 ease-in-out bg-[#172B25] rounded-full hover:bg-[#172B25]/80 text-[#FFF4E9]">
          Back to Server Page
        </Link>
      </div>
      <Footer />
    </React.Fragment>
  );
}
