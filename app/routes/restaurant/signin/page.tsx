// app/routes/restaurant/signin/page.tsx
"use client";
import Image from "next/image";
import Loading from "./loading";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { MdPerson, MdPhone, MdLocationOn, MdAccessTime, MdPinDrop } from "react-icons/md";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = useState({
    verified: false,
    pincode: "",
    address: "",
    ownerName: "",
    phoneNumber: "",
    OperatingHoursEnd: "",
    OperatingHoursStart: "",
  });

  const formFields = [
    { name: "address", type: "text", label: "Address", icon: <MdLocationOn />, placeholder: "Enter your restaurant's address" },
    { name: "ownerName", type: "text", label: "Owner Name", icon: <MdPerson />, placeholder: "Enter owner's name" },
    { name: "phoneNumber", type: "tel", label: "Phone Number", icon: <MdPhone />, placeholder: "Enter contact number" },
    { name: "pincode", type: "text", label: "Pincode", icon: <MdPinDrop />, placeholder: "Enter the pincode" },
  ];

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const response = await fetch("/api/restaurant/signin");
        if (!response.ok) throw new Error("Failed to fetch restaurants");
        const data = await response.json();
        const restaurant = data.restaurants.find((restaurant: { email: string; verified: boolean }) => restaurant.email === session?.user?.email);
        if (restaurant) {
          if (restaurant.verified) router.push("/routes/restaurant/orders");
          else router.push("/routes/restaurant/profile");
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurants();
  }, [session?.user?.email, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/restaurant/signin", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to Register restaurant");
    else router.push("/routes/restaurant/profile");
  };

  if (loading) return <Loading />;
  if (error) throw new Error(error);

  return (
    <main className="max-w-full mx-auto overflow-hidden bg-gradient-to-b bg-primary p-4 text-secondary">
      <section id="header" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col md:justify-center md:items-center sm:text-center text-secondary font-Playfair mb-8">
        <h1 className="text-7xl sm:text-9xl font-bold text-secondary">Restaurant Registration</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2 font-Kurale">Partner with Us and Become a Glorified Member of Sizzlenspice Company!</h2>
      </section>
      {/* ======================================================================================================================================================================= */}
      <section className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto bg-[#171717] rounded-lg border-primary border-8 border-double overflow-hidden">
        <div className="p-8 bg-primary text-secondary flex flex-col items-center justify-center">
          <div className="flex justify-center w-full">
            <Image src="/sns.gif" width={300} height={300} alt="Sizzlenspice" className="mx-auto object-cover h-80 sm:h-96 lg:h-112" />
          </div>
        </div>
        {/* ======================================================================================================================================================================= */}
        <form onSubmit={handleSubmit} className="space-y-4 p-8 font-Kurale font-bold">
          <div className="grid md:grid-cols-2 gap-4">
            {formFields.map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name} className="block text-sm text-secondary mb-1">
                  {field.label}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#a0b07e]">{field.icon}</span>
                  <input
                    required
                    id={field.name}
                    type={field.type}
                    name={field.name}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    value={String(formData[field.name as keyof typeof formData])}
                    className="pl-10 block w-full rounded-lg border-primary bg-[#2a2a2a] placeholder:font-RobotoCondensed placeholder:text-sm text-secondary focus:border-secondary focus:ring-secondary"
                  />
                </div>
              </div>
            ))}
            <div>
              <label htmlFor="OperatingHoursStart" className="block text-sm text-secondary mb-1">
                Operating Hours Start
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#a0b07e]">
                  <MdAccessTime />
                </span>
                <input
                  required
                  type="time"
                  onChange={handleChange}
                  id="OperatingHoursStart"
                  name="OperatingHoursStart"
                  placeholder="Restaurant Start Time"
                  value={formData.OperatingHoursStart}
                  className="pl-10 block w-full rounded-lg border-primary bg-[#2a2a2a] placeholder:font-RobotoCondensed placeholder:text-sm text-secondary focus:border-secondary focus:ring-secondary"
                />
              </div>
            </div>
            <div>
              <label htmlFor="OperatingHoursEnd" className="block text-sm text-secondary mb-1">
                Operating Hours End
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#a0b07e]">
                  <MdAccessTime />
                </span>
                <input
                  required
                  type="time"
                  onChange={handleChange}
                  id="OperatingHoursEnd"
                  name="OperatingHoursEnd"
                  placeholder="Restaurant End Time"
                  value={formData.OperatingHoursEnd}
                  className="pl-10 block w-full rounded-lg border-primary bg-[#2a2a2a] placeholder:font-RobotoCondensed placeholder:text-sm text-secondary focus:border-secondary focus:ring-secondary"
                />
              </div>
            </div>
          </div>
          <input type="hidden" name="verified" value="false" />
          <button
            type="submit"
            className="w-full bg-secondary text-primary py-2 px-4 rounded-lg hover:bg-[#a0b07e] focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            Submit & Wait for Verification
          </button>
        </form>
      </section>
    </main>
  );
}
