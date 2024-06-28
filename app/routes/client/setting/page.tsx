// app/routes/client/settings/page.tsx
"use client";
import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function ClientSettings() {
  const { data: session } = useSession();
  if (!session) redirect("/");

  return (
    <React.Fragment>
      <Navbar />
      <div className="mx-auto overflow-hidden bg-[#FFF4E9] max-w-6xl p-2">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-6 text-3xl font-bold text-[#172B25]">Client Settings</h1>
          <p className="text-lg text-[#172B25]">Manage your account settings here.</p>
          <div className="flex flex-col space-y-4">
            <Link href="/client">
              <button className="button-style">Back to Client Page</button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
