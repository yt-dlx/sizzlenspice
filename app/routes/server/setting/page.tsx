// app/routes/server/setting/page.tsx
"use server";
import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "@/app/utils/components/Navbar";
import Footer from "@/app/utils/components/Footer";

export default async function ServerSettings() {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <React.Fragment>
      <Navbar />
      <div className="mx-auto overflow-hidden bg-[#FFF4E9] max-w-6xl p-2">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-4 text-2xl font-bold text-[#172B25]">Server Settings</h1>
          <div className="mb-6">
            <p className="text-md text-[#172B25]">This is where you can manage your account setting.</p>
          </div>
          <div className="navigation">
            <Link href="/routes/server">
              <button className="w-full px-4 py-2 font-bold transition duration-700 ease-in-out transform rounded-full bg-[#172B25] hover:bg-[#468353] text-[#FFF4E9] hover:text-[#FFF4E9] flex items-center justify-center gap-2">Back to Server Page</button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
