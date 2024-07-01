// app/routes/client/profile/page.tsx
"use client";
import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/app/_utils/_components/Navbar";
import Footer from "@/app/_utils/_components/Footer";

export default function ClientProfile() {
  const { data: session } = useSession();
  if (!session) redirect("/");

  return (
    <React.Fragment>
      <Navbar />
      <div className="mx-auto overflow-hidden bg-[#FFF4E9] max-w-6xl p-4 m-4">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-6 text-3xl text-[#172B25]">Client Profile</h1>
          <div className="user-info mb-4">
            <p className="text-lg text-[#172B25]">
              Name: <span className="font-semibold">{session?.user?.name}</span>
            </p>
            <p className="text-lg text-[#172B25]">
              Email: <span className="font-semibold">{session?.user?.email}</span>
            </p>
          </div>
          <div className="flex flex-col space-y-4">
            <Link href="/routes/client">
              <button className="w-full px-4 py-2 transition duration-700 ease-in-out transform rounded-full bg-[#172B25] hover:bg-[#468353] text-[#FFF4E9] hover:text-[#FFF4E9] flex items-center justify-center gap-2">
                Back to Client Page
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
