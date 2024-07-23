// app/routes/restaurant/profile/page.tsx
"use client";
import Image from "next/image";
import Loading from "./loading";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Category, Price, CartItem } from "@/app/_assets/types/cart";
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaImage, FaTag, FaKeyboard, FaAlignLeft, FaRupeeSign } from "react-icons/fa";

export default function RestaurantProfilePage() {
  const queryClient = useQueryClient();
  const originalItemsRef = useRef<CartItem[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [deletingItemIndex, setDeletingItemIndex] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState<Category>({ id: 0, image: "", title: "", active: false, items: [] });
  const [isCategoryEdited, setIsCategoryEdited] = useState(false);
  const categoryFields = [
    { name: "title", label: "Category Title" },
    { name: "image", label: "Category Image Link" },
  ];
  const itemFields = [
    { name: "title", placeholder: "Title" },
    { name: "genre", placeholder: "Genre" },
    { name: "image", placeholder: "Image URL" },
    { name: "description", placeholder: "Description" },
  ];
  const priceFields = [
    { name: "full", placeholder: "Full" },
    { name: "medium", placeholder: "Medium" },
    { name: "small", placeholder: "Small" },
  ];
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/restaurant");
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
  });
  const createMutation = useMutation({
    mutationFn: async (category: Category) => {
      const response = await fetch("/api/restaurant", {
        method: "POST",
        body: JSON.stringify(category),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
  const updateMutation = useMutation({
    mutationFn: async (category: Category) => {
      const response = await fetch("/api/restaurant", {
        method: "PUT",
        body: JSON.stringify({ ...category, id: category.id }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
    setIsCategoryEdited(true);
  };
  const handleAddItem = () => {
    setNewCategory((prev) => {
      const updatedCategory = { ...prev, items: [...prev.items, { title: "", description: "", image: "", price: { small: "", medium: "", full: "" }, genre: "", rating: 1 }] };
      createMutation.mutate(updatedCategory);
      return updatedCategory;
    });
  };
  const handleItemChange = (index: number, field: keyof CartItem, value: string | number) => {
    setNewCategory((prev) => ({ ...prev, items: prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)) }));
  };
  const handlePriceChange = (index: number, priceType: keyof Price, value: string) => {
    setNewCategory((prev) => ({ ...prev, items: prev.items.map((item, i) => (i === index ? { ...item, price: { ...item.price, [priceType]: value } } : item)) }));
  };
  const handleEditCategory = (category: Category) => {
    setNewCategory(category);
    originalItemsRef.current = JSON.parse(JSON.stringify(category.items));
    setIsEditMode(true);
    setIsModalOpen(true);
  };
  const isItemEdited = (index: number) => {
    const originalItem = originalItemsRef.current[index];
    const currentItem = newCategory.items[index];
    return JSON.stringify(originalItem) !== JSON.stringify(currentItem);
  };
  const handleDeleteItem = (index: number) => {
    if (deletingItemIndex === index) {
      setNewCategory((prev) => {
        const updatedCategory = { ...prev, items: prev.items.filter((_, i) => i !== index) };
        if (isEditMode) updateMutation.mutate(updatedCategory);
        else createMutation.mutate(updatedCategory);
        return updatedCategory;
      });
      setDeletingItemIndex(null);
    } else setDeletingItemIndex(index);
  };
  const handleEditItem = (index: number) => {
    if (editingItemIndex === index) {
      if (isEditMode) updateMutation.mutate(newCategory);
      else createMutation.mutate(newCategory);
      setEditingItemIndex(null);
    } else setEditingItemIndex(index);
  };
  const cancelItemAction = (index: number) => {
    if (deletingItemIndex === index) {
      setDeletingItemIndex(null);
    } else if (editingItemIndex === index) {
      setNewCategory((prev) => ({
        ...prev,
        items: prev.items.map((item, i) => (i === index ? originalItemsRef.current[index] : item)),
      }));
      setEditingItemIndex(null);
    }
  };
  const resetForm = () => {
    setNewCategory({ id: 0, image: "", title: "", active: false, items: [] });
    setDeletingItemIndex(null);
    setEditingItemIndex(null);
    setIsModalOpen(false);
    setIsEditMode(false);
    setIsCategoryEdited(false);
    originalItemsRef.current = [];
  };
  if (isLoading) return <Loading />;
  if (isError) throw new Error("An error occurred");
  return (
    <main className="max-w-full mx-auto overflow-hidden bg-primary p-4">
      <section id="header" className="flex flex-col md:justify-center md:items-center sm:text-center text-secondary mb-8">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-secondary">Restaurant Profile</h1>
        <h2 className="text-lg sm:text-2xl md:text-xl py-2">Manage Your Menu Categories</h2>
      </section>
      <section id="categories" className="max-w-2xl sm:max-w-4xl md:max-w-6xl lg:max-w-7xl mx-auto py-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {categories
            .filter((category: Category) => category.title !== "All")
            .map((category: Category, index: number) => (
              <div key={index} className="flex flex-col rounded-xl overflow-hidden shadow-md shadow-secondary border-4 border-double border-secondary">
                <Image width={540} height={540} src={category.image} alt={category.title} className="object-cover w-full h-48" />
                <div className="text-primary flex flex-col justify-between rounded-b-xl bg-secondary flex-grow p-4">
                  <h3 className="font-semibold text-lg">{category.title}</h3>
                  <p className="text-sm mt-2">Items: {category.items.length}</p>
                  <p className="text-sm mt-2">Status: {category.active ? "Active" : "Inactive"}</p>
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="mt-4 text-xs bg-primary text-secondary p-2 rounded-xl hover:bg-tertiary transition duration-300 flex items-center justify-center"
                  >
                    <FaEdit /> Edit Category
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>
      <section id="add-category" className="max-w-2xl sm:max-w-4xl md:max-w-6xl lg:max-w-7xl mx-auto py-4">
        <button onClick={() => setIsModalOpen(true)} className="text-lg font-semibold bg-secondary text-primary p-2 rounded-xl ">
          Add New Category
        </button>
      </section>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.1 } }}
            exit={{ opacity: 0, y: "100%", transition: { duration: 0.1 } }}
            className="fixed inset-0 backdrop-blur-3xl bg-secondary/80 flex items-center justify-center z-50"
          >
            <div className="bg-primary/40 backdrop-blur-lg text-primary rounded-xl p-4 max-w-2xl sm:max-w-4xl md:max-w-6xl lg:max-w-7xl  w-full max-h-[90vh] overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-secondary/10 border-4 border-double border-secondary shadow-md shadow-secondary">
              <h2 className="text-6xl text-primary font-bold mb-6">{isEditMode ? "Edit Category" : "Add New Category"}</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 bg-secondary p-4 rounded-xl">
                  {categoryFields.map(({ name, label }) => (
                    <div key={name}>
                      <label className="ml-2 text-primary mt-2 flex items-center gap-2">
                        {name === "title" && <FaTag />}
                        {name === "image" && <FaImage />}
                        {label}
                      </label>
                      <div className="relative">
                        <input
                          required
                          type="text"
                          name={name}
                          value={(newCategory as any)[name]}
                          onChange={handleCategoryChange}
                          className="w-full p-2 text-lg transition duration-700 ease-in-out transform rounded-xl border-2 border-secondary bg-primary hover:bg-tertiary text-secondary flex items-center justify-center"
                        />
                        {isCategoryEdited && (
                          <button
                            type="button"
                            onClick={() => {
                              if (isEditMode) updateMutation.mutate(newCategory);
                              else createMutation.mutate(newCategory);
                              setIsCategoryEdited(false);
                            }}
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-green-600 text-primary px-2 py-1 rounded-full hover:bg-green-700 transition duration-300 flex items-center justify-center gap-2"
                          >
                            <FaCheck />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {newCategory.items.map((item, index) => (
                  <div key={index} className="p-4 rounded-xl mb-4 bg-secondary backdrop-blur-xl shadow-md shadow-secondary">
                    <div className="grid grid-cols-2">
                      {itemFields.map(({ name, placeholder }) => (
                        <div key={name} className="w-full">
                          <label htmlFor={`item-${name}-${index}`} className="ml-2 text-primary mt-2 flex items-center gap-2">
                            {name === "title" && <FaKeyboard />}
                            {name === "genre" && <FaKeyboard />}
                            {name === "image" && <FaImage />}
                            {name === "description" && <FaAlignLeft />}
                            {placeholder}
                          </label>
                          <input
                            required
                            id={`item-${name}-${index}`}
                            type="text"
                            placeholder={placeholder}
                            value={(item as any)[name]}
                            onChange={(e) => handleItemChange(index, name as keyof CartItem, e.target.value)}
                            className="w-full text-lg transition duration-700 ease-in-out transform rounded-xl border-2 border-secondary bg-primary hover:bg-tertiary text-secondary flex items-center justify-center"
                          />
                        </div>
                      ))}
                      {priceFields.map(({ name, placeholder }) => (
                        <div key={name} className="w-full">
                          <label htmlFor={`price-${name}-${index}`} className="ml-2 text-primary mt-2 flex items-center gap-2">
                            <FaRupeeSign />
                            {placeholder} Plate Price
                          </label>
                          <input
                            required
                            id={`price-${name}-${index}`}
                            type="text"
                            placeholder={placeholder}
                            value={(item.price as any)[name]}
                            onChange={(e) => handlePriceChange(index, name as keyof Price, e.target.value)}
                            className="w-full text-lg transition duration-700 ease-in-out transform rounded-xl border-2 border-secondary bg-primary hover:bg-tertiary text-secondary flex items-center justify-center"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center mt-2 gap-0.5">
                      {deletingItemIndex === index ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(index)}
                            className="w-1/2 bg-green-600 text-primary p-2 rounded-xl hover:bg-green-700 transition duration-300 flex items-center justify-center gap-2"
                          >
                            <FaCheck /> Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => cancelItemAction(index)}
                            className="w-1/2 bg-red-900 text-primary p-2 rounded-xl hover:bg-red-800 transition duration-300 flex items-center justify-center gap-2"
                          >
                            <FaTimes /> Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(index)}
                          className="w-full bg-red-900 text-primary p-2 rounded-xl hover:bg-red-800 transition duration-300 flex items-center justify-center gap-2"
                        >
                          <FaTrash /> Delete Item
                        </button>
                      )}
                      {isItemEdited(index) && (
                        <>
                          {editingItemIndex === index ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleEditItem(index)}
                                className="w-1/2 bg-green-600 text-primary p-2 rounded-xl hover:bg-green-700 transition duration-300 flex items-center justify-center gap-2"
                              >
                                <FaCheck /> Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => cancelItemAction(index)}
                                className="w-1/2 bg-red-900 text-primary p-2 rounded-xl hover:bg-red-800 transition duration-300 flex items-center justify-center gap-2"
                              >
                                <FaTimes /> Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleEditItem(index)}
                              className="w-full bg-yellow-600 text-primary p-2 rounded-xl hover:bg-yellow-700 transition duration-300 flex items-center justify-center gap-2"
                            >
                              <FaEdit /> Edit Item
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="w-full p-2 text-lg transition duration-700 ease-in-out transform rounded-xl bg-secondary/80 hover:bg-secondary text-primary flex items-center justify-center gap-2"
                  >
                    <FaPlus /> Add More Item
                  </button>
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-full p-2 text-lg transition duration-700 ease-in-out transform rounded-xl bg-primary hover:bg-tertiary text-secondary flex items-center justify-center gap-2"
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
