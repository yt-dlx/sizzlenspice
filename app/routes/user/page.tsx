// app/routes/user/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useStore } from "@/app/_src/others/store";
import { FaMapMarkerAlt, FaMapPin, FaPhone, FaEnvelope } from "react-icons/fa";

export default function UserPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const { setLocationData, locationData, phoneNumber, setPhoneNumber, customerEmail, setCustomerEmail } = useStore();

  useEffect(() => {
    const userData = async () => {
      if (session?.user?.email) setCustomerEmail(session.user.email);
      const response = await fetch("/api/user", { method: "GET", headers: { "Content-Type": "application/json" } });
      if (!response.ok) setError("Failed to fetch user data");
      const userData = await response.json();
      console.log("User data:", userData);
      if (userData.phoneNumber) setPhoneNumber(userData.phoneNumber);
      if (userData.customerEmail) setCustomerEmail(userData.customerEmail);
    };
    userData();
  }, [session, setCustomerEmail, setPhoneNumber]);

  const handleContactInfoChange = (field: string, value: string) => {
    if (field === "phoneNumber") setPhoneNumber(value);
    else if (field === "customerEmail") setCustomerEmail(value);
  };

  const handleConfirm = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const response = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locationData, phoneNumber, customerEmail }),
    });
    if (!response.ok) setError("Failed to place order!");
    else router.push("/routes/menu");
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude.toString();
      const lon = position.coords.longitude.toString();
      setLocationData({ latitude: lat, longitude: lon });
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      if (response.ok) {
        const data = await response.json();
        if (data.address) setLocationData({ address: data.display_name || "", pincode: data.address.postcode || "" });
      }
    });
  }, [setLocationData]);

  return (
    <main className="max-w-full mx-auto overflow-hidden bg-gradient-to-b from-[#1C3029]/30 from-10% via-[#171717] via-40% to-[#131313] to-50% p-4">
      <section id="header" className="flex flex-col md:justify-center md:items-center sm:text-center text-[#E9F0CD] font-Playfair">
        <h1 className="text-8xl sm:text-9xl font-bold text-[#E9F0CD]">User Data</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2 font-Kurale">User data encompasses persona data collected to understand and improve user experiences!</h2>
        <img src="/svg/user.gif" className="mx-auto object-cover h-80 sm:h-96 lg:h-112 hue-rotate-180" />
      </section>
      {/* ======================================================================================================================================================================= */}

      <section className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col m-2 bg-[#E9F0CD]/10 p-4 rounded-lg text-[#E9F0CD]">
        <form onSubmit={handleConfirm} id="user-data" className="space-y-1 flex flex-col text-xs font-Kurale font-bold py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full mb-2">
            <div className="relative flex-grow">
              <FaMapMarkerAlt size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#172B25]" />
              <input
                type="text"
                value={locationData.address}
                onChange={(e) => setLocationData({ ...locationData, address: e.target.value })}
                placeholder="Fetching Address..."
                className="w-full py-2 pl-10 pr-4 rounded-2xl bg-[#E9F0CD] border-2 border-[#131313] shadow-md shadow-[#131313] text-[#172B25] placeholder-[#172B25] focus:outline-none"
                required
              />
            </div>
            <div className="relative flex-grow">
              <FaMapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#172B25]" />
              <input
                type="text"
                value={locationData.pincode}
                onChange={(e) => setLocationData({ ...locationData, pincode: e.target.value })}
                placeholder="Fetching Pincode..."
                className="w-full py-2 pl-10 pr-4 rounded-2xl bg-[#E9F0CD] border-2 border-[#131313] shadow-md shadow-[#131313] text-[#172B25] placeholder-[#172B25] focus:outline-none"
                required
              />
            </div>
            <div className="relative flex-grow">
              <FaEnvelope size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#172B25]" />
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => handleContactInfoChange("customerEmail", e.target.value)}
                placeholder="Email"
                className="w-full py-2 pl-10 pr-4 rounded-2xl bg-[#E9F0CD] border-2 border-[#131313] shadow-md shadow-[#131313] text-[#172B25] placeholder-[#172B25] focus:outline-none"
                required
              />
            </div>
            <div className="relative flex-grow">
              <FaPhone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#172B25]" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => handleContactInfoChange("phoneNumber", e.target.value)}
                placeholder="Phone Number"
                className="w-full py-2 pl-10 pr-4 rounded-2xl bg-[#E9F0CD] border-2 border-[#131313] shadow-md shadow-[#131313] text-[#172B25] placeholder-[#172B25] focus:outline-none"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-lg transition duration-700 ease-in-out transform rounded-full bg-[#d9e6af] hover:bg-[#3b412b] text-[#172B25] hover:text-[#E9F0CD] flex items-center justify-center gap-2 font-Kurale font-bold"
          >
            Confirm and Continue
          </button>
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </form>
      </section>
    </main>
  );
}
