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
    <React.Fragment>
      <div className="max-w-full h-screen mx-auto overflow-hidden bg-[#171717] shadow-[0_10px_200px_#565E50]">
        <h1 className="mb-4 text-2xl font-bold text-[#E9F0CD]">Server-side Protected Page</h1>
        <section className="mb-6 user-info">
          {session.user?.image && (
            <div className="mb-4">
              <img src={session.user.image} alt={`${session.user.name}'s profile picture`} className="w-24 h-24 rounded-full" />
            </div>
          )}
          <p className="mb-4 text-md text-[#E9F0CD]">
            Welcome, <span className="font-semibold">{session.user?.name}</span>!
          </p>
          <p className="text-sm text-[#E9F0CD]">This page is protected on the server side.</p>
        </section>
        <section className="navigation">
          <Link href="/" className="block px-4 py-2 font-bold text-center transition duration-300 ease-in-out bg-blue-500 rounded-full hover:bg-blue-600 text-[#E9F0CD]">
            Back to Home
          </Link>
        </section>
      </div>
    </React.Fragment>
  );
}
