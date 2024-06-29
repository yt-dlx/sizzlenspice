// app/user/page.tsx
"use client";
import Link from "next/link";
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
          setAddress(data.display_name || "");
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
            <img src="/Location.gif" className="object-contain -hue-rotate-90 h-72 sm:h-80 lg:h-96" alt="Location GIF" />
          </div>
        </div>

        <form
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
          }}
          className="flex flex-col max-w-7xl bg-[#172B25] p-8 rounded-3xl text-[#E6DFD4] shadow-md shadow-[#172B25] pb-10"
        >
          <div className="space-y-4 mt-2">
            <label className="form-control w-full max-w-full">
              <div className="label">
                <span className="label-text">What is your Address?</span>
                <span className="label-text-alt">Customize if needed!</span>
              </div>
              <input
                required
                type="text"
                id="address"
                name="address"
                value={address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
                className="input input-bordered w-full h-10 max-w-full rounded-3xl bg-[#468353]/60 hover:bg-[#468353] placeholder-[#FFF4E9] hover:placeholder-[#FFF4E9]"
              />
            </label>
            <label className="form-control w-full max-w-full">
              <div className="label">
                <span className="label-text">What is your Pin/Zip Code?</span>
                <span className="label-text-alt">Customize if needed!</span>
              </div>
              <input
                required
                type="text"
                id="pincode"
                name="pincode"
                value={pincode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPincode(e.target.value)}
                className="input input-bordered w-full h-10 max-w-full rounded-3xl bg-[#468353]/60 hover:bg-[#468353] placeholder-[#FFF4E9] hover:placeholder-[#FFF4E9]"
              />
            </label>
            <label className="form-control w-full max-w-full">
              <div className="label">
                <span className="label-text">This is your current</span>
                <span className="label-text-alt">Latitude!</span>
              </div>
              <input
                readOnly
                required
                type="text"
                id="latitude"
                name="latitude"
                value={latitude || ""}
                className="input input-bordered w-full h-10 max-w-full rounded-3xl bg-[#468353]/60 hover:bg-[#468353] placeholder-[#FFF4E9] hover:placeholder-[#FFF4E9] cursor-not-allowed"
              />
            </label>
            <label className="form-control w-full max-w-full">
              <div className="label">
                <span className="label-text">This is your current</span>
                <span className="label-text-alt">Longitude!</span>
              </div>
              <input
                readOnly
                required
                type="text"
                id="longitude"
                name="longitude"
                value={longitude || ""}
                className="input input-bordered w-full h-10 max-w-full rounded-3xl bg-[#468353]/60 hover:bg-[#468353] placeholder-[#FFF4E9] hover:placeholder-[#FFF4E9] cursor-not-allowed"
              />
            </label>
            <Link
              href="/cart/location"
              className="w-full h-10 transition duration-700 ease-in-out transform rounded-full bg-[#FFF4E9] hover:bg-[#468353] text-[#172B25] hover:text-[#FFF4E9] flex items-center justify-center text-center"
            >
              Confirm Data and Continue To Cart
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </React.Fragment>
  );
}
