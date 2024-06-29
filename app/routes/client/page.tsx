// app/routes/client/page.tsx
"use client";
import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/app/_utils/_components/Navbar";
import Footer from "@/app/_utils/_components/Footer";
import { useQuery } from "@tanstack/react-query";

export default function Client() {
  const { data: session } = useSession();
  if (!session) redirect("/");

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
      <Navbar />
      <div className="mx-auto overflow-hidden bg-[#FFF4E9] max-w-6xl p-4">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-6 text-3xl font-bold text-[#172B25]">Client-side Protected Page</h1>
          <div className="user-info mb-4">
            {session?.user?.image && <img src={session.user.image} alt={`${session.user.name}'s profile`} className="profile-image" />}
            <p className="text-lg text-[#172B25]">
              Welcome, <span className="font-semibold">{session?.user?.name}</span>!
            </p>
            <p className="text-sm text-[#172B25]/70">This page is protected on the client side.</p>
          </div>
          {queryData && (
            <div className="repo-data mb-6">
              <h2 className="text-xl font-semibold mb-2">React Query Repository Data:</h2>
              <p>Stars: {queryData.stargazers_count}</p>
              <p>Forks: {queryData.forks_count}</p>
            </div>
          )}
          <div className="flex flex-col space-y-4">
            <Link href="/routes/client/profile">
              <button className="w-full px-4 py-2 font-bold transition duration-700 ease-in-out transform rounded-full bg-[#172B25] hover:bg-[#468353] text-[#FFF4E9] hover:text-[#FFF4E9] flex items-center justify-center gap-2">
                Client-Profile
              </button>
            </Link>
            <Link href="/routes/client/setting">
              <button className="w-full px-4 py-2 font-bold transition duration-700 ease-in-out transform rounded-full bg-[#172B25] hover:bg-[#468353] text-[#FFF4E9] hover:text-[#FFF4E9] flex items-center justify-center gap-2">
                Client-Setting
              </button>
            </Link>
            <Link href="/routes">
              <button className="w-full px-4 py-2 font-bold transition duration-700 ease-in-out transform rounded-full bg-[#172B25] hover:bg-[#468353] text-[#FFF4E9] hover:text-[#FFF4E9] flex items-center justify-center gap-2">
                Back to Routes
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
