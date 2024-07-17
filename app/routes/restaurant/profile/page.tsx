// app/routes/restaurant/profile.tsx
"use client";
import Image from "next/image";
import Loading from "./loading";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
  HiCurrencyRupee,
  HiDatabase,
  HiClipboard,
  HiFolderOpen,
  HiDocumentRemove,
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
  const [newItems, setNewItems] = useState<MenuItem[]>([]);
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const parsedHours = parseInt(hours, 10);
    const ampm = parsedHours >= 12 ? "PM" : "AM";
    const formattedHours = parsedHours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };
  const HandleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewItems((prevItems) => {
      const updatedItems = [...prevItems];
      if (name === "category") updatedItems[index].category = value;
      else if (name === "title") updatedItems[index].title = value;
      else if (name === "description") updatedItems[index].description = value;
      else if (name === "image") updatedItems[index].image = value;
      else if (name === "price.small") updatedItems[index].price.small = value;
      else if (name === "price.medium") updatedItems[index].price.medium = value;
      else if (name === "price.full") updatedItems[index].price.full = value;
      else if (name === "genre") updatedItems[index].genre = value as "veg" | "non-veg";
      return updatedItems;
    });
  };
  const HandleAddItem = () => setNewItems([...newItems, { title: "", description: "", image: "", price: { small: "", medium: "", full: "" }, genre: "veg", category: "" }]);
  const HandleRemoveItem = (index: number) => setNewItems((prevItems) => prevItems.filter((_, i) => i !== index));
  const AddMenuMutation = useMutation({
    mutationFn: async (newItems: MenuItem[]) => {
      const response = await fetch("/api/restaurant/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItems),
      });
      if (!response.ok) throw new Error("Failed to add menu items");
      return response.json();
    },
  });
  const HandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!AreAllFieldsFilled()) return;
    try {
      const data = await AddMenuMutation.mutateAsync(newItems);
      console.log(data);
      setNewItems([]);
    } catch (error) {
      console.error(error);
    }
  };
  const AreAllFieldsFilled = () => {
    return (
      newItems.length > 0 &&
      newItems.every((item) => {
        return item.title && item.description && item.image && item.price.small && item.price.medium && item.price.full && item.category && item.genre;
      })
    );
  };
  if (isLoading) return <Loading />;
  if (error) throw new Error(error.message);
  return (
    <main className="max-w-full mx-auto overflow-hidden bg-primary p-4">
      <section id="header" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col md:justify-center md:items-center sm:text-center text-secondary">
        <h1 className="text-6xl sm:text-7xl text-secondary">Welcome, {session?.user?.name}!</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2">
          Manage your restaurant page here. <br />
          Explore our tools and services.
        </h2>
        <Image src="/sns.gif" alt="sns" width={300} height={300} className="mx-auto object-cover h-80 sm:h-96 lg:h-112" />
      </section>
      {/* ======================================================================================================================================================================= */}
      {restaurantData && (
        <section id="restaurant-info" className="flex items-center justify-center">
          <section className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col m-2 bg-secondary p-2 rounded-3xl text-primary shadow-md shadow-secondary">
            <h4 className="font-bold mb-3 text-3xl border-b border-primary p-2">Restaurant Information</h4>
            <div className="bg-primary/20 rounded-b-3xl p-4">
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
                <div className="bg-green-900 text-white p-4 mt-4 rounded-3xl">
                  <p className="text-sm">Congratulations! Your restaurant details have been verified. You now have access to the Orders page.</p>
                </div>
              ) : (
                <div className="bg-red-900 text-white p-4 mt-4 rounded-3xl">
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
      {/* ======================================================================================================================================================================= */}
      <form onSubmit={HandleSubmit} className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col m-2 bg-secondary p-4 rounded-3xl text-primary shadow-md shadow-secondary">
        <h4 className="font-bold mb-3 text-3xl border-b border-primary pb-2">
          <HiClipboardList size={24} className="inline-flex mr-2" />
          New Menu Item
        </h4>
        {newItems.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-primary/20 rounded-3xl p-2 mb-8">
            <div className="relative">
              <HiShoppingCart size={20} className="absolute top-3 left-4 text-secondary" />
              <select
                name="category"
                value={item.category}
                onChange={(e) => HandleInputChange(index, e)}
                className="w-full py-2 pl-10 pr-4 rounded-3xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
              >
                <option value="">Select Category</option>
                {["Momos", "Biryani", "Kebab", "Noodles", "Drinks", "Rice", "Ice-Cream"].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
                <option value="Add New">Add New</option>
              </select>
            </div>
            <div className="relative">
              <HiTag size={20} className="absolute top-3 left-4 text-secondary" />
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={item.title}
                onChange={(e) => HandleInputChange(index, e)}
                className="w-full py-2 pl-10 pr-4 rounded-3xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div className="relative">
              <HiClipboard size={20} className="absolute top-3 left-4 text-secondary" />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={item.description}
                onChange={(e) => HandleInputChange(index, e)}
                className="w-full py-2 pl-10 pr-4 rounded-3xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div className="relative">
              <HiPhotograph size={20} className="absolute top-3 left-4 text-secondary" />
              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={item.image}
                onChange={(e) => HandleInputChange(index, e)}
                className="w-full py-2 pl-10 pr-4 rounded-3xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div className="relative">
              <HiCurrencyRupee size={20} className="absolute top-3 left-4 text-secondary" />
              <input
                type="text"
                name="price.small"
                placeholder="Small Price"
                value={item.price.small}
                onChange={(e) => HandleInputChange(index, e)}
                className="w-full py-2 pl-10 pr-4 rounded-3xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div className="relative">
              <HiCurrencyRupee size={20} className="absolute top-3 left-4 text-secondary" />
              <input
                type="text"
                name="price.medium"
                placeholder="Medium Price"
                value={item.price.medium}
                onChange={(e) => HandleInputChange(index, e)}
                className="w-full py-2 pl-10 pr-4 rounded-3xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div className="relative">
              <HiCurrencyRupee size={20} className="absolute top-3 left-4 text-secondary" />
              <input
                type="text"
                name="price.full"
                placeholder="Full Price"
                value={item.price.full}
                onChange={(e) => HandleInputChange(index, e)}
                className="w-full py-2 pl-10 pr-4 rounded-3xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div className="relative">
              <HiFolderOpen size={20} className="absolute top-3 left-4 text-secondary" />
              <select
                name="genre"
                value={item.genre}
                onChange={(e) => HandleInputChange(index, e)}
                className="w-full py-2 pl-10 pr-4 rounded-3xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
                required
              >
                <option value="">Select Genre</option>
                <option value="veg">Veg</option>
                <option value="non-veg">Non-Veg</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => HandleRemoveItem(index)}
              className="w-1/2 py-2 pl-10 pr-4 rounded-3xl transition duration-700 ease-in-out bg-primary hover:bg-tertiary text-secondary border-2 border-secondary shadow-md shadow-secondary placeholder-secondary focus:border-primary focus:ring-primary"
            >
              <HiDocumentRemove size={20} className="inline-flex mr-2" />
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={HandleAddItem}
          className="mt-2 w-full py-2 pl-10 pr-4 rounded-3xl transition duration-700 ease-in-out bg-primary hover:bg-tertiary text-secondary border-2 border-secondary shadow-md shadow-secondary placeholder-secondary focus:border-primary focus:ring-primary"
        >
          <HiPlusCircle size={20} className="inline-flex mr-2" />
          Add More
        </button>
        {AreAllFieldsFilled() && (
          <button
            type="submit"
            className="mt-2 w-full py-2 pl-10 pr-4 rounded-3xl transition duration-700 ease-in-out bg-primary hover:bg-tertiary text-secondary border-2 border-secondary shadow-md shadow-secondary placeholder-secondary focus:border-primary focus:ring-primary"
          >
            <HiDatabase size={20} className="inline-flex mr-2" />
            Submit
          </button>
        )}
      </form>
    </main>
  );
};
export default RestaurantProfilePage;
