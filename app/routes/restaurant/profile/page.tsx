// app/routes/restaurant/profile/page.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import Loading from "./loading";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { TypeAnimation } from "react-type-animation";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserData, Category, FoodItem, Restaurant } from "@/app/_assets/types/cart";
import { MdEditSquare, MdClose, MdDelete, MdFastfood, MdFoodBank, MdImage, MdCheckCircle, MdRemoveCircle, MdTitle } from "react-icons/md";

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [modalType, setModalType] = useState("");
  const [isChecking, setIsChecking] = useState(true);
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
    queryKey: ["restaurantData", userData?.customerEmail],
    queryFn: async () => {
      const response = await fetch(`/api/restaurant?email=${userData?.customerEmail}`);
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    enabled: !!userData,
  });
  useEffect(() => {
    if (userData && !isRestaurantLoading) {
      if (!restaurantData || !restaurantData.verified) router.push("/routes/restaurant/register");
      setIsChecking(false);
    }
  }, [userData, isRestaurantLoading, restaurantData, router]);
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
      queryClient.invalidateQueries({ queryKey: ["restaurantData", userData?.customerEmail] });
      setIsModalOpen(false);
    },
  });
  const editCategory = useMutation({
    mutationFn: async (data: { id: number; title: string; image: string }) => {
      const response = await fetch("/api/restaurant/category", {
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
  const deleteCategory = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch("/api/restaurant/category", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["restaurantData"] }),
  });
  const addItem = useMutation({
    mutationFn: async (data: Omit<FoodItem, "id"> & { categoryId: number }) => {
      const response = await fetch("/api/restaurant/item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, restaurantId: restaurantData?.id }),
      });
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
      const response = await fetch("/api/restaurant/item", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["restaurantData"] }),
  });
  const submitRenderModal = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const price = {
      small: data.smallPrice,
      medium: data.mediumPrice,
      full: data.fullPrice,
    };
    switch (modalType) {
      case "addCategory":
        addCategory.mutate(data as { title: string; image: string });
        break;
      case "editCategory":
        editCategory.mutate({ id: selectedCategory!.id, ...data } as {
          id: number;
          title: string;
          image: string;
        });
        break;
      case "addItem":
        addItem.mutate({
          ...data,
          price,
          rating: 0,
          categoryId: selectedCategory!.id,
        } as Omit<FoodItem, "id"> & { categoryId: number });
        break;
      case "editItem":
        editItem.mutate({
          ...(selectedItem as FoodItem),
          ...data,
          price,
          rating: 0,
          categoryId: selectedCategory!.id,
        } as FoodItem & { categoryId: number });
        break;
    }
  };
  if (isUserLoading || isRestaurantLoading || isChecking) return <Loading />;
  if (!restaurantData) return null;
  if (userError) throw userError;
  return (
    <main className="max-w-full mx-auto overflow-hidden bg-primary p-4 relative">
      <section id="header" className="flex flex-col md:justify-center md:items-center sm:text-center text-secondary">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-secondary">
          <TypeAnimation sequence={["Restaurant Profile", 2000]} repeat={Infinity} wrapper="span" speed={2} />
        </h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2">Manage Your Restaurant Orders and Items</h2>
      </section>
      {restaurantData && (
        <section id="restaurant-data" className="max-w-2xl sm:max-w-4xl md:max-w-6xl lg:max-w-7xl mx-auto py-4">
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => {
                setModalType("addCategory");
                setIsModalOpen(true);
              }}
              className="w-full p-2 mb-4 text-lg transition duration-700 ease-in-out transform rounded-xl bg-secondary/80 hover:bg-secondary text-primary flex items-center justify-center border-2 border-secondary shadow-md shadow-secondary"
            >
              Add New Category
            </button>
            <Link
              href="/routes/restaurant/orders"
              className="w-full p-2 mb-4 text-lg transition duration-700 ease-in-out transform rounded-xl bg-secondary/80 hover:bg-secondary text-primary flex items-center justify-center border-2 border-secondary shadow-md shadow-secondary"
            >
              Restaurant Orders
            </Link>
          </div>
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {restaurantData.categories?.map(
              (category: Category, index) =>
                category.title !== "All" && (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex flex-col rounded-xl overflow-hidden h-full shadow-md shadow-secondary border-4 border-double border-secondary"
                  >
                    <Image unoptimized width={540} height={540} src={category.image} alt={category.title} className="object-cover w-full h-48" />
                    <div className="text-primary flex flex-col justify-between bg-secondary flex-grow p-1">
                      <div className="p-2">
                        <div className="flex flex-col">
                          <h2 className="font-bold text-2xl">{category.title}</h2>
                          <span className="text-lg">Total Items: {category.items.length}</span>
                        </div>
                        <div className="flex justify-center mt-6">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCategory(category);
                              setModalType("editCategory");
                              setIsModalOpen(true);
                            }}
                            className="w-full p-1 text-sm transition duration-700 ease-in-out transform rounded-l-xl bg-primary hover:bg-tertiary text-secondary flex items-center justify-center gap-1 border-2 border-secondary"
                          >
                            <MdEditSquare /> Edit Catg.
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCategory.mutate(category.id);
                            }}
                            className="w-full p-1 text-sm transition duration-700 ease-in-out transform bg-red-900 hover:bg-red-800 text-primary flex items-center justify-center gap-1 border-2 border-secondary"
                          >
                            <MdDelete /> Delete Catg.
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCategory(category);
                              setIsDetailModalOpen(true);
                            }}
                            className="w-full p-1 text-sm transition duration-700 ease-in-out transform rounded-r-xl bg-primary hover:bg-tertiary text-secondary flex items-center justify-center gap-1 border-2 border-secondary"
                          >
                            <MdFastfood /> Edit Items
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
            )}
          </div>
        </section>
      )}
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
                <h2 className="font-bold text-4xl">{modalType.charAt(0).toUpperCase() + modalType.slice(1)}</h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <MdClose size={30} className="text-primary bg-secondary rounded-xl animate-spin" />
                </button>
              </div>
              <form onSubmit={submitRenderModal} className="bg-primary/20 rounded-xl p-2">
                <Image
                  unoptimized
                  width={540}
                  height={540}
                  src={selectedCategory?.image!}
                  alt={selectedCategory?.title!}
                  className="object-cover w-full h-48 border-2 border-secondary shadow-md shadow-secondary rounded-xl mb-6"
                />
                {(modalType === "addCategory" || modalType === "editCategory") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
                    <div className="mb-2">
                      <span className="flex items-center ml-2 gap-1">
                        <MdTitle /> Set New Category Title
                      </span>
                      <input
                        required
                        type="text"
                        name="title"
                        placeholder="Category Title"
                        defaultValue={selectedCategory?.title}
                        className="w-full py-2 rounded-xl bg-secondary border-2 border-secondary text-primary placeholder-secondary focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div className="mb-2">
                      <span className="flex items-center ml-2 gap-2">
                        <MdImage /> Set New Image URL
                      </span>
                      <input
                        required
                        type="text"
                        name="image"
                        placeholder="Image URL"
                        defaultValue={selectedCategory?.image}
                        className="w-full py-2 rounded-xl bg-secondary border-2 border-secondary text-primary placeholder-secondary focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                )}
                {(modalType === "addItem" || modalType === "editItem") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
                    <div className="mb-2">
                      <span className="flex items-center ml-2 gap-2">
                        <MdTitle /> Item Title
                      </span>
                      <input
                        required
                        type="text"
                        name="title"
                        placeholder="Item Title"
                        defaultValue={selectedItem?.title}
                        className="w-full py-2 rounded-xl bg-secondary border-2 border-secondary text-primary placeholder-secondary focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div className="mb-2">
                      <span className="flex items-center ml-2 gap-2">
                        <MdImage /> Image URL
                      </span>
                      <input
                        required
                        type="text"
                        name="image"
                        placeholder="Image URL"
                        defaultValue={selectedItem?.image}
                        className="w-full py-2 rounded-xl bg-secondary border-2 border-secondary text-primary placeholder-secondary focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div className="mb-2">
                      <span className="flex items-center ml-2 gap-2">
                        <MdFoodBank /> Small Price
                      </span>
                      <input
                        required
                        type="text"
                        name="smallPrice"
                        placeholder="Small Price"
                        defaultValue={selectedItem?.price?.small}
                        className="w-full py-2 rounded-xl bg-secondary border-2 border-secondary text-primary placeholder-secondary focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div className="mb-2">
                      <span className="flex items-center ml-2 gap-2">
                        <MdFoodBank /> Medium Price
                      </span>
                      <input
                        required
                        type="text"
                        name="mediumPrice"
                        placeholder="Medium Price"
                        defaultValue={selectedItem?.price?.medium}
                        className="w-full py-2 rounded-xl bg-secondary border-2 border-secondary text-primary placeholder-secondary focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div className="mb-2">
                      <span className="flex items-center ml-2 gap-2">
                        <MdFoodBank /> Full Price
                      </span>
                      <input
                        required
                        type="text"
                        name="fullPrice"
                        placeholder="Full Price"
                        defaultValue={selectedItem?.price?.full}
                        className="w-full py-2 rounded-xl bg-secondary border-2 border-secondary text-primary placeholder-secondary focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div className="mb-2">
                      <span className="flex items-center ml-2 gap-2">
                        <MdFastfood /> Veg or Non-Veg
                      </span>
                      <select
                        required
                        name="genre"
                        defaultValue={selectedItem?.genre}
                        className="w-full py-2 rounded-xl bg-secondary border-2 border-secondary text-primary placeholder-secondary focus:border-primary focus:ring-primary"
                      >
                        <option value="veg">Vegetarian</option>
                        <option value="non-veg">Non-Vegetarian</option>
                      </select>
                    </div>
                    <div className="mb-2">
                      <span className="flex items-center ml-2 gap-2">
                        <MdEditSquare /> Item Description
                      </span>
                      <textarea
                        required
                        name="description"
                        placeholder="Item Description"
                        defaultValue={selectedItem?.description}
                        className="w-full py-2 rounded-xl bg-secondary border-2 border-secondary text-primary placeholder-secondary focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                )}
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
      <AnimatePresence>
        {isDetailModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            exit={{ opacity: 0, y: "100%", transition: { duration: 0.2 } }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
            className="fixed bottom-0 left-0 right-0 w-full max-w-4xl mx-auto bg-secondary/60 backdrop-blur-3xl shadow-md shadow-secondary border-4 border-double border-secondary text-primary rounded-t-xl flex justify-center max-h-[80vh] z-50"
          >
            <div className="p-4 w-full scrollbar-thin scrollbar-thumb-secondary scrollbar-track-primary overflow-x-auto overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-4xl">Category: {selectedCategory?.title}</h2>
                <button onClick={() => setIsDetailModalOpen(false)}>
                  <MdClose size={30} className="text-primary bg-secondary rounded-xl animate-spin" />
                </button>
              </div>
              <div className="flex justify-between mb-4">
                <button
                  onClick={() => {
                    setSelectedCategory(selectedCategory);
                    setModalType("addItem");
                    setIsModalOpen(true);
                    setIsDetailModalOpen(false);
                  }}
                  className="w-full p-2 text-lg transition duration-700 ease-in-out transform rounded-l-xl bg-primary hover:bg-tertiary text-secondary flex items-center justify-center gap-1 border-2 border-secondary"
                >
                  <MdCheckCircle /> Add New Item
                </button>
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="w-full p-2 text-lg transition duration-700 ease-in-out transform rounded-r-xl bg-red-900 hover:bg-red-800 text-primary flex items-center justify-center gap-1 border-2 border-secondary"
                >
                  <MdRemoveCircle /> Cancel & Close
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedCategory?.items.map((item: FoodItem, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex flex-col rounded-xl overflow-hidden h-full shadow-md shadow-secondary border-4 border-double border-primary/20"
                  >
                    <Image unoptimized width={540} height={540} src={item.image} alt={item.title} className="object-cover w-full h-48" />
                    <div className="text-primary bg-secondary flex-grow">
                      <div className="flex flex-col">
                        <div className="flex justify-between mb-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem(item);
                              setModalType("editItem");
                              setIsModalOpen(true);
                              setIsDetailModalOpen(false);
                            }}
                            className="w-full p-2 text-sm transition duration-700 ease-in-out transform bg-primary hover:bg-tertiary text-secondary flex items-center justify-center gap-1 border-2 border-secondary"
                          >
                            <MdCheckCircle /> Edit Item
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              item.id && deleteItem.mutate(item.id);
                            }}
                            className="w-full p-2 text-sm transition duration-700 ease-in-out transform bg-red-900 hover:bg-red-800 text-primary flex items-center justify-center gap-1 border-2 border-secondary"
                          >
                            <MdRemoveCircle /> Delete Item
                          </button>
                        </div>
                        <div className="font-bold gap-2 flex items-center justify-center text-center text-lg">{item.title}</div>
                        <p className="flex items-center justify-center text-center m-4">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {(isModalOpen || isDetailModalOpen) && <div className="fixed inset-0 bg-primary/50 backdrop-blur-3xl z-40"></div>}
    </main>
  );
}
