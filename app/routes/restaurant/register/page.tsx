// app/routes/restaurant/register/page.tsx
"use client";
import Loading from "@/app/routes/loading";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { TypeAnimation } from "react-type-animation";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, FormEvent } from "react";
import { FaEnvelope, FaPhone, FaUtensils } from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState({ email: "", phoneNumber: "", name: "" });

  const handleInputChange = (field: string, value: string) => setUserData((prev) => ({ ...prev, [field]: value }));

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
    mutationFn: async (data: { email: string; phoneNumber: string; name: string }) => {
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
          <TypeAnimation sequence={["Register Restaurant", 2000]} repeat={Infinity} wrapper="span" speed={2} />
        </h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2">Register your restaurant to start using our services!</h2>
        <img src="/svg/register.gif" className="mx-auto object-cover h-80 sm:h-96 lg:h-112 hue-rotate-180" />
      </motion.section>
      <section id="register" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col m-2 bg-secondary p-4 rounded-xl text-primary shadow-md shadow-secondary">
        <form
          onSubmit={(event: FormEvent) => {
            event.preventDefault();
            setLoading(true);
            registerMutation.mutate(userData);
          }}
          className="space-y-1 flex flex-col text-xs py-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full mb-8">
            <div className="relative flex-grow">
              <FaEnvelope size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
              <motion.input
                whileFocus={{ scale: 1.02 }}
                required
                readOnly
                type="email"
                placeholder="Email"
                value={userData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full py-2 pl-10 pr-4 rounded-xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="relative flex-grow">
              <FaPhone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
              <motion.input
                whileFocus={{ scale: 1.02 }}
                required
                type="tel"
                placeholder="Phone Number"
                value={userData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                className="w-full py-2 pl-10 pr-4 rounded-xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="relative flex-grow">
              <FaUtensils size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
              <motion.input
                whileFocus={{ scale: 1.02 }}
                required
                type="text"
                value={userData.name}
                placeholder="Restaurant Name"
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full py-2 pl-10 pr-4 rounded-xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
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
