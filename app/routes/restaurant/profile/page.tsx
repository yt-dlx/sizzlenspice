// app/routes/restaurant/profile/page.tsx
"use client";
import Image from "next/image";
import Loading from "./loading";
import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import type { Category, Price, CartItem } from "@/app/_assets/types/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function RestaurantProfilePage() {
  const queryClient = useQueryClient();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmEditIndex, setConfirmEditIndex] = useState<number | null>(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState<Category>({ id: 0, image: "", title: "", active: false, items: [] });
  const categoryFields = [
    { name: "image", label: "Category Image URL" },
    { name: "title", label: "Category Title" },
  ];
  const itemFields = [
    { name: "title", placeholder: "Title" },
    { name: "description", placeholder: "Description" },
    { name: "image", placeholder: "Image URL" },
    { name: "genre", placeholder: "Genre" },
  ];
  const priceFields = [
    { name: "small", placeholder: "Small" },
    { name: "medium", placeholder: "Medium" },
    { name: "full", placeholder: "Full" },
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      resetForm();
    },
  });
  const updateMutation = useMutation({
    mutationFn: async (category: Category) => {
      const response = await fetch(`/api/restaurant/${category.id}`, {
        method: "PUT",
        body: JSON.stringify(category),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      resetForm();
    },
  });
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddItem = () => {
    setNewCategory((prev) => ({
      ...prev,
      items: [...prev.items, { title: "", description: "", image: "", price: { small: "", medium: "", full: "" }, genre: "", rating: 1 }],
    }));
  };
  const handleItemChange = (index: number, field: keyof CartItem, value: string | number) => {
    setNewCategory((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };
  const handlePriceChange = (index: number, priceType: keyof Price, value: string) => {
    setNewCategory((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, price: { ...item.price, [priceType]: value } } : item)),
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryToSubmit = { ...newCategory, active: false };
    if (isEditMode) updateMutation.mutate(categoryToSubmit);
    else createMutation.mutate(categoryToSubmit);
  };
  const handleEditCategory = (category: Category) => {
    setNewCategory(category);
    setIsEditMode(true);
    setIsModalOpen(true);
  };
  const confirmDeleteItem = (index: number) => {
    setNewCategory((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
    setConfirmDeleteIndex(null);
  };
  const confirmEditItem = (index: number) => {
    setConfirmEditIndex(null);
    setIsModalOpen(true);
  };
  const resetForm = () => {
    setNewCategory({ id: 0, image: "", title: "", active: false, items: [] });
    setConfirmDeleteIndex(null);
    setConfirmEditIndex(null);
    setIsModalOpen(false);
    setIsEditMode(false);
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
                    className="mt-4 text-xs bg-primary text-secondary px-4 py-2 rounded-xl hover:bg-tertiary transition duration-300 flex items-center justify-center"
                  >
                    <FaEdit className="mr-2" /> Edit Category
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>
      <section id="add-category" className="max-w-2xl sm:max-w-4xl md:max-w-6xl lg:max-w-7xl mx-auto py-4">
        <button onClick={() => setIsModalOpen(true)} className="text-lg font-semibold bg-secondary text-primary px-4 py-2 rounded-xl ">
          Add New Category
        </button>
      </section>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            exit={{ opacity: 0, y: "100%", transition: { duration: 0.2 } }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-secondary/20 backdrop-blur-lg text-primary rounded-xl p-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-secondary/20 border-4 border-double border-primary shadow-md shadow-secondary">
              <h2 className="text-xl text-primary font-bold mb-6">{isEditMode ? "Edit Category" : "Add New Category"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2">
                  {categoryFields.map(({ name, label }) => (
                    <div key={name}>
                      <label className="flex mb-1">{label}:</label>
                      <input
                        type="text"
                        name={name}
                        value={(newCategory as any)[name]}
                        onChange={handleCategoryChange}
                        className="w-full px-4 py-2 text-lg transition duration-700 ease-in-out transform rounded-xl border-2 border-secondary bg-primary hover:bg-tertiary text-secondary flex items-center justify-center"
                        required
                      />
                    </div>
                  ))}
                </div>
                {newCategory.items.map((item, index) => (
                  <div key={index} className="border-2 border-primary/60 p-4 rounded-xl mb-4 bg-secondary/60 backdrop-blur-xl shadow-md shadow-secondary">
                    <h4 className="font-semibold mb-2 text-2xl">Item {index + 1}</h4>
                    <div className="grid grid-cols-2">
                      {itemFields.map(({ name, placeholder }) => (
                        <input
                          key={name}
                          required
                          type="text"
                          placeholder={placeholder}
                          value={(item as any)[name]}
                          onChange={(e) => handleItemChange(index, name as keyof CartItem, e.target.value)}
                          className="w-full px-4 py-2 text-lg transition duration-700 ease-in-out transform rounded-xl border-2 border-secondary bg-primary hover:bg-tertiary text-secondary flex items-center justify-center"
                        />
                      ))}
                      {priceFields.map(({ name, placeholder }) => (
                        <input
                          key={name}
                          required
                          type="text"
                          placeholder={placeholder}
                          value={(item.price as any)[name]}
                          onChange={(e) => handlePriceChange(index, name as keyof Price, e.target.value)}
                          className="w-full px-4 py-2 text-lg transition duration-700 ease-in-out transform rounded-xl border-2 border-secondary bg-primary hover:bg-tertiary text-secondary flex items-center justify-center"
                        />
                      ))}
                    </div>
                    <div className="flex justify-center mt-2 gap-0.5">
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteIndex(index)}
                        className={`w-full ${confirmDeleteIndex === index ? "bg-red-900 cursor-not-allowed" : "bg-red-600"} text-primary px-4 gap-1 py-2 rounded-l-xl hover:bg-red-700 transition duration-300 flex items-center justify-center`}
                      >
                        <FaTrash /> {confirmDeleteIndex === index ? "Confirm Delete" : "Delete Item"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmEditIndex(index)}
                        className={`w-full ${confirmEditIndex === index ? "text-primary bg-green-600 cursor-not-allowed" : "text-secondary bg-primary"} px-4 gap-1 py-2 rounded-r-xl hover:bg-tertiary transition duration-300 flex items-center justify-center`}
                      >
                        <FaEdit /> {confirmEditIndex === index ? "Confirm Edit" : "Edit Item"}
                      </button>
                    </div>
                    {confirmDeleteIndex === index && (
                      <div className="flex justify-center  mt-2">
                        <button type="button" onClick={() => confirmDeleteItem(index)} className="w-full bg-green-600 text-primary px-4 py-2 rounded-xl hover:bg-green-700 transition duration-300">
                          Confirm Delete
                        </button>
                      </div>
                    )}
                    {confirmEditIndex === index && (
                      <div className="flex justify-center  mt-2">
                        <button type="button" onClick={() => confirmEditItem(index)} className="w-full bg-green-600 text-primary px-4 py-2 rounded-xl hover:bg-green-700 transition duration-300">
                          Confirm Edit
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-4 py-2 rounded-xl bg-primary text-secondary hover:bg-tertiary transition duration-300 flex items-center shadow-md shadow-secondary"
                >
                  <FaPlus className="mr-2" /> Add Item
                </button>
                <div className="flex justify-center space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full px-4 py-2 text-lg transition duration-700 ease-in-out transform rounded-xl bg-primary hover:bg-tertiary text-secondary flex items-center justify-center gap-2"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
