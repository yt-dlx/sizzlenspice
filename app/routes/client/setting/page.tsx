// app/client/settings/page.tsx
"use client";
import React from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function Settings() {
  return (
    <React.Fragment>
      <h1 className="mb-4 text-2xl font-bold text-[#172B25]">Settings</h1>
      <div className="mb-6">
        <p className="text-md text-[#172B25]">This is where you can manage your account settings.</p>
      </div>
      <div className="navigation">
        <Link href="/client" className="block px-4 py-2 font-bold text-center transition duration-300 ease-in-out bg-[#172B25] rounded-full hover:bg-[#172B25]/80 text-[#FFF4E9]">
          Back to Client Page
        </Link>
      </div>
    </React.Fragment>
  );
}
