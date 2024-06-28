// app/client/profile/page.tsx
"use client";
import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function Profile() {
  const { data: session } = useSession();

  return (
    <React.Fragment>
      <h1 className="mb-4 text-2xl font-bold text-[#172B25]">Profile</h1>
      <div className="mb-6 user-info">
        <p className="mb-4 text-md text-[#172B25]">
          Name: <span className="font-semibold">{session?.user?.name}</span>
        </p>
        <p className="mb-4 text-md text-[#172B25]">
          Email: <span className="font-semibold">{session?.user?.email}</span>
        </p>
      </div>
      <div className="navigation">
        <Link href="/client" className="block px-4 py-2 font-bold text-center transition duration-300 ease-in-out bg-[#172B25] rounded-full hover:bg-[#172B25]/80 text-[#FFF4E9]">
          Back to Client Page
        </Link>
      </div>
    </React.Fragment>
  );
}
