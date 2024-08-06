// app/routes/restaurant/register/page.tsx
"use client";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import Loading from "@/app/routes/loading";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { TypeAnimation } from "react-type-animation";
import React, { useState, useEffect, FormEvent } from "react";
// import { restaurantRegisterSchema } from "@/app/api/restaurant/register/route";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaMapPin,
  FaClock,
  FaUser,
  FaIdCard,
} from "react-icons/fa";

const initialUserData = {
  name: "",
  email: "",
  pincode: "",
  address: "",
  closingHour: "",
  openingHour: "",
  phoneNumber: "",
  panCardNumber: "",
  aadhaarNumber: "",
  panCardLastName: "",
  panCardFirstName: "",
};
type UserDataKey = keyof typeof initialUserData;

export default function RegisterPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState(initialUserData);
  const [verificationMessage, setVerificationMessage] = useState("");
  const handleInputChange = (field: UserDataKey, value: string | boolean) =>
    setUserData((prev) => ({ ...prev, [field]: value }));
  useEffect(() => {
    if (session?.user?.email) {
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
          if (data.exists) {
            if (data.verified) router.push("/routes/restaurant/profile");
            else setVerificationMessage("Wait for verification");
          }
        } catch (error) {
          setLoading(false);
        } finally {
          setLoading(false);
        }
      })();
    }
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
    onError: (error: Error) => setErrorMessage(error.message),
    onSuccess: () => router.push("/routes/restaurant/profile"),
    onSettled: () => setLoading(false),
  });
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    // const result = restaurantRegisterSchema.safeParse({ ...userData, name: uuidv4() });
    // if (!result.success) {
    // setLoading(false);
    // setErrorMessage("Validation Error: " + result.error.errors.map((e) => e.message).join(", "));
    // return;
    // }
    registerMutation.mutate({ ...userData, name: uuidv4() });
  };
  const formFields = [
    {
      label: "Email Address",
      icon: FaEnvelope,
      type: "email",
      field: "email" as UserDataKey,
      readOnly: true,
    },
    { label: "Restaurant Pincode", icon: FaMapPin, type: "text", field: "pincode" as UserDataKey },
    {
      label: "Restaurant Address",
      icon: FaMapMarkerAlt,
      type: "text",
      field: "address" as UserDataKey,
    },
    {
      label: "Restaurant Phone Number",
      icon: FaPhone,
      type: "tel",
      field: "phoneNumber" as UserDataKey,
    },
    {
      label: "Restaurant Opening Hour",
      icon: FaClock,
      type: "time",
      field: "openingHour" as UserDataKey,
    },
    {
      label: "Restaurant Closing Hour",
      icon: FaClock,
      type: "time",
      field: "closingHour" as UserDataKey,
    },
    {
      label: "Owner Aadhaar Number",
      icon: FaIdCard,
      type: "text",
      field: "aadhaarNumber" as UserDataKey,
    },
    {
      label: "Owner PAN Card Number",
      icon: FaIdCard,
      type: "text",
      field: "panCardNumber" as UserDataKey,
    },
    {
      label: "Owner Last Name According To PAN Card",
      icon: FaUser,
      type: "text",
      field: "panCardLastName" as UserDataKey,
    },
    {
      label: "Owner First Name According To PAN Card",
      icon: FaUser,
      type: "text",
      field: "panCardFirstName" as UserDataKey,
    },
  ];
  if (loading) return <Loading />;
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
          <TypeAnimation
            sequence={["Register Restaurant", 2000]}
            repeat={Infinity}
            wrapper="span"
            speed={2}
          />
        </h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2">
          Register your restaurant to start using our services!
        </h2>
        <img
          src="/svg/register.gif"
          className="mx-auto object-cover h-80 sm:h-96 lg:h-112 hue-rotate-180"
        />
      </motion.section>
      <section
        id="register"
        className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col m-2 bg-secondary p-4 rounded-xl text-primary shadow-md shadow-secondary"
      >
        {verificationMessage && (
          <div className="text-primary">
            <p>Your registration is currently pending verification.</p>
            <p>Please wait while our team reviews your information.</p>
            <p>This process can take up to 24-48 hours.</p>
            <p>
              Once your account has been verified, you will be able to visit your restaurant profile
              page to start using our services.
            </p>
            <p>Thank you for your patience.</p>
          </div>
        )}
        {!verificationMessage && (
          <form onSubmit={handleSubmit} className="space-y-1 flex flex-col text-xs py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full mb-8">
              {formFields.map(({ label, icon: Icon, type, field, readOnly }) => (
                <div key={field} className="relative flex-grow mb-2">
                  <span className="flex items-center m-1 gap-1 text-sm">
                    <Icon size={20} /> {label}
                  </span>
                  <input
                    required
                    type={type}
                    readOnly={readOnly}
                    value={userData[field]}
                    placeholder="please type here!"
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="w-full py-2 rounded-xl bg-primary border-2 border-primary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
                  />
                </div>
              ))}
            </div>
            {errorMessage && <div className="text-red-600">{errorMessage}</div>}
            <button
              type="submit"
              className="w-full p-2 mt-4 text-lg transition duration-700 ease-in-out transform rounded-xl bg-primary hover:bg-tertiary text-secondary flex items-center justify-center gap-2 border-2 border-secondary"
            >
              Register & Continue
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
