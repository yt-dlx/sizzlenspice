// app/server/page.tsx
"use server";
import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Server() {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold text-[#172B25]">Server-side Protected Page</h1>
      <div className="mb-6 user-info">
        {session.user?.image && (
          <div className="mb-4">
            <img src={session.user.image} alt={`${session.user.name}'s profile picture`} className="w-24 h-24 rounded-full" />
          </div>
        )}
        <p className="mb-4 text-md text-[#172B25]">
          Welcome, <span className="font-semibold">{session.user?.name}</span>!
        </p>
        <p className="text-sm text-[#172B25]/70">This page is protected on the server side.</p>
      </div>
      <div className="navigation">
        <Link href="/server/profile" className="block px-4 py-2 mb-2 font-bold text-center transition duration-300 ease-in-out bg-[#172B25] rounded-full hover:bg-[#172B25]/80 text-[#FFF4E9]">
          Server-Profile
        </Link>
        <Link href="/server/setting" className="block px-4 py-2 mb-2 font-bold text-center transition duration-300 ease-in-out bg-[#172B25] rounded-full hover:bg-[#172B25]/80 text-[#FFF4E9]">
          Server-Setting
        </Link>
        <Link href="/client" className="block px-4 py-2 font-bold text-center transition duration-300 ease-in-out bg-[#172B25] rounded-full hover:bg-[#172B25]/80 text-[#FFF4E9]">
          Go to Client Routes
        </Link>
      </div>
    </>
  );
}
