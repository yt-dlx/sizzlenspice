// app/routes/server/page.tsx
"use server";
import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

async function getData() {
  const res = await fetch("https://api.github.com/repos/tannerlinsley/react-query");
  return res.json();
}

export default async function Server() {
  const session = await auth();
  if (!session) redirect("/");

  const queryData = await getData();

  return (
    <React.Fragment>
      <Navbar />
      <div className="mx-auto overflow-hidden bg-[#FFF4E9] max-w-6xl p-2">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-6 text-3xl font-bold text-[#172B25]">Server-side Protected Page</h1>
          <div className="user-info mb-4">
            {session?.user?.image && <img src={session.user.image} alt={`${session.user.name}'s profile`} className="profile-image" />}
            <p className="text-lg text-[#172B25]">
              Welcome, <span className="font-semibold">{session?.user?.name}</span>!
            </p>
            <p className="text-sm text-[#172B25]/70">This page is protected on the server side.</p>
          </div>
          {queryData && (
            <div className="repo-data mb-6">
              <h2 className="text-xl font-semibold mb-2">React Query Repository Data:</h2>
              <p>Stars: {queryData.stargazers_count}</p>
              <p>Forks: {queryData.forks_count}</p>
            </div>
          )}
          <div className="flex flex-col space-y-4">
            <Link href="/server/profile">
              <button className="button-style">Server-Profile</button>
            </Link>
            <Link href="/server/settings">
              <button className="button-style">Server-Setting</button>
            </Link>
            <Link href="/routes">
              <button className="button-style">Back to Routes</button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
