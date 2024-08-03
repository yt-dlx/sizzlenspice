// app/routes/company/page.tsx
"use client";
import { useState } from "react";
import Loading from "@/app/routes/loading";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useMutation, useQuery } from "@tanstack/react-query";

type Restaurant = {
  id: string;
  name: string;
  email: string;
  pincode: string;
  address: string;
  verified: boolean;
  phoneNumber: string;
  openingHour: string;
  closingHour: string;
  aadhaarNumber: string;
  panCardNumber: string;
  panCardLastName: string;
  panCardFirstName: string;
};

export default function CompanyPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const {
    data: restaurants,
    isLoading,
    refetch,
  } = useQuery<Restaurant[]>({
    queryKey: ["pendingRestaurants"],
    queryFn: async () => {
      const response = await fetch("/api/company/pending");
      if (!response.ok) throw new Error("Failed to fetch pending restaurants");
      return response.json();
    },
  });
  const verifyMutation = useMutation({
    mutationFn: async ({ restaurantId, verified }: { restaurantId: string; verified: boolean }) => {
      const response = await fetch("/api/company/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId, verified }),
      });
      if (!response.ok) {
        throw new Error("Failed to verify restaurant");
      }
      return response.json();
    },
    onError: (error: Error) => setErrorMessage(error.message),
    onSuccess: () => refetch(),
  });
  const handleVerify = (restaurantId: string, verified: boolean) => verifyMutation.mutate({ restaurantId, verified });
  if (isLoading) return <Loading />;
  return (
    <main className="max-w-7xl mx-auto p-4 bg-primary text-secondary">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard - Pending Restaurant Verifications</h1>
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
      <div className="space-y-8">
        {restaurants?.map((restaurant) => (
          <div key={restaurant.id} className="bg-secondary text-primary p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">{restaurant.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Email:</strong> {restaurant.email}
                </p>
                <p>
                  <strong>Phone:</strong> {restaurant.phoneNumber}
                </p>
                <p>
                  <strong>Address:</strong> {restaurant.address}
                </p>
                <p>
                  <strong>Pincode:</strong> {restaurant.pincode}
                </p>
              </div>
              <div>
                <p>
                  <strong>Opening Hour:</strong> {restaurant.openingHour}
                </p>
                <p>
                  <strong>Closing Hour:</strong> {restaurant.closingHour}
                </p>
                <p>
                  <strong>Aadhaar Number:</strong> {restaurant.aadhaarNumber}
                </p>
                <p>
                  <strong>PAN Card Number:</strong> {restaurant.panCardNumber}
                </p>
                <p>
                  <strong>PAN Card Name:</strong> {restaurant.panCardFirstName} {restaurant.panCardLastName}
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center space-x-4">
              <button onClick={() => handleVerify(restaurant.id, true)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center">
                <FaCheck className="mr-2" /> Approve
              </button>
              <button
                onClick={() => {
                  const message = prompt("Enter rejection reason:");
                  if (message) handleVerify(restaurant.id, false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center"
              >
                <FaTimes className="mr-2" /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
