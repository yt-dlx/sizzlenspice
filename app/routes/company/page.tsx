// app/routes/company/page.tsx
"use client";
import Link from "next/link";
import Loading from "./loading";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { MdFastfood, MdEdit, MdSave } from "react-icons/md";

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
  const [isLoading, setIsLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [editingRestaurant, setEditingRestaurant] = useState<string | null>(null);
  const [editedRestaurant, setEditedRestaurant] = useState<Partial<Restaurant>>({});

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const response = await fetch("/api/restaurant/signin");
        if (!response.ok) throw new Error("Failed to fetch restaurants");
        const data = await response.json();
        setRestaurants(data.restaurants);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setIsLoading(false);
      }
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

  const handleEditToggle = (restaurant: Restaurant) => {
    if (editingRestaurant === restaurant.id) {
      setEditingRestaurant(null);
      setEditedRestaurant({});
    } else {
      setEditingRestaurant(restaurant.id);
      setEditedRestaurant(restaurant);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedRestaurant((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (restaurant: Restaurant) => {
    const response = await fetch(`/api/restaurant/signin`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editedRestaurant, id: restaurant.id }),
    });
    if (!response.ok) throw new Error("Failed to update restaurant");
    const updatedRestaurant = await response.json();
    setRestaurants((prev) => prev.map((rest) => (rest.id === restaurant.id ? updatedRestaurant.restaurant : rest)));
    setEditingRestaurant(null);
    setEditedRestaurant({});
  };

  if (isLoading) return <Loading />;

  return (
    <div className="bg-gradient-to-b from-primary/30 from-10% via-[#171717] via-40% to-[#131313] to-50% p-4 min-h-screen text-secondary">
      <section id="header" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col md:justify-center md:items-center sm:text-center font-Playfair mb-8">
        <h1 className="text-6xl sm:text-7xl font-bold">Our Company</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2 font-Kurale">
          Welcome to our company page, <span className="underline font-bold font-Playfair">{session?.user?.name}</span>! <br />
          Learn more about us here.
        </h2>
      </section>
      <section className="flex items-center justify-center">
        <div className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col p-8 bg-secondary/10 rounded-lg">
          <div className="mb-6">
            <Link
              href={"/routes"}
              className="w-full px-4 py-2 transition duration-700 ease-in-out transform rounded-full bg-secondary hover:bg-[#A8B67C] text-primary flex items-center justify-center gap-2 font-Kurale font-bold"
            >
              <MdFastfood size={20} /> Go to Home
            </Link>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Restaurants</h3>
            <ul className="space-y-4">
              {restaurants.map((restaurant) => (
                <li key={restaurant.id} className="border border-secondary rounded p-4">
                  {editingRestaurant === restaurant.id ? (
                    <div className="space-y-2">
                      <input type="text" name="ownerName" value={editedRestaurant.ownerName || ""} onChange={handleInputChange} className="w-full bg-secondary/20 p-2 rounded" placeholder="Name" />
                      <input type="text" name="address" value={editedRestaurant.address || ""} onChange={handleInputChange} className="w-full bg-secondary/20 p-2 rounded" placeholder="Address" />
                      <input
                        type="text"
                        name="phoneNumber"
                        value={editedRestaurant.phoneNumber || ""}
                        onChange={handleInputChange}
                        className="w-full bg-secondary/20 p-2 rounded"
                        placeholder="Phone"
                      />
                      <input type="text" name="email" value={editedRestaurant.email || ""} onChange={handleInputChange} className="w-full bg-secondary/20 p-2 rounded" placeholder="Email" />
                      <input type="text" name="pincode" value={editedRestaurant.pincode || ""} onChange={handleInputChange} className="w-full bg-secondary/20 p-2 rounded" placeholder="Pincode" />
                      <div className="flex gap-2">
                        <input type="time" name="OperatingHoursStart" value={editedRestaurant.OperatingHoursStart || ""} onChange={handleInputChange} className="w-1/2 bg-secondary/20 p-2 rounded" />
                        <input type="time" name="OperatingHoursEnd" value={editedRestaurant.OperatingHoursEnd || ""} onChange={handleInputChange} className="w-1/2 bg-secondary/20 p-2 rounded" />
                      </div>
                    </div>
                  ) : (
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
                  )}
                  <div className="flex justify-end mt-4 space-x-2">
                    {editingRestaurant === restaurant.id ? (
                      <button onClick={() => handleSave(restaurant)} className="bg-secondary text-primary py-1 px-3 rounded hover:bg-[#a0b07e] transition duration-300">
                        <MdSave className="inline-block mr-1" /> Save
                      </button>
                    ) : (
                      <button onClick={() => handleEditToggle(restaurant)} className="bg-secondary text-primary py-1 px-3 rounded hover:bg-[#a0b07e] transition duration-300">
                        <MdEdit className="inline-block mr-1" /> Edit
                      </button>
                    )}
                    <button onClick={() => handleVerifyToggle(restaurant)} className="bg-secondary text-primary py-1 px-3 rounded hover:bg-[#a0b07e] transition duration-300">
                      {restaurant.verified ? "Unverify" : "Verify"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <footer className="mt-8 text-center">
        <p className="font-Playfair text-lg">Sizzle 'n Spice</p>
        <p className="text-sm">Copyright © 2024 - All right reserved</p>
      </footer>
    </div>
  );
};

export default CompanyPage;
