// app/routes/restaurant/profile.tsx
"use client";
import React from "react";
import Image from "next/image";
import Loading from "./loading";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { HiLocationMarker, HiMail, HiPhone, HiCreditCard, HiUser, HiClock, HiCheckCircle, HiXCircle } from "react-icons/hi";

interface Restaurant {
  id: string;
  email: string;
  address: string;
  pincode: string;
  ownerName: string;
  phoneNumber: string;
  OperatingHoursStart: string;
  OperatingHoursEnd: string;
  verified: boolean;
}

const RestaurantProfilePage = () => {
  const { data: session } = useSession();
  const {
    data: restaurantData,
    isLoading,
    error,
  } = useQuery<Restaurant, Error>({
    queryKey: ["restaurant", session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) return null;
      const response = await fetch("/api/restaurant/signin");
      if (!response.ok) throw new Error("Failed to fetch restaurant data");
      const data = await response.json();
      const userRestaurant = data.restaurants.find((restaurant: Restaurant) => restaurant.email === session?.user?.email);
      return userRestaurant;
    },
    enabled: !!session?.user?.email,
  });
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const parsedHours = parseInt(hours, 10);
    const ampm = parsedHours >= 12 ? "PM" : "AM";
    const formattedHours = parsedHours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };
  if (isLoading) return <Loading />;
  if (error) throw new Error(error.message);
  // =======================================================================================================================================================================
  const Header = () => {
    return (
      <section id="header" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col md:justify-center md:items-center sm:text-center text-secondary">
        <h1 className="text-6xl sm:text-7xl text-secondary">Welcome, {session?.user?.name}!</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2">
          Manage your restaurant page here. <br />
          Explore our tools and services.
        </h2>
        <Image src="/sns.gif" alt="sns" width={300} height={300} className="mx-auto object-cover h-80 sm:h-96 lg:h-112" />
      </section>
    );
  };
  const RestaurantInformation = () => {
    return (
      <>
        {restaurantData && (
          <section id="restaurant-info" className="flex items-center justify-center">
            <section className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col m-2 bg-secondary p-2 rounded-2xl text-primary shadow-md shadow-secondary">
              <div className="bg-primary/20 rounded-2xl p-4">
                <h4 className="font-bold mb-3 text-3xl border-b border-primary pb-2">Restaurant Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <HiLocationMarker size={20} className="inline-flex mr-2" />
                    <p>
                      <span className="font-semibold">Address:</span> {restaurantData.address}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <HiCreditCard size={20} className="inline-flex mr-2" />
                    <p>
                      <span className="font-semibold">Pincode:</span> {restaurantData.pincode}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <HiPhone size={20} className="inline-flex mr-2" />
                    <p>
                      <span className="font-semibold">Phone:</span> {restaurantData.phoneNumber}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <HiMail size={20} className="inline-flex mr-2" />
                    <p>
                      <span className="font-semibold">Email:</span> {restaurantData.email}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <HiUser size={20} className="inline-flex mr-2" />
                    <p>
                      <span className="font-semibold">Owner Name:</span> {restaurantData.ownerName}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <HiClock size={20} className="inline-flex mr-2" />
                    <p>
                      <span className="font-semibold">Operating Hours:</span> {formatTime(restaurantData.OperatingHoursStart)} - {formatTime(restaurantData.OperatingHoursEnd)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {restaurantData.verified ? <HiCheckCircle size={20} className="inline-flex mr-2 text-green-500" /> : <HiXCircle size={20} className="inline-flex mr-2 text-red-500" />}
                    <p>
                      <span className="font-semibold">Verified:</span> {restaurantData.verified ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </section>
        )}
      </>
    );
  };
  // =======================================================================================================================================================================
  return (
    <main className="max-w-full mx-auto overflow-hidden bg-primary p-4">
      <Header />
      <RestaurantInformation />
    </main>
  );
};

export default RestaurantProfilePage;
