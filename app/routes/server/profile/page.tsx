// app/server/profile/page.tsx
"use server";
import React from "react";
import Link from "next/link";
import { auth } from "@/auth";

export default async function Profile() {
  const session = await auth();

  if (!session) {
    return <div className="text-xl font-semibold text-[#172B25]">Not authenticated</div>;
  }

  return (
    <>
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
          Back to Server Page
        </Link>
      </div>
    </>
  );
}
