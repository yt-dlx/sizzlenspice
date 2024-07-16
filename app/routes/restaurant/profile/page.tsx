// app/routes/restaurant/profile.tsx
"use client";
import React from "react";
import Link from "next/link";
import Loading from "./loading";
import { MdFastfood } from "react-icons/md";
import { useSession } from "next-auth/react";

const RestaurantProfilePage = () => {
  const { data: session } = useSession();
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  if (loading) return <Loading />;
  if (error) throw new Error(error);
  // =======================================================================================================================================================================
  const Header = () => {};
  const UserData = () => {};
  // =======================================================================================================================================================================
  return (
    <div className="bg-primary p-4">
      <section id="header" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col md:justify-center md:items-center sm:text-center text-secondary font-Playfair">
        <h1 className="text-6xl sm:text-7xl font-bold text-secondary">Welcome, {session?.user?.name}!</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2 font-Kurale">
          Manage your restaurant page here. <br />
          Explore our tools and services.
        </h2>
      </section>
      <section className="flex items-center justify-center">
        <div className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col p-8 m-2 bg-secondary/10 rounded-lg text-secondary">
          <div className="mt-6 space-y-2">
            <Link
              href={"/routes"}
              className="w-full px-4 py-2 transition duration-700 ease-in-out transform rounded-full bg-secondary hover:bg-[#A8B67C] text-primary flex items-center justify-center gap-2 font-Kurale font-bold"
            >
              <MdFastfood size={20} /> Go to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RestaurantProfilePage;
