// app/routes/company/page.tsx.tsx
"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { MdFastfood } from "react-icons/md";
import Link from "next/link";

interface Restaurant {
  id: string;
  email: string;
  address: string;
  pincode: string;
  ownerName: string;
  verified: boolean;
  phoneNumber: string;
  OperatingHoursEnd: string;
  OperatingHoursStart: string;
}

const CompanyPage: React.FC = () => {
  const { data: session } = useSession();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    async function fetchRestaurants() {
      const response = await fetch("/api/restaurant/signin");
      if (!response.ok) throw new Error("Failed to fetch restaurants");
      const data = await response.json();
      setRestaurants(data.restaurants);
    }
    fetchRestaurants();
  }, []);

  const handleVerifyToggle = async (restaurant: Restaurant) => {
    const response = await fetch(`/api/restaurant/signin`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: restaurant.id, verified: !restaurant.verified }),
    });
    if (!response.ok) throw new Error("Failed to update restaurant");
    const updatedRestaurant = await response.json();
    setRestaurants((prev) => prev.map((rest) => (rest.id === restaurant.id ? updatedRestaurant.restaurant : rest)));
  };

  return (
    <div className="bg-gradient-to-b from-primary/30 from-10% via-[#171717] via-40% to-[#131313] to-50% p-4">
      <section id="header" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col md:justify-center md:items-center sm:text-center text-secondary font-Playfair">
        <h1 className="text-6xl sm:text-7xl font-bold text-secondary">Our Company</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2 font-Kurale">
          Welcome to our company page, <span className="underline font-bold font-Playfair">{session?.user?.name}</span>! <br />
          Learn more about us here.
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
          <div className="mt-6">
            <h3 className="text-xl font-bold">Restaurants</h3>
            <ul>
              {restaurants.map((restaurant) => (
                <li key={restaurant.id} className="flex justify-between items-center my-2 p-2 border border-secondary rounded">
                  <div>
                    <p>
                      <strong>Name:</strong> {restaurant.ownerName}
                    </p>
                    <p>
                      <strong>Address:</strong> {restaurant.address}
                    </p>
                    <p>
                      <strong>Phone:</strong> {restaurant.phoneNumber}
                    </p>
                    <p>
                      <strong>Email:</strong> {restaurant.email}
                    </p>
                    <p>
                      <strong>Pincode:</strong> {restaurant.pincode}
                    </p>
                    <p>
                      <strong>Operating Hours:</strong> {restaurant.OperatingHoursStart} - {restaurant.OperatingHoursEnd}
                    </p>
                    <p>
                      <strong>Verified:</strong> {restaurant.verified ? "Yes" : "No"}
                    </p>
                  </div>
                  <button onClick={() => handleVerifyToggle(restaurant)} className="bg-secondary text-primary py-1 px-3 rounded hover:bg-[#a0b07e]">
                    {restaurant.verified ? "Unverify" : "Verify"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CompanyPage;
