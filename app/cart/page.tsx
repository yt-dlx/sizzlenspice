// app/user/page.tsx
"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import Navbar from "@/app/_utils/_components/Navbar";
import Footer from "@/app/_utils/_components/Footer";
import { useCart } from "@/app/_utils/_context/CartContext";

export default function Location() {
  const { locationData, setLocationData } = useCart();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude.toString();
      const lon = position.coords.longitude.toString();
      setLocationData((prev) => ({ ...prev, latitude: lat, longitude: lon }));
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      if (response.ok) {
        const data = await response.json();
        if (data.address) {
          setLocationData((prev) => ({
            ...prev,
            address: data.display_name || "",
            pincode: data.address.postcode || "",
          }));
        }
      }
    });
  }, []);

  return (
    <React.Fragment>
      <Navbar />
      <div className="mx-auto overflow-hidden bg-[#FFF4E9] max-w-6xl p-4 m-4">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-6xl sm:text-8xl font-Hatton_Bold mb-6 text-[#172B25]">User Location</h1>
          <div className="text-xl font-black sm:text-2xl mb-8 text-[#172B25]">Confirm Your Delivery Address Before Going To The Food Selection Menu</div>
          <img src="/Location.gif" className="object-contain -hue-rotate-90 h-72 sm:h-80 lg:h-96" alt="Location GIF" />
        </div>

        <div className="flex flex-col max-w-7xl bg-[#172B25] p-4 rounded-3xl text-[#E6DFD4] shadow-md shadow-[#172B25] pb-10">
          <div className="space-y-4 mt-2">
            <label className="form-control w-full max-w-full">
              <div className="label">
                <span className="label-text">What is your Address?</span>
                <span className="label-text-alt">Change if needed!</span>
              </div>
              <input
                required
                type="text"
                id="address"
                name="address"
                value={locationData.address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocationData((prev) => ({ ...prev, address: e.target.value }))}
                className="input input-bordered w-full h-10 max-w-full rounded-3xl bg-[#468353]/60 hover:bg-[#468353] placeholder-[#FFF4E9] hover:placeholder-[#FFF4E9]"
              />
            </label>
            <label className="form-control w-full max-w-full">
              <div className="label">
                <span className="label-text">What is your Pin/Zip Code?</span>
                <span className="label-text-alt">Change if needed!</span>
              </div>
              <input
                required
                type="text"
                id="pincode"
                name="pincode"
                value={locationData.pincode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocationData((prev) => ({ ...prev, pincode: e.target.value }))}
                className="input input-bordered w-full h-10 max-w-full rounded-3xl bg-[#468353]/60 hover:bg-[#468353] placeholder-[#FFF4E9] hover:placeholder-[#FFF4E9]"
              />
            </label>
            <Link
              href="/cart/food"
              className="w-full h-10 transition duration-700 ease-in-out transform rounded-full bg-[#FFF4E9] hover:bg-[#468353] text-[#172B25] hover:text-[#FFF4E9] flex items-center justify-center text-center"
            >
              Confirm and Continue
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
