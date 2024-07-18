// app/routes/restaurant/profile/page.tsx
"use client";
import Image from "next/image";
import { FaPlus, FaEdit } from "react-icons/fa";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Category, Price, CartItem } from "../../../_assets/types/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function RestaurantProfilePage() {
  const [newCategory, setNewCategory] = useState<Category>({ id: 0, image: "", title: "", active: false, items: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const queryClient = useQueryClient();

  const fetchCategories = async () => {
    const response = await fetch("/api/restaurant");
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  };

  const createCategory = async (category: Category) => {
    const response = await fetch("/api/restaurant", {
      method: "POST",
      body: JSON.stringify(category),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  };

  const updateCategory = async (category: Category) => {
    const response = await fetch(`/api/restaurant/${category.id}`, {
      method: "PUT",
      body: JSON.stringify(category),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  };

  const { data: categories = [], isLoading, isError } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      resetForm();
    },
  });
  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      resetForm();
    },
  });

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleAddItem = () => {
    setNewCategory((prev) => ({ ...prev, items: [...prev.items, { title: "", description: "", image: "", price: { small: "", medium: "", full: "" }, genre: "", rating: 0 }] }));
  };

  const handleItemChange = (index: number, field: keyof CartItem, value: string | number) => {
    setNewCategory((prev) => ({ ...prev, items: prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)) }));
  };

  const handlePriceChange = (index: number, priceType: keyof Price, value: string) => {
    setNewCategory((prev) => ({ ...prev, items: prev.items.map((item, i) => (i === index ? { ...item, price: { ...item.price, [priceType]: value } } : item)) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      updateMutation.mutate(newCategory);
    } else {
      createMutation.mutate(newCategory);
    }
  };

  const handleEditCategory = (category: Category) => {
    setNewCategory(category);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setNewCategory({ id: 0, image: "", title: "", active: false, items: [] });
    setIsEditMode(false);
    setIsModalOpen(false);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>An error occurred</div>;

  return (
    <main className="max-w-full mx-auto overflow-hidden bg-primary p-4">
      <section id="header" className="flex flex-col md:justify-center md:items-center sm:text-center text-secondary mb-8">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-secondary">Restaurant Profile</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2">Manage Your Menu Categories</h2>
      </section>
      <section id="categories" className="max-w-2xl sm:max-w-4xl md:max-w-6xl lg:max-w-7xl mx-auto py-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {categories
            .filter((category: Category) => category.title !== "All")
            .map((category: Category, index: number) => (
              <div key={index} className="flex flex-col rounded-3xl overflow-hidden shadow-md shadow-secondary border-4 border-double border-secondary">
                <Image width={540} height={540} src={category.image} alt={category.title} className="object-cover w-full h-48" />
                <div className="text-primary flex flex-col justify-between rounded-b-2xl bg-secondary flex-grow p-4">
                  <h3 className="font-semibold text-lg">{category.title}</h3>
                  <p className="text-sm mt-2">Items: {category.items.length}</p>
                  <p className="text-sm mt-2">Status: {category.active ? "Active" : "Inactive"}</p>
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="mt-4 text-xs bg-primary text-secondary px-4 py-2 rounded-3xl hover:bg-tertiary transition duration-300 flex items-center justify-center"
                  >
                    <FaEdit className="mr-2" /> Edit Category
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>
      <section id="add-category" className="max-w-2xl sm:max-w-4xl md:max-w-6xl lg:max-w-7xl mx-auto py-4">
        <button onClick={() => setIsModalOpen(true)} className="bg-secondary text-primary px-6 py-3 rounded-3xl text-lg font-semibold hover:bg-tertiary transition duration-300">
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
            <div className="bg-primary text-secondary rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-bold mb-6">{isEditMode ? "Edit Category" : "Add New Category"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Category Image URL:</label>
                    <input type="text" name="image" value={newCategory.image} onChange={handleCategoryChange} className="w-full border p-2 rounded-3xl bg-secondary text-primary" required />
                  </div>
                  <div>
                    <label className="block mb-1">Category Title:</label>
                    <input type="text" name="title" value={newCategory.title} onChange={handleCategoryChange} className="w-full border p-2 rounded-3xl bg-secondary text-primary" required />
                  </div>
                </div>
                <div>
                  <label className="flex items-center">
                    <input type="checkbox" name="active" checked={newCategory.active} onChange={handleCategoryChange} className="mr-2" />
                    Active
                  </label>
                </div>
                <h3 className="text-xl font-semibold mt-6 mb-4">Items</h3>
                {newCategory.items.map((item, index) => (
                  <div key={index} className="border border-secondary p-4 rounded-3xl mb-4">
                    <h4 className="font-semibold mb-2">Item {index + 1}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Title"
                        value={item.title}
                        onChange={(e) => handleItemChange(index, "title", e.target.value)}
                        className="w-full border p-2 rounded-3xl bg-secondary text-primary"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, "description", e.target.value)}
                        className="w-full border p-2 rounded-3xl bg-secondary text-primary"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={item.image}
                        onChange={(e) => handleItemChange(index, "image", e.target.value)}
                        className="w-full border p-2 rounded-3xl bg-secondary text-primary"
                        required
                      />
                      <div className="grid grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Small Price"
                          value={item.price.small}
                          onChange={(e) => handlePriceChange(index, "small", e.target.value)}
                          className="w-full border p-2 rounded-3xl bg-secondary text-primary"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Medium Price"
                          value={item.price.medium}
                          onChange={(e) => handlePriceChange(index, "medium", e.target.value)}
                          className="w-full border p-2 rounded-3xl bg-secondary text-primary"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Full Price"
                          value={item.price.full}
                          onChange={(e) => handlePriceChange(index, "full", e.target.value)}
                          className="w-full border p-2 rounded-3xl bg-secondary text-primary"
                          required
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Genre"
                        value={item.genre}
                        onChange={(e) => handleItemChange(index, "genre", e.target.value)}
                        className="w-full border p-2 rounded-3xl bg-secondary text-primary"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Rating"
                        value={item.rating}
                        onChange={(e) => handleItemChange(index, "rating", parseFloat(e.target.value))}
                        className="w-full border p-2 rounded-3xl bg-secondary text-primary"
                        required
                        min="0"
                        max="5"
                        step="0.1"
                      />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={handleAddItem} className="bg-secondary text-primary px-4 py-2 rounded-3xl hover:bg-tertiary transition duration-300 flex items-center">
                  <FaPlus className="mr-2" /> Add Item
                </button>
                <div className="flex justify-end space-x-4 mt-6">
                  <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded-3xl hover:bg-gray-600 transition duration-300">
                    Cancel
                  </button>
                  <button type="submit" className="bg-secondary text-primary px-4 py-2 rounded-3xl hover:bg-tertiary transition duration-300">
                    {isEditMode ? "Update Category" : "Add Category"}
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
