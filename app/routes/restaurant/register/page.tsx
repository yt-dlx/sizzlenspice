// app/routes/restaurant/register/page.tsx
"use client";
import { z } from "zod";
import { motion } from "framer-motion";
import Loading from "@/app/routes/loading";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { TypeAnimation } from "react-type-animation";
import React, { useState, useEffect, FormEvent } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaMapPin, FaClock, FaUser, FaIdCard } from "react-icons/fa";

const restaurantRegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  name: z.string().min(1, "Restaurant name is required"),
  panCardLastName: z.string().min(1, "Last name is required"),
  panCardFirstName: z.string().min(1, "First name is required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  closingHour: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  openingHour: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  aadhaarNumber: z.string().regex(/^\d{12}$/, "Aadhaar number must be 12 digits"),
  panCardNumber: z.string().regex(/^[A-Z]{5}\d{4}[A-Z]$/, "Invalid PAN card number"),
});

export default function RegisterPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState({
    email: "",
    address: "",
    pincode: "",
    phoneNumber: "",
    openingHour: "",
    closingHour: "",
    aadhaarNumber: "",
    panCardNumber: "",
    panCardFirstName: "",
    panCardLastName: "",
  });

  const handleInputChange = (field: string, value: string | boolean) => setUserData((prev) => ({ ...prev, [field]: value }));

  useEffect(() => {
    setUserData((prev) => ({ ...prev, email: session?.user?.email! }));
    (async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/restaurant/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session?.user?.email }),
        });
        const data = await response.json();
        if (data.exists) router.push("/routes/restaurant/profile");
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [session, router]);

  const registerMutation = useMutation({
    mutationFn: async (data: typeof userData) => {
      const response = await fetch("/api/restaurant/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      return response.json();
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
    },
    onSuccess: () => router.push("/routes/restaurant/profile"),
    onSettled: () => setLoading(false),
  });

  if (loading) return <Loading />;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const result = restaurantRegisterSchema.safeParse(userData);

    if (!result.success) {
      setLoading(false);
      setErrorMessage("Validation Error: " + result.error.errors.map((e) => e.message).join(", "));
      return;
    }

    registerMutation.mutate(result.data);
  };

  return (
    <main className="max-w-full mx-auto overflow-hidden bg-primary p-4">
      <motion.section
        id="header"
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        initial={{ opacity: 0, y: -20 }}
        className="flex flex-col md:justify-center md:items-center sm:text-center text-secondary"
      >
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-secondary">
          <TypeAnimation sequence={["Register Restaurant", 2000]} repeat={Infinity} wrapper="span" speed={2} />
        </h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2">Register your restaurant to start using our services!</h2>
        <img src="/svg/register.gif" className="mx-auto object-cover h-80 sm:h-96 lg:h-112 hue-rotate-180" />
      </motion.section>
      <section id="register" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col m-2 bg-secondary p-4 rounded-xl text-primary shadow-md shadow-secondary">
        <form onSubmit={handleSubmit} className="space-y-1 flex flex-col text-xs py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full mb-8">
            <div className="relative flex-grow mb-2">
              <span className="flex items-center ml-2 gap-2 text-sm">
                <FaEnvelope size={15} /> Email Address
              </span>
              <motion.input
                required
                readOnly
                type="email"
                placeholder="Email"
                value={userData.email}
                whileFocus={{ scale: 1.02 }}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full rounded-xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="relative flex-grow mb-2">
              <span className="flex items-center ml-2 gap-2 text-sm">
                <FaPhone size={15} /> Restaurant Phone Number
              </span>
              <motion.input
                required
                type="tel"
                placeholder="Phone Number"
                whileFocus={{ scale: 1.02 }}
                value={userData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                className="w-full rounded-xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="relative flex-grow mb-2">
              <span className="flex items-center ml-2 gap-2 text-sm">
                <FaMapMarkerAlt size={15} /> Restaurant Address
              </span>
              <motion.input
                required
                type="text"
                placeholder="Restaurant Address"
                value={userData.address}
                whileFocus={{ scale: 1.02 }}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full rounded-xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="relative flex-grow mb-2">
              <span className="flex items-center ml-2 gap-2 text-sm">
                <FaMapPin size={15} /> Restaurant Pincode
              </span>
              <motion.input
                required
                type="text"
                placeholder="Pincode"
                value={userData.pincode}
                whileFocus={{ scale: 1.02 }}
                onChange={(e) => handleInputChange("pincode", e.target.value)}
                className="w-full rounded-xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="relative flex-grow mb-2">
              <span className="flex items-center ml-2 gap-2 text-sm">
                <FaClock size={15} /> Restaurant Opening Hour
              </span>
              <motion.input
                required
                type="time"
                placeholder="Opening Hour"
                whileFocus={{ scale: 1.02 }}
                value={userData.openingHour}
                onChange={(e) => handleInputChange("openingHour", e.target.value)}
                className="w-full rounded-xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="relative flex-grow mb-2">
              <span className="flex items-center ml-2 gap-2 text-sm">
                <FaClock size={15} /> Restaurant Closing Hour
              </span>
              <motion.input
                required
                type="time"
                placeholder="Closing Hour"
                whileFocus={{ scale: 1.02 }}
                value={userData.closingHour}
                onChange={(e) => handleInputChange("closingHour", e.target.value)}
                className="w-full rounded-xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="relative flex-grow mb-2">
              <span className="flex items-center ml-2 gap-2 text-sm">
                <FaIdCard size={15} /> Owner Aadhaar Number
              </span>
              <motion.input
                required
                type="text"
                placeholder="Aadhaar Number"
                value={userData.aadhaarNumber}
                whileFocus={{ scale: 1.02 }}
                onChange={(e) => handleInputChange("aadhaarNumber", e.target.value)}
                className="w-full rounded-xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="relative flex-grow mb-2">
              <span className="flex items-center ml-2 gap-2 text-sm">
                <FaIdCard size={15} /> Owner PAN Card Number
              </span>
              <motion.input
                required
                type="text"
                placeholder="PAN Card Number"
                value={userData.panCardNumber}
                whileFocus={{ scale: 1.02 }}
                onChange={(e) => handleInputChange("panCardNumber", e.target.value)}
                className="w-full rounded-xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="relative flex-grow mb-2">
              <span className="flex items-center ml-2 gap-2 text-sm">
                <FaUser size={15} /> Owner First Name According To PAN Card
              </span>
              <motion.input
                required
                type="text"
                placeholder="PAN Card First Name"
                value={userData.panCardFirstName}
                whileFocus={{ scale: 1.02 }}
                onChange={(e) => handleInputChange("panCardFirstName", e.target.value)}
                className="w-full rounded-xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="relative flex-grow mb-2">
              <span className="flex items-center ml-2 gap-2 text-sm">
                <FaUser size={15} /> Owner Last Name According To PAN Card
              </span>
              <motion.input
                required
                type="text"
                placeholder="PAN Card Last Name"
                value={userData.panCardLastName}
                whileFocus={{ scale: 1.02 }}
                onChange={(e) => handleInputChange("panCardLastName", e.target.value)}
                className="w-full rounded-xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
          {errorMessage && <div className="text-red-600">{errorMessage}</div>}
          <button
            type="submit"
            className="w-full p-2 mt-4 text-lg transition duration-700 ease-in-out transform rounded-xl bg-primary hover:bg-tertiary text-secondary flex items-center justify-center gap-2 border-2 border-secondary"
          >
            Register & Continue
          </button>
        </form>
      </section>
    </main>
  );
}
