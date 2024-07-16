// app/routes/restaurant/profile.tsx
"use client";
import React from "react";
import Loading from "./loading";
import { useSession } from "next-auth/react";

const RestaurantProfilePage = () => {
  const { data: session } = useSession();
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  if (loading) return <Loading />;
  if (error) throw new Error(error);
  // =======================================================================================================================================================================
  const Header = () => {
    return (
      <section id="header" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col md:justify-center md:items-center sm:text-center text-secondary font-Playfair">
        <h1 className="text-6xl sm:text-7xl font-bold text-secondary">Welcome, {session?.user?.name}!</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2 font-Kurale">
          Manage your restaurant page here. <br />
          Explore our tools and services.
        </h2>
      </section>
    );
  };
  // =======================================================================================================================================================================
  return (
    <div className="bg-primary p-4">
      <Header />
    </div>
  );
};

export default RestaurantProfilePage;
