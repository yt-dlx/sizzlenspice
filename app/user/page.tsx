// app/user/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/app/utils/components/Navbar";
import Footer from "@/app/utils/components/Footer";

export default function User() {
  const [address, setAddress] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const [latitude, setLatitude] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<string | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude.toString();
      const lon = position.coords.longitude.toString();
      setLatitude(lat);
      setLongitude(lon);
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      if (response.ok) {
        const data = await response.json();
        if (data.address) {
          setAddress(data.display_name);
          setPincode(data.address.postcode || "");
        }
      }
    });
  }, []);

  return (
    <React.Fragment>
      <Navbar />
      <div className="mx-auto overflow-hidden bg-[#FFF4E9] max-w-6xl p-2">
        <div id="header">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-6xl sm:text-8xl font-Hatton_Bold mb-6 font-bold text-[#172B25]">User Location</h1>
            <div className="text-xl font-black sm:text-2xl mb-8 text-[#172B25]">Get your coordinates and enter delivery addresses</div>
            <img src="/Location.gif" className="object-contain h-72 sm:h-80 lg:h-96" alt="Location GIF" />
          </div>
        </div>
        <div className="py-8 sm:px-4 md:px-6">
          <div className="flex flex-col items-center">
            <div className="mb-8 text-2xl font-MaronRose text-[#172B25]">
              <p>
                Latitude: <input type="text" value={latitude || ""} readOnly className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline bg-gray-100" />
              </p>
              <p>
                Longitude: <input type="text" value={longitude || ""} readOnly className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline bg-gray-100" />
              </p>
              <label className="block text-[#172B25] text-sm font-bold mb-2" htmlFor="address">
                Address
              </label>
              <input type="text" id="address" name="address" value={address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)} className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" />
              <label className="block text-[#172B25] text-sm font-bold mb-2 mt-4" htmlFor="pincode">
                Pin Code
              </label>
              <input type="text" id="pincode" name="pincode" value={pincode} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPincode(e.target.value)} className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" />
            </div>
            <div className="w-full max-w-lg">
              <form>
                <button type="submit" className="w-full px-4 py-2 font-bold transition duration-700 ease-in-out transform rounded-full bg-[#172B25] text-[#FFF4E9] hover:bg-[#468353] hover:text-[#FFF4E9]">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
