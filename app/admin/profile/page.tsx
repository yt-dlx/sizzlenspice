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
    fetch("/api/admin")
      .then((res) => res.json())
      .then((data) => {
        if (!data.isAdmin) router.push("/admin");
      });
  }, [session, status, router]);

  if (status === "loading") return null;

  return (
    <React.Fragment>
      <Navbar />
      <div className="mx-auto overflow-hidden bg-[#FFF4E9] max-w-6xl p-2">
        <div className="flex flex-col mb-4 m-4 md:justify-center md:items-center">
          <h1 className="text-6xl sm:text-8xl font-Hatton_Bold font-bold text-[#172B25]">Restaurant Partner</h1>
          <div className="flex flex-col my-10 items-center justify-center text-center">
            {session?.user?.image && <img src={session.user.image} alt={`${session.user.name}'s profile`} className="rounded-3xl" />}
            <ul className="text-lg text-[#172B25]">
              <li>
                Username: <span className="font-semibold">{session?.user?.name}</span>
              </li>
              <li>
                Email: <span className="font-semibold">{session?.user?.email}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
