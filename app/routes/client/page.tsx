// app/client/page.tsx
"use client";
import React from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

export default function Client() {
  const { data: session } = useSession();
  const { data: queryData, isLoading: queryLoading } = useQuery({
    queryKey: ["repoData"],
    queryFn: async () => {
      const res = await fetch("https://api.github.com/repos/tannerlinsley/react-query");
      return res.json();
    },
    enabled: !!session,
  });

  if (queryLoading) {
    return <div className="text-xl font-semibold text-[#172B25]">Loading data...</div>;
  }

  return (
    <React.Fragment>
      <div className="header">
        <h1 className="mb-4 text-2xl font-bold text-[#172B25]">Client-side Protected Page</h1>
      </div>
      <div className="user-info">
        {session?.user?.image && (
          <div className="mb-4">
            <img src={session.user.image} alt={`${session.user.name}'s profile picture`} className="w-24 h-24 rounded-full" />
          </div>
        )}
        <p className="mb-4 text-md text-[#172B25]">
          Welcome, <span className="font-semibold">{session?.user?.name}</span>!
        </p>
        <p className="mb-6 text-sm text-[#172B25]/70">This page is protected on the client side.</p>
      </div>
      {queryData && (
        <div className="mb-6 text-[#172B25] repo-data">
          <h2 className="mb-2 text-xl font-semibold">React Query Repository Data:</h2>
          <p>Stars: {queryData.stargazers_count}</p>
          <p>Forks: {queryData.forks_count}</p>
        </div>
      )}
      <div className="navigation">
        <Link href="/client/profile" className="block px-4 py-2 mb-2 font-bold text-center transition duration-300 ease-in-out bg-[#172B25] rounded-full hover:bg-[#172B25]/80 text-[#FFF4E9]">
          Client-Profile
        </Link>
        <Link href="/client/setting" className="block px-4 py-2 mb-2 font-bold text-center transition duration-300 ease-in-out bg-[#172B25] rounded-full hover:bg-[#172B25]/80 text-[#FFF4E9]">
          Client-Setting
        </Link>
      </div>
    </React.Fragment>
  );
}
