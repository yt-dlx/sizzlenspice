// app/admin/profile/page.tsx
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/app/utils/components/Navbar";
import Footer from "@/app/utils/components/Footer";

export default function AdminProfile() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/");

    fetch("/api/check-admin")
      .then((res) => res.json())
      .then((data) => {
        if (!data.isAdmin) router.push("/admin");
      });
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <React.Fragment>
      <Navbar />
      <div className="mx-auto overflow-hidden bg-[#FFF4E9] max-w-6xl p-2">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-6 text-3xl font-bold text-[#172B25]">Client Profile</h1>
          <div className="user-info mb-4">
            <p className="text-lg text-[#172B25]">
              Name: <span className="font-semibold">{session?.user?.name}</span>
            </p>
            <p className="text-lg text-[#172B25]">
              Email: <span className="font-semibold">{session?.user?.email}</span>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
