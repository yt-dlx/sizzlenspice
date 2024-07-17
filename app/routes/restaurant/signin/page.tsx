// app/routes/restaurant/signin/page.tsx
"use client";
import Image from "next/image";
import Loading from "./loading";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MdPerson, MdPhone, MdLocationOn, MdAccessTime, MdPinDrop } from "react-icons/md";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session } = useSession();
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
  const fetchRestaurants = async () => {
    const response = await fetch("/api/restaurant/signin");
    if (!response.ok) throw new Error("Failed to fetch restaurants");
    return response.json();
  };
  const registerRestaurant = async (formData: any) => {
    const response = await fetch("/api/restaurant/signin", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to Register restaurant");
  };
  const { data, isLoading, isError } = useQuery({
    queryKey: ["restaurants", session?.user?.email],
    queryFn: fetchRestaurants,
    enabled: !!session?.user?.email,
  });
  useEffect(() => {
    if (data) {
      const restaurant = data.restaurants.find((restaurant: { email: string; verified: boolean }) => restaurant.email === session?.user?.email);
      if (restaurant) {
        if (restaurant.verified) router.push("/routes/restaurant/orders");
        else router.push("/routes/restaurant/profile");
      }
    }
  }, [data, session?.user?.email, router]);
  const mutation = useMutation({
    mutationFn: registerRestaurant,
    onSuccess: () => {
      router.push("/routes/restaurant/profile");
    },
  });
  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const HandleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };
  if (isLoading) return <Loading />;
  if (isError) throw new Error((data as any).message);
  // =======================================================================================================================================================================
  const Header = () => {
    return (
      <section id="header" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col md:justify-center md:items-center sm:text-center text-secondary mb-8">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-secondary">Restaurant Registration</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2">Partner with Us and Become a Glorified Member of Sizzlenspice Company!</h2>
      </section>
    );
  };
  // =======================================================================================================================================================================
  return (
    <main className="max-w-full mx-auto overflow-hidden bg-primary p-4 text-secondary">
      <Header />
      <section id="DataForm" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto bg-secondary rounded-3xl shadow-md shadow-secondary border-4 border-double border-secondary overflow-hidden">
        <div className="p-8 bg-primary flex flex-col items-center justify-center">
          <div className="flex justify-center w-full">
            <Image src="/sns.gif" width={300} height={300} alt="Sizzlenspice" className="mx-auto object-cover h-80 sm:h-96 lg:h-112" />
          </div>
        </div>
        <form onSubmit={HandleSubmit} className="space-y-4 p-8">
          <div className="grid md:grid-cols-2 gap-4">
            {formFields.map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name} className="block text-sm text-primary mb-1">
                  {field.label}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-tertiary">{field.icon}</span>
                  <input
                    required
                    id={field.name}
                    type={field.type}
                    name={field.name}
                    onChange={HandleChange}
                    placeholder={field.placeholder}
                    value={String(formData[field.name as keyof typeof formData])}
                    className="pl-10 block w-full rounded-3xl border-primary bg-primary/20 placeholder:text-sm text-primary focus:border-secondary focus:ring-secondary"
                  />
                </div>
              </div>
            ))}
            <div>
              <label htmlFor="OperatingHoursStart" className="block text-sm text-primary mb-1">
                Operating Hours Start
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-tertiary">
                  <MdAccessTime />
                </span>
                <input
                  required
                  type="time"
                  onChange={HandleChange}
                  id="OperatingHoursStart"
                  name="OperatingHoursStart"
                  placeholder="Restaurant Start Time"
                  value={formData.OperatingHoursStart}
                  className="pl-10 block w-full rounded-3xl border-primary bg-primary/20 placeholder:text-sm text-primary focus:border-secondary focus:ring-secondary"
                />
              </div>
            </div>
            <div>
              <label htmlFor="OperatingHoursEnd" className="block text-sm text-primary mb-1">
                Operating Hours End
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-tertiary">
                  <MdAccessTime />
                </span>
                <input
                  required
                  type="time"
                  onChange={HandleChange}
                  id="OperatingHoursEnd"
                  name="OperatingHoursEnd"
                  placeholder="Restaurant End Time"
                  value={formData.OperatingHoursEnd}
                  className="pl-10 block w-full rounded-3xl border-primary bg-primary/20 placeholder:text-sm text-primary focus:border-secondary focus:ring-secondary"
                />
              </div>
            </div>
          </div>
          <input type="hidden" name="verified" value="false" />
          <button
            type="submit"
            className="w-full px-4 py-2 text-lg transition duration-700 ease-in-out transform rounded-3xl bg-primary hover:bg-tertiary text-secondary flex items-center justify-center gap-2"
          >
            Submit & Wait for Verification
          </button>
        </form>
      </section>
    </main>
  );
}
