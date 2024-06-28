// app/routes/server/profile/page.tsx
"use server";
import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default async function ServerProfile() {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <React.Fragment>
      <Navbar />
      <div className="mx-auto overflow-hidden bg-[#FFF4E9] max-w-6xl p-2">
        <h1 className="mb-4 text-2xl font-bold text-[#172B25]">Server Profile</h1>
        <div className="mb-6 user-info">
          <p className="mb-4 text-md text-[#172B25]">
            Name: <span className="font-semibold">{session?.user?.name}</span>
          </p>
          <p className="mb-4 text-md text-[#172B25]">
            Email: <span className="font-semibold">{session?.user?.email}</span>
          </p>
        </div>
        <div className="navigation">
          <Link href="/routes/server">
            <button className="button-style">Back to Server Page</button>
          </Link>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
