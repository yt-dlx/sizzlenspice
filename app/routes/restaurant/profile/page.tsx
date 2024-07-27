// app/routes/restaurant/profile/page.tsx
"use client";
import Image from "next/image";
import Loading from "./loading";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserData, Category, FoodItem, Restaurant } from "@/app/_assets/types/cart";

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [modalType, setModalType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const {
    isLoading: isUserLoading,
    error: userError,
    data: userData,
  } = useQuery<UserData>({
    queryKey: ["userData", session?.user?.email],
    queryFn: async () => {
      const response = await fetch("/api/user");
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
  });
  const { data: restaurantData, isLoading: isRestaurantLoading } = useQuery<Restaurant>({
    queryKey: ["restaurantData"],
    queryFn: async () => {
      const response = await fetch("/api/restaurant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "SizzleNSpice", email: userData?.customerEmail, phoneNumber: userData?.phoneNumber }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    enabled: !!userData,
  });
  const addCategory = useMutation({
    mutationFn: async (data: { title: string; image: string }) => {
      const response = await fetch("/api/restaurant/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, restaurantId: restaurantData?.id, active: false }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurantData"] });
      setIsModalOpen(false);
    },
  });
  const editCategory = useMutation({
    mutationFn: async (data: { id: number; title: string; image: string }) => {
      const response = await fetch("/api/restaurant/category", { method: "PUT", body: JSON.stringify(data), headers: { "Content-Type": "application/json" } });
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurantData"] });
      setIsModalOpen(false);
    },
  });
  const deleteCategory = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch("/api/restaurant/category", { method: "DELETE", body: JSON.stringify({ id }), headers: { "Content-Type": "application/json" } });
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["restaurantData"] }),
  });
  const addItem = useMutation({
    mutationFn: async (data: Omit<FoodItem, "id"> & { categoryId: number }) => {
      const response = await fetch("/api/restaurant/item", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, restaurantId: restaurantData?.id }) });
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurantData"] });
      setIsModalOpen(false);
    },
  });
  const editItem = useMutation({
    mutationFn: async (data: FoodItem & { categoryId: number }) => {
      const response = await fetch("/api/restaurant/item", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurantData"] });
      setIsModalOpen(false);
    },
  });
  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch("/api/restaurant/item", { method: "DELETE", body: JSON.stringify({ id }), headers: { "Content-Type": "application/json" } });
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["restaurantData"] }),
  });
  if (isUserLoading || isRestaurantLoading) return <Loading />;
  if (userError) throw userError;
  const renderModal = () => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());
      switch (modalType) {
        case "addCategory":
          addCategory.mutate(data as { title: string; image: string });
          break;
        case "editCategory":
          editCategory.mutate({ id: selectedCategory!.id, ...data } as { id: number; title: string; image: string });
          break;
        case "addItem":
          addItem.mutate({
            ...data,
            price: JSON.parse(data.price as string),
            rating: parseFloat(data.rating as string),
            categoryId: selectedCategory!.id,
          } as Omit<FoodItem, "id"> & { categoryId: number });
          break;
        case "editItem":
          editItem.mutate({
            ...(selectedItem as FoodItem),
            ...data,
            price: JSON.parse(data.price as string),
            rating: parseFloat(data.rating as string),
            categoryId: selectedCategory!.id,
          } as FoodItem & { categoryId: number });
          break;
      }
    };
    return (
      <motion.div
        initial={{ opacity: 0, y: "100%" }}
        exit={{ opacity: 0, y: "100%", transition: { duration: 0.2 } }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
        className="fixed bottom-0 left-0 right-0 w-full max-w-4xl mx-auto bg-secondary/60 backdrop-blur-2xl shadow-md shadow-secondary border-4 border-double border-secondary text-primary rounded-t-xl flex justify-center max-h-[80vh] z-50"
      >
        <div className="p-4 w-full overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-4xl">{modalType.charAt(0).toUpperCase() + modalType.slice(1)}</h2>
            <button onClick={() => setIsModalOpen(false)}>
              <MdClose size={24} className="text-primary bg-secondary rounded-xl animate-spin" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            {(modalType === "addCategory" || modalType === "editCategory") && (
              <>
                <input type="text" name="title" placeholder="Category Title" defaultValue={selectedCategory?.title} className="w-full p-2 mb-2 rounded-xl bg-primary text-secondary" required />
                <input type="text" name="image" placeholder="Image URL" defaultValue={selectedCategory?.image} className="w-full p-2 mb-2 rounded-xl bg-primary text-secondary" required />
              </>
            )}
            {(modalType === "addItem" || modalType === "editItem") && (
              <>
                <input type="text" name="title" placeholder="Item Title" defaultValue={selectedItem?.title} className="w-full p-2 mb-2 rounded-xl bg-primary text-secondary" required />
                <textarea name="description" placeholder="Item Description" defaultValue={selectedItem?.description} className="w-full p-2 mb-2 rounded-xl bg-primary text-secondary" required />
                <input type="text" name="image" placeholder="Image URL" defaultValue={selectedItem?.image} className="w-full p-2 mb-2 rounded-xl bg-primary text-secondary" required />
                <input
                  required
                  type="text"
                  name="price"
                  defaultValue={JSON.stringify(selectedItem?.price)}
                  className="w-full p-2 mb-2 rounded-xl bg-primary text-secondary"
                  placeholder='Price (e.g., {"small": "10", "medium": "15", "full": "20"})'
                />
                <select name="genre" defaultValue={selectedItem?.genre} className="w-full p-2 mb-2 rounded-xl bg-primary text-secondary" required>
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                </select>
                <input
                  required
                  min="0"
                  max="5"
                  step="0.1"
                  type="number"
                  name="rating"
                  placeholder="Rating"
                  defaultValue={selectedItem?.rating}
                  className="w-full p-2 mb-2 rounded-xl bg-primary text-secondary"
                />
              </>
            )}
            <div className="flex justify-between">
              <button type="submit" className="w-full p-2 rounded-xl bg-primary text-secondary hover:bg-tertiary transition duration-300">
                Submit
              </button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="w-full p-2 rounded-xl bg-red-700 text-secondary hover:bg-red-800 transition duration-300">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    );
  };
  const renderDetailModal = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: "100%" }}
        exit={{ opacity: 0, y: "100%", transition: { duration: 0.2 } }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
        className="fixed bottom-0 left-0 right-0 w-full max-w-4xl mx-auto bg-secondary/60 backdrop-blur-2xl shadow-md shadow-secondary border-4 border-double border-secondary text-primary rounded-t-xl flex justify-center max-h-[80vh] z-50"
      >
        <div className="p-4 w-full overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-4xl">{selectedCategory?.title}</h2>
            <button onClick={() => setIsDetailModalOpen(false)}>
              <MdClose size={24} className="text-primary bg-secondary rounded-xl animate-spin" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {selectedCategory?.items.map((item: FoodItem) => (
              <div key={item.id} className="flex flex-col rounded-xl overflow-hidden h-full shadow-md shadow-secondary border-4 border-double border-secondary">
                <Image width={540} height={540} src={item.image} alt={item.title} className="object-cover w-full h-48" />
                <div className="text-primary flex flex-col justify-between bg-secondary flex-grow p-4">
                  <div className="flex justify-between items-center">
                    <h2 className="font-bold text-lg">{item.title}</h2>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                        setModalType("editItem");
                        setIsModalOpen(true);
                        setIsDetailModalOpen(false);
                      }}
                      className="text-xs bg-primary hover:bg-tertiary text-secondary p-1 rounded-xl transition duration-300"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm">{item.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm">Price: {JSON.stringify(item.price)}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          item.id && deleteItem.mutate(item.id);
                        }}
                        className="text-xs bg-red-700 hover:bg-red-800 text-primary p-1 rounded-xl transition duration-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              setSelectedCategory(selectedCategory);
              setModalType("addItem");
              setIsModalOpen(true);
              setIsDetailModalOpen(false);
            }}
            className="mt-4 text-sm bg-primary hover:bg-tertiary text-secondary p-1 rounded-xl transition duration-300"
          >
            Add Item
          </button>
          <button type="button" onClick={() => setIsDetailModalOpen(false)} className="mt-4 text-sm bg-red-700 hover:bg-red-800 text-secondary p-1 rounded-xl transition duration-300">
            Cancel
          </button>
        </div>
      </motion.div>
    );
  };
  return (
    <main className="max-w-full mx-auto overflow-hidden bg-primary p-4">
      <section id="header" className="flex flex-col md:justify-center md:items-center sm:text-center text-secondary">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-secondary">Restaurant Admin Portal</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2">Manage Your Restaurant Profile</h2>
      </section>
      {restaurantData && (
        <section id="restaurant-data" className="max-w-2xl sm:max-w-4xl md:max-w-6xl lg:max-w-7xl mx-auto py-4">
          <button
            onClick={() => {
              setModalType("addCategory");
              setIsModalOpen(true);
            }}
            className="mb-4 px-4 py-2 bg-secondary text-primary rounded-xl hover:bg-tertiary transition duration-300"
          >
            Add New Category
          </button>
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {restaurantData.categories?.map((category: Category) => (
              <div
                key={category.id}
                className="flex flex-col rounded-xl overflow-hidden h-full shadow-md shadow-secondary border-4 border-double border-secondary cursor-pointer"
                onClick={() => {
                  setSelectedCategory(category);
                  setIsDetailModalOpen(true);
                }}
              >
                <Image width={540} height={540} src={category.image} alt={category.title} className="object-cover w-full h-48" />
                <div className="text-primary flex flex-col justify-between bg-secondary flex-grow p-4">
                  <div className="flex justify-between items-center">
                    <h2 className="font-bold text-lg">{category.title}</h2>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCategory(category);
                        setModalType("editCategory");
                        setIsModalOpen(true);
                      }}
                      className="text-sm bg-primary hover:bg-tertiary text-secondary p-1 rounded-xl transition duration-300"
                    >
                      Edit Category
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCategory.mutate(category.id);
                      }}
                      className="text-sm bg-red-700 hover:bg-red-800 text-primary p-1 rounded-xl transition duration-300"
                    >
                      Delete Category
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      <AnimatePresence>{isModalOpen && renderModal()}</AnimatePresence>
      <AnimatePresence>{isDetailModalOpen && renderDetailModal()}</AnimatePresence>
    </main>
  );
};

export default ProfilePage;
