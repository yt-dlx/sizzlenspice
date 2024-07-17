// app/routes/restaurant/profile.tsx
"use client";
import Image from "next/image";
import Loading from "./loading";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  HiLocationMarker,
  HiMail,
  HiPhone,
  HiCreditCard,
  HiUser,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiClipboardList,
  HiPlusCircle,
  HiTag,
  HiPhotograph,
  HiCurrencyDollar,
  HiClipboard,
  HiFolderOpen,
  HiShoppingCart,
} from "react-icons/hi";

interface Restaurant {
  id: string;
  email: string;
  address: string;
  pincode: string;
  ownerName: string;
  verified: boolean;
  phoneNumber: string;
  OperatingHoursEnd: string;
  OperatingHoursStart: string;
}
interface MenuItem {
  title: string;
  image: string;
  category: string;
  description: string;
  genre: "veg" | "non-veg";
  price: { small: string; medium: string; full: string };
}

const RestaurantProfilePage = () => {
  const { data: session } = useSession();
  const {
    data: restaurantData,
    isLoading,
    error,
  } = useQuery<Restaurant, Error>({
    queryKey: ["restaurant", session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) return null;
      const response = await fetch("/api/restaurant/signin");
      if (!response.ok) throw new Error("Failed to fetch restaurant data");
      const data = await response.json();
      const userRestaurant = data.restaurants.find((restaurant: Restaurant) => restaurant.email === session?.user?.email);
      return userRestaurant;
    },
    enabled: !!session?.user?.email,
  });
  const [newItem, setNewItem] = useState<MenuItem>({ title: "", description: "", image: "", price: { small: "", medium: "", full: "" }, genre: "veg", category: "" });
  const [categories, setCategories] = useState<string[]>(["Momos", "Biryani", "Kebab", "Noodles", "Drinks", "Rice", "Ice-Cream"]);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const parsedHours = parseInt(hours, 10);
    const ampm = parsedHours >= 12 ? "PM" : "AM";
    const formattedHours = parsedHours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("price.")) {
      const priceKey = name.split(".")[1] as "small" | "medium" | "full";
      setNewItem((prev) => ({ ...prev, price: { ...prev.price, [priceKey]: value } }));
    } else setNewItem((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categories.includes(newItem.category)) setCategories([...categories, newItem.category]);

    console.log("New item:", newItem);
    setNewItem({ title: "", description: "", image: "", price: { small: "", medium: "", full: "" }, genre: "veg", category: "" });
    setShowNewCategoryInput(false);
  };
  if (isLoading) return <Loading />;
  if (error) throw new Error(error.message);
  // =======================================================================================================================================================================
  const Header = () => {
    return (
      <section id="header" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col md:justify-center md:items-center sm:text-center text-secondary">
        <h1 className="text-6xl sm:text-7xl text-secondary">Welcome, {session?.user?.name}!</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2">
          Manage your restaurant page here. <br />
          Explore our tools and services.
        </h2>
        <Image src="/sns.gif" alt="sns" width={300} height={300} className="mx-auto object-cover h-80 sm:h-96 lg:h-112" />
      </section>
    );
  };
  const RestaurantInformation = () => {
    return (
      <>
        {restaurantData && (
          <section id="restaurant-info" className="flex items-center justify-center">
            <section className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col m-2 bg-secondary p-2 rounded-2xl text-primary shadow-md shadow-secondary">
              <div className="bg-primary/20 rounded-2xl p-4">
                <h4 className="font-bold mb-3 text-3xl border-b border-primary pb-2">Restaurant Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <HiLocationMarker size={20} className="inline-flex mr-2" />
                    <p>
                      <span className="font-semibold">Address:</span> {restaurantData.address}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <HiCreditCard size={20} className="inline-flex mr-2" />
                    <p>
                      <span className="font-semibold">Pincode:</span> {restaurantData.pincode}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <HiPhone size={20} className="inline-flex mr-2" />
                    <p>
                      <span className="font-semibold">Phone:</span> {restaurantData.phoneNumber}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <HiMail size={20} className="inline-flex mr-2" />
                    <p>
                      <span className="font-semibold">Email:</span> {restaurantData.email}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <HiUser size={20} className="inline-flex mr-2" />
                    <p>
                      <span className="font-semibold">Owner Name:</span> {restaurantData.ownerName}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <HiClock size={20} className="inline-flex mr-2" />
                    <p>
                      <span className="font-semibold">Operating Hours:</span> {formatTime(restaurantData.OperatingHoursStart)} - {formatTime(restaurantData.OperatingHoursEnd)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {restaurantData.verified ? <HiCheckCircle size={20} className="inline-flex mr-2 text-green-500" /> : <HiXCircle size={20} className="inline-flex mr-2 text-red-500" />}
                    <p>
                      <span className="font-semibold">Verified:</span> {restaurantData.verified ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
                {restaurantData.verified ? (
                  <div className="bg-green-900 text-white p-4 mt-4 rounded-lg">
                    <p className="text-sm">Congratulations! Your restaurant details have been verified. You now have access to the Orders page.</p>
                  </div>
                ) : (
                  <div className="bg-red-900 text-white p-4 mt-4 rounded-lg">
                    <p className="text-sm">
                      Thank you for registering with SizzleNSpice. Your restaurant details are currently under review by our admins. Once your account is verified, you'll be able to access the Orders
                      page. We'll notify you via email once the verification process is complete. Please check this page regularly for updates.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </section>
        )}
      </>
    );
  };
  const AddMenuItemForm = () => {
    return (
      <form onSubmit={handleSubmit} className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col m-2 bg-secondary p-4 rounded-2xl text-primary shadow-md shadow-secondary">
        <h4 className="font-bold mb-3 text-3xl border-b border-primary pb-2">
          <HiClipboardList size={24} className="inline-flex mr-2" />
          New Menu Item
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-primary/20 rounded-2xl p-4">
          <div className="relative">
            <HiShoppingCart size={20} className="absolute top-3 left-4 text-secondary" />
            <select
              name="category"
              value={newItem.category}
              onChange={(e) => {
                handleInputChange(e);
                if (e.target.value === "Add New") setShowNewCategoryInput(true);
                else setShowNewCategoryInput(false);
              }}
              className="w-full py-2 pl-10 pr-4 rounded-2xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="Add New">Add New</option>
            </select>
          </div>
          {showNewCategoryInput && (
            <div className="relative">
              <HiShoppingCart size={20} className="absolute top-3 left-4 text-secondary" />
              <input
                type="text"
                name="category"
                value={newItem.category}
                onChange={handleInputChange}
                placeholder="Enter Category Name"
                className="w-full py-2 pl-10 pr-4 rounded-2xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
              />
            </div>
          )}
          <div className="relative">
            <HiTag size={20} className="absolute top-3 left-4 text-secondary" />
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newItem.title}
              onChange={handleInputChange}
              className="w-full py-2 pl-10 pr-4 rounded-2xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="relative">
            <HiClipboard size={20} className="absolute top-3 left-4 text-secondary" />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={newItem.description}
              onChange={handleInputChange}
              className="w-full py-2 pl-10 pr-4 rounded-2xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="relative">
            <HiPhotograph size={20} className="absolute top-3 left-4 text-secondary" />
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={newItem.image}
              onChange={handleInputChange}
              className="w-full py-2 pl-10 pr-4 rounded-2xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="relative">
            <HiCurrencyDollar size={20} className="absolute top-3 left-4 text-secondary" />
            <input
              type="text"
              name="price.small"
              placeholder="Small Price"
              value={newItem.price.small}
              onChange={handleInputChange}
              className="w-full py-2 pl-10 pr-4 rounded-2xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="relative">
            <HiCurrencyDollar size={20} className="absolute top-3 left-4 text-secondary" />
            <input
              type="text"
              name="price.medium"
              placeholder="Medium Price"
              value={newItem.price.medium}
              onChange={handleInputChange}
              className="w-full py-2 pl-10 pr-4 rounded-2xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="relative">
            <HiCurrencyDollar size={20} className="absolute top-3 left-4 text-secondary" />
            <input
              type="text"
              name="price.full"
              placeholder="Full Price"
              value={newItem.price.full}
              onChange={handleInputChange}
              className="w-full py-2 pl-10 pr-4 rounded-2xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="relative">
            <HiFolderOpen size={20} className="absolute top-3 left-4 text-secondary" />
            <select
              name="genre"
              value={newItem.genre}
              onChange={handleInputChange}
              className="w-full py-2 pl-10 pr-4 rounded-2xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
            >
              <option value="veg">Veg</option>
              <option value="non-veg">Non-Veg</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 w-full py-2 pl-10 pr-4 rounded-2xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
        >
          <HiPlusCircle size={20} className="inline-flex mr-2" />
          Add Item
        </button>
      </form>
    );
  };
  // =======================================================================================================================================================================
  return (
    <main className="max-w-full mx-auto overflow-hidden bg-primary p-4">
      <Header />
      <RestaurantInformation />
      <AddMenuItemForm />
    </main>
  );
};
export default RestaurantProfilePage;
