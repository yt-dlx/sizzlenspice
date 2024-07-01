// app/client/page.tsx
"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

export default function Client() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: queryData, isLoading: queryLoading } = useQuery({
    queryKey: ["repoData"],
    queryFn: async () => {
      const res = await fetch("https://api.github.com/repos/tannerlinsley/react-query");
      return res.json();
    },
    enabled: !!session,
  });

  React.useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  if (status === "loading" || queryLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-2xl font-semibold text-[#E9F0CD]">Loading...</div>
      </div>
    );
  }
  if (!session) return null;

  return (
    <React.Fragment>
      <div className="max-w-full h-screen mx-auto overflow-hidden bg-[#171717] shadow-[0_10px_200px_#565E50]">
        <section className="header">
          <h1 className="mb-4 text-2xl font-bold text-[#E9F0CD]">Client-side Protected Page</h1>
        </section>
        <section className="user-info">
          {session.user?.image && (
            <div className="mb-4">
              <img
                src={session.user.image}
                alt={`${session.user.name}'s profile picture`}
                className="w-24 h-24 rounded-full"
              />
            </div>
          )}
          <p className="mb-4 text-md text-[#E9F0CD]">
            Welcome, <span className="font-semibold">{session.user?.name}</span>!
          </p>
          <p className="mb-6 text-sm text-[#E9F0CD]">This page is protected on the client side.</p>
        </section>
        {queryData && (
          <section className="mb-6 text-black repo-data dark:text-[#E9F0CD]">
            <h2 className="mb-2 text-xl font-semibold">React Query Repository Data:</h2>
            <p>Stars: {queryData.stargazers_count}</p>
            <p>Forks: {queryData.forks_count}</p>
          </section>
        )}
        <section className="navigation">
          <Link
            href="/"
            className="block px-4 py-2 font-bold text-center transition duration-300 ease-in-out bg-green-500 rounded-full hover:bg-green-600 text-[#E9F0CD]"
          >
            Back to Home
          </Link>
        </section>
      </div>
    </React.Fragment>
  );
}
