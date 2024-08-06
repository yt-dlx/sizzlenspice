// app/routes/company/page.tsx
"use client";
import Image from "next/image";
import Loading from "@/app/routes/loading";
import { useState, FormEvent } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdCheckCircle, MdRemoveCircle } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const {
    isLoading: pendingLoading,
    data: pendingRestaurants,
    refetch: refetchPending,
  } = useQuery<Restaurant[]>({
    queryKey: ["pendingRestaurants"],
    queryFn: async () => {
      const response = await fetch("/api/company/pending");
      if (!response.ok) throw new Error("Failed to fetch pending restaurants");
      return response.json();
    },
  });
  const {
    isLoading: verifiedLoading,
    data: verifiedRestaurants,
    refetch: refetchVerified,
  } = useQuery<Restaurant[]>({
    queryKey: ["verifiedRestaurants"],
    queryFn: async () => {
      const response = await fetch("/api/restaurant/auth");
      if (!response.ok) throw new Error("Failed to fetch verified restaurants");
      const data = await response.json();
      return data.restaurants.filter((restaurant: Restaurant) => restaurant.verified);
    },
  });
  const verifyMutation = useMutation({
    mutationFn: async ({ restaurantId, verified }: { restaurantId: string; verified: boolean }) => {
      const response = await fetch("/api/company/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId, verified }),
      });
      if (!response.ok) throw new Error("Failed to verify restaurant");
      return response.json();
    },
    onError: (error: Error) => setErrorMessage(error.message),
    onSuccess: () => {
      refetchPending();
      refetchVerified();
    },
  });
  const handleVerify = (restaurantId: string, verified: boolean) =>
    verifyMutation.mutate({ restaurantId, verified });
  const submitRenderModal = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    switch (modalType) {
      case "approveRestaurant":
        handleVerify(selectedRestaurant!.id, true);
        setIsModalOpen(false);
        break;
      case "rejectRestaurant":
        handleVerify(selectedRestaurant!.id, false);
        setIsModalOpen(false);
        break;
    }
  };
  if (pendingLoading || verifiedLoading) return <Loading />;
  return (
    <main className="max-w-full mx-auto overflow-hidden bg-primary p-4 relative">
      <section
        id="header"
        className="flex flex-col md:justify-center md:items-center sm:text-center text-secondary"
      >
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-secondary">
          <TypeAnimation
            sequence={["Company Page", 2000]}
            repeat={Infinity}
            wrapper="span"
            speed={2}
          />
        </h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2">
          Manage Your Restaurant Verifications
        </h2>
      </section>
      {errorMessage && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-4">Pending Restaurant Verifications</h2>
        <div className="space-y-8">
          {pendingRestaurants?.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-secondary text-primary p-6 rounded-lg shadow-md"
            >
              <h3 className="text-2xl font-semibold mb-4">{restaurant.name}</h3>
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
                    <strong>PAN Card Name:</strong> {restaurant.panCardFirstName}{" "}
                    {restaurant.panCardLastName}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center space-x-4">
                <button
                  onClick={() => {
                    setSelectedRestaurant(restaurant);
                    setModalType("approveRestaurant");
                    setIsModalOpen(true);
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
                >
                  <FaCheck className="mr-2" /> Approve
                </button>
                <button
                  onClick={() => {
                    setSelectedRestaurant(restaurant);
                    setModalType("rejectRestaurant");
                    setIsModalOpen(true);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center"
                >
                  <FaTimes className="mr-2" /> Reject
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-3xl font-bold mb-4">Verified Restaurants</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200">Name</th>
                <th className="py-2 px-4 border-b border-gray-200">Email</th>
                <th className="py-2 px-4 border-b border-gray-200">Phone</th>
                <th className="py-2 px-4 border-b border-gray-200">Address</th>
                <th className="py-2 px-4 border-b border-gray-200">Pincode</th>
                <th className="py-2 px-4 border-b border-gray-200">Opening Hour</th>
                <th className="py-2 px-4 border-b border-gray-200">Closing Hour</th>
                <th className="py-2 px-4 border-b border-gray-200">Aadhaar Number</th>
                <th className="py-2 px-4 border-b border-gray-200">PAN Card Number</th>
                <th className="py-2 px-4 border-b border-gray-200">PAN Card Name</th>
              </tr>
            </thead>
            <tbody>
              {verifiedRestaurants?.map((restaurant) => (
                <tr key={restaurant.id}>
                  <td className="py-2 px-4 border-b border-gray-200">{restaurant.name}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{restaurant.email}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{restaurant.phoneNumber}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{restaurant.address}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{restaurant.pincode}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{restaurant.openingHour}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{restaurant.closingHour}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{restaurant.aadhaarNumber}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{restaurant.panCardNumber}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {restaurant.panCardFirstName} {restaurant.panCardLastName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, y: "100%", transition: { duration: 0.2 } }}
            className="fixed bottom-0 left-0 right-0 w-full max-w-4xl mx-auto bg-secondary/60 backdrop-blur-3xl shadow-md shadow-secondary border-4 border-double border-secondary text-primary rounded-t-xl flex justify-center max-h-[80vh] z-50"
          >
            <div className="p-4 w-full overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-4xl">
                  {modalType === "approveRestaurant" ? "Approve Restaurant" : "Reject Restaurant"}
                </h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <MdClose
                    size={30}
                    className="text-primary bg-secondary rounded-xl animate-spin"
                  />
                </button>
              </div>
              <form onSubmit={submitRenderModal} className="bg-primary/20 rounded-xl p-2">
                {/* <Image
unoptimized
width={540}
height={540}
src="path/to/image"
alt={selectedRestaurant?.name!}
className="object-cover w-full h-48 border-2 border-secondary shadow-md shadow-secondary rounded-xl mb-6"
/> */}
                <div className="flex justify-between mt-2">
                  <button
                    type="submit"
                    className="w-full p-2 text-lg transition duration-700 ease-in-out transform rounded-l-xl bg-primary hover:bg-tertiary text-secondary flex items-center justify-center gap-1 border-2 border-secondary"
                  >
                    <MdCheckCircle /> Confirm & Close
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full p-2 text-lg transition duration-700 ease-in-out transform rounded-r-xl bg-red-900 hover:bg-red-800 text-primary flex items-center justify-center gap-1 border-2 border-secondary"
                  >
                    <MdRemoveCircle /> Cancel & Close
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {isModalOpen && <div className="fixed inset-0 bg-primary/50 backdrop-blur-3xl z-40"></div>}
    </main>
  );
}
