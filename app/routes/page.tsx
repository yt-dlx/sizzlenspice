// app/routes/page.tsx
"use client";
import Image from "next/image";
import Loading from "./loading";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { TypeAnimation } from "react-type-animation";
import type { UserData } from "@/app/_assets/types/cart";
import React, { useEffect, useState, FormEvent } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FaMapMarkerAlt, FaMapPin, FaPhone, FaEnvelope } from "react-icons/fa";

export default function UserPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserData>({
    phoneNumber: "",
    customerEmail: "",
    locationData: { latitude: "", longitude: "", address: "", pincode: "" },
  });
  const { isLoading, error, data } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const response = await fetch("/api/user", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch user data");
      return response.json();
    },
    enabled: !!session,
  });
  useEffect(() => {
    if (data)
      setUserData((prev) => ({
        ...prev,
        phoneNumber: data.phoneNumber || "",
        customerEmail: data.customerEmail || session?.user?.email || "",
      }));
  }, [data, session]);
  const updateUserMutation = useMutation<void, Error, UserData>({
    mutationFn: async (userData) => {
      const response = await fetch("/api/user", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to update user data");
    },
  });
  const HandleInputChange = (field: string, value: string) => setUserData((prev) => ({ ...prev, [field]: value }));
  const HandleLocationChange = (field: string, value: string) => setUserData((prev) => ({ ...prev, locationData: { ...prev.locationData, [field]: value } }));
  const HandleConfirm = async (event: FormEvent) => {
    event.preventDefault();
    updateUserMutation.mutate(userData, { onSuccess: () => router.push("/routes/customer/menu") });
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude.toString();
      const lon = position.coords.longitude.toString();
      HandleLocationChange("latitude", lat);
      HandleLocationChange("longitude", lon);
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      if (response.ok) {
        const data = await response.json();
        if (data.address) {
          HandleLocationChange("address", data.display_name || "");
          HandleLocationChange("pincode", data.address.postcode || "");
        }
      }
    });
  }, []);
  if (isLoading) return <Loading />;
  if (error) throw error;
  return (
    <main className="max-w-full mx-auto overflow-hidden bg-primary p-4">
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        id="header"
        className="flex flex-col md:justify-center md:items-center sm:text-center text-secondary"
      >
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-secondary">
          <TypeAnimation sequence={["User Data", 2000]} repeat={Infinity} wrapper="span" speed={2} />
        </h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2">User data encompasses personal data collected to understand and improve user experiences!</h2>
        <Image src="/svg/user.gif" alt="User data illustration" width={300} height={300} className="mx-auto object-cover h-80 sm:h-96 lg:h-112 hue-rotate-180" />
      </motion.section>
      <section id="UserData" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col m-2 bg-secondary p-4 rounded-xl text-primary shadow-md shadow-secondary">
        <form onSubmit={HandleConfirm} className="space-y-1 flex flex-col text-xs py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full mb-8">
            <div className="relative flex-grow">
              <FaMapMarkerAlt size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
              <input
                type="text"
                value={userData.locationData.address}
                onChange={(e) => HandleLocationChange("address", e.target.value)}
                placeholder="Fetching Address..."
                className="w-full py-2 pl-10 pr-4 rounded-xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div className="relative flex-grow">
              <FaMapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
              <input
                type="text"
                value={userData.locationData.pincode}
                onChange={(e) => HandleLocationChange("pincode", e.target.value)}
                placeholder="Fetching Pincode..."
                className="w-full py-2 pl-10 pr-4 rounded-xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div className="relative flex-grow">
              <FaEnvelope size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
              <input
                type="email"
                value={userData.customerEmail}
                onChange={(e) => HandleInputChange("customerEmail", e.target.value)}
                placeholder="Email"
                className="w-full py-2 pl-10 pr-4 rounded-xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div className="relative flex-grow">
              <FaPhone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
              <input
                type="tel"
                value={userData.phoneNumber}
                onChange={(e) => HandleInputChange("phoneNumber", e.target.value)}
                placeholder="Phone Number"
                className="w-full py-2 pl-10 pr-4 rounded-xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full p-2 mt-4 text-lg transition duration-700 ease-in-out transform rounded-xl bg-primary hover:bg-tertiary text-secondary flex items-center justify-center gap-2 border-2 border-secondary"
          >
            Confirm and Continue
          </button>
        </form>
      </section>
    </main>
  );
}
