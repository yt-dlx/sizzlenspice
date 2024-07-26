// app/routes/restaurant/profile/page.tsx
"use client";
import Image from "next/image";
import Loading from "./loading";
import { useEffect, useState } from "react";
import { FoodItem, Restaurant } from "@/app/_assets/types/cart";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaPlus, FaEdit, FaSave, FaDollarSign, FaTrashAlt } from "react-icons/fa";

export default function RestaurantProfilePage() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryImage, setNewCategoryImage] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>("All");
  const [editingItem, setEditingItem] = useState<{ categoryTitle: string; itemIndex: number } | null>(null);
  const [newItem, setNewItem] = useState<FoodItem>({ title: "", description: "", image: "", price: { small: "", medium: "", full: "" }, genre: "veg", rating: 0 });
  const fetchAllCategories = async () => {
    const response = await fetch("/api/restaurant/menu");
    const restaurants = await response.json();
    const categories = new Set<string>();
    restaurants.forEach((restaurant: any) => restaurant.categories.forEach((category: any) => categories.add(category.title)));
    setAllCategories(Array.from(categories));
  };
  useEffect(() => {
    fetchAllCategories();
  }, []);
  const {
    data: restaurantData,
    isLoading: isLoadingRestaurant,
    error,
  } = useQuery<Restaurant>({
    queryKey: ["restaurant"],
    queryFn: async () => {
      const userResponse = await fetch("/api/user");
      const userData = await userResponse.json();
      const restaurantResponse = await fetch(`/api/restaurant?email=${userData.customerEmail}&phoneNumber=${userData.phoneNumber}&name=SizzleNSpice`);
      return restaurantResponse.json();
    },
  });
  const updateRestaurantMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      console.log("Updating restaurant data:", updatedData);
      const response = await fetch("/api/restaurant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["restaurant"] }),
    onError: (error) => console.error("Error updating restaurant data:", error),
  });
  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await fetch(`/api/restaurant/item/${itemId}`, {
        method: "DELETE",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant"] });
    },
    onError: (error) => console.error("Error deleting item:", error),
  });
  const handleAddCategory = () => {
    if (!newCategory || newCategory === "new") return;
    setIsLoading(true);
    if (!restaurantData?.categories?.some((cat) => cat.title === newCategory)) {
      updateRestaurantMutation.mutate(
        { name: "SizzleNSpice", categories: [...(restaurantData?.categories || []), { title: newCategory, image: newCategoryImage, items: [], active: false }] },
        {
          onSuccess: () => {
            setIsLoading(false);
            setIsAddingCategory(false);
            setNewCategory("");
            setNewCategoryImage("");
          },
          onError: () => setIsLoading(false),
        }
      );
    }
  };
  const handleUpdateCategory = (oldTitle: string) => {
    if (!newCategory) return;
    updateRestaurantMutation.mutate({ name: "SizzleNSpice", categories: restaurantData?.categories?.map((cat) => (cat.title === oldTitle ? { ...cat, title: newCategory } : cat)) });
    setEditingCategory(null);
    setNewCategory("");
  };
  const handleUpdateItem = (categoryTitle: string, itemIndex: number) => {
    updateRestaurantMutation.mutate({
      name: "SizzleNSpice",
      categories: restaurantData?.categories?.map((cat) => (cat.title === categoryTitle ? { ...cat, items: cat.items.map((item, index) => (index === itemIndex ? newItem : item)) } : cat)),
    });
    setEditingItem(null);
    setNewItem({ title: "", description: "", image: "", price: { small: "", medium: "", full: "" }, genre: "veg", rating: 0 });
  };
  const handleAddItem = (categoryTitle: string) => {
    updateRestaurantMutation.mutate({
      name: "SizzleNSpice",
      categories: restaurantData?.categories?.map((cat) => (cat.title === categoryTitle ? { ...cat, items: [...cat.items, newItem] } : cat)),
    });
    setNewItem({ title: "", description: "", image: "", price: { small: "", medium: "", full: "" }, genre: "veg", rating: 0 });
  };
  if (isLoadingRestaurant || isLoading) return <Loading />;
  if (error) throw error;
  return (
    <main className="max-w-full mx-auto overflow-hidden bg-primary p-4">
      <section id="header" className="flex flex-col md:justify-center md:items-center sm:text-center text-secondary">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-secondary">Restaurant Profile</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2">Manage Your Categories and Items efficiently in one place, all in real-time!</h2>
      </section>
      <section id="categories" className="max-w-2xl sm:max-w-4xl md:max-w-6xl lg:max-w-7xl flex items-center justify-center mx-auto py-2">
        <div className="flex scrollbar-thin scrollbar-thumb-secondary scrollbar-track-primary overflow-x-auto space-x-2 pb-4">
          {restaurantData?.categories?.map((category, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedCategory(category.title);
                setEditingCategory(null);
              }}
              className={`flex flex-col items-center shadow-md shadow-secondary/20 p-1 rounded-xl w-24 text-primary ${
                selectedCategory === category.title ? "bg-secondary/90" : "bg-secondary/20 text-secondary"
              }`}
            >
              <div className="w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden">
                <Image width={540} height={540} src={category.image} alt={category.title} className="object-cover w-full h-full" />
              </div>
              <span className="text-sm mt-4">{category.title === "All" ? "All Items" : category.title}</span>
              {editingCategory === category.title && (
                <div>
                  <input
                    type="text"
                    value={newCategory}
                    placeholder="Edit category"
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-xl bg-secondary border-2 border-secondary shadow-md shadow-secondary text-primary placeholder-primary focus:border-primary focus:ring-primary"
                  />
                  <button onClick={() => handleUpdateCategory(category.title)}>
                    <FaSave className="text-primary" />
                  </button>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>
      <section id="search" className="max-w-2xl sm:max-w-4xl md:max-w-6xl lg:max-w-7xl mx-auto space-y-1 flex flex-col text-xs py-4">
        <div className="flex flex-col gap-1 w-full">
          <div className="relative w-full">
            <select
              value={newCategory}
              onChange={(e) => {
                if (e.target.value === "new") setIsAddingCategory(true);
                else {
                  setNewCategory(e.target.value);
                  setIsAddingCategory(false);
                }
              }}
              className="w-full rounded-xl bg-secondary border-2 border-secondary text-primary focus:border-primary focus:ring-primary"
            >
              <option value="">Select a category</option>
              {allCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="new">Add new category</option>
            </select>
          </div>
        </div>
      </section>
      <section id="items" className="flex flex-col items-center justify-center max-w-2xl sm:max-w-4xl md:max-w-6xl lg:max-w-7xl mx-auto py-4">
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {restaurantData?.categories
            ?.filter((category) => selectedCategory === "All" || category.title === selectedCategory)
            .flatMap((category) =>
              category.items.map((item, index) => (
                <div key={index} className="flex flex-col rounded-xl overflow-hidden h-full shadow-md shadow-secondary border-4 border-double border-secondary">
                  <Image width={540} height={540} src={item.image} alt={item.title} className="object-cover w-full h-48" />
                  <div className="text-primary flex flex-col justify-between bg-secondary flex-grow p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-xl animate-pulse ${item.genre === "veg" ? "bg-lime-400" : "bg-red-600"}`} />
                        <h2 className="font-bold text-lg">{item.title}</h2>
                      </div>
                      <div className="inline-flex items-center justify-center animate-pulse">
                        <span className="text-yellow-400 gap-1 text-sm flex items-center">★ {item.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-sm mt-2">{item.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setEditingItem({ categoryTitle: category.title, itemIndex: index });
                          setNewItem(item);
                          setIsModalOpen(true);
                        }}
                        className="px-3 py-1 flex items-center gap-2 rounded-xl text-sm bg-primary hover:bg-tertiary text-secondary transition duration-300"
                      >
                        <FaEdit className="text-secondary" /> Edit
                      </button>
                      <button
                        onClick={() => item.id && deleteItemMutation.mutate(item.id)}
                        className="px-3 py-1 flex items-center gap-2 rounded-xl text-sm bg-primary hover:bg-tertiary text-secondary transition duration-300"
                      >
                        <FaTrashAlt className="text-secondary" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          {selectedCategory && (
            <div className="flex flex-col rounded-xl overflow-hidden h-full shadow-md shadow-secondary border-4 border-double border-secondary">
              <div className="text-primary flex flex-col justify-between bg-secondary flex-grow p-4">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => {
                      setSelectedItem(newItem);
                      setIsModalOpen(true);
                    }}
                    className="px-3 py-1 flex items-center gap-2 rounded-xl text-sm bg-primary hover:bg-tertiary text-secondary transition duration-300"
                  >
                    <FaPlus className="text-secondary" /> Add Item
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      {isAddingCategory && (
        <section
          id="add-category-modal"
          className="fixed bottom-0 left-0 right-0 w-full max-w-4xl mx-auto bg-secondary/60 backdrop-blur-2xl shadow-md shadow-secondary border-4 border-double border-secondary text-primary rounded-t-xl flex justify-center items-center max-h-[80vh] z-50"
        >
          <div className="p-4 w-full max-w-full flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-center">Add New Category</h2>
            <div className="flex flex-col gap-2">
              <label htmlFor="category-name" className="text-sm font-medium">
                Category Name:
              </label>
              <input
                type="text"
                id="category-name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full rounded-xl bg-primary border-2 border-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="category-image" className="text-sm font-medium">
                Category Image URL:
              </label>
              <input
                type="text"
                id="category-image"
                value={newCategoryImage}
                onChange={(e) => setNewCategoryImage(e.target.value)}
                className="w-full rounded-xl bg-primary border-2 border-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsAddingCategory(false);
                  setNewCategory("");
                  setNewCategoryImage("");
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition duration-300"
              >
                Cancel
              </button>
              <button onClick={handleAddCategory} className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white transition duration-300">
                Add Category
              </button>
            </div>
          </div>
        </section>
      )}
      {isModalOpen && selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false);
              setEditingItem(null);
              setNewItem({ title: "", description: "", image: "", price: { small: "", medium: "", full: "" }, genre: "veg", rating: 0 });
            }
          }}
        >
          <div className="relative w-full max-w-lg p-6 bg-primary rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-center text-secondary mb-4">{editingItem ? "Edit Item" : "Add New Item"}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingItem) {
                  handleUpdateItem(editingItem.categoryTitle, editingItem.itemIndex);
                } else if (selectedCategory) {
                  handleAddItem(selectedCategory);
                }
                setIsModalOpen(false);
              }}
              className="flex flex-col gap-4"
            >
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-secondary">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="mt-1 p-2 w-full rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-secondary">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="mt-1 p-2 w-full rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-secondary">
                  Image URL
                </label>
                <input
                  type="text"
                  id="image"
                  value={newItem.image}
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                  className="mt-1 p-2 w-full rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex gap-4">
                <div>
                  <label htmlFor="price-small" className="block text-sm font-medium text-secondary">
                    Price (S) <FaDollarSign className="inline-block text-yellow-400" />
                  </label>
                  <input
                    type="number"
                    id="price-small"
                    value={newItem.price.small}
                    onChange={(e) => setNewItem({ ...newItem, price: { ...newItem.price, small: e.target.value } })}
                    className="mt-1 p-2 w-full rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="price-medium" className="block text-sm font-medium text-secondary">
                    Price (M) <FaDollarSign className="inline-block text-yellow-400" />
                  </label>
                  <input
                    type="number"
                    id="price-medium"
                    value={newItem.price.medium}
                    onChange={(e) => setNewItem({ ...newItem, price: { ...newItem.price, medium: e.target.value } })}
                    className="mt-1 p-2 w-full rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="price-full" className="block text-sm font-medium text-secondary">
                    Price (L) <FaDollarSign className="inline-block text-yellow-400" />
                  </label>
                  <input
                    type="number"
                    id="price-full"
                    value={newItem.price.full}
                    onChange={(e) => setNewItem({ ...newItem, price: { ...newItem.price, full: e.target.value } })}
                    className="mt-1 p-2 w-full rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-secondary">
                  Genre
                </label>
                <select
                  id="genre"
                  value={newItem.genre}
                  onChange={(e) => setNewItem({ ...newItem, genre: e.target.value })}
                  className="mt-1 p-2 w-full rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingItem(null);
                    setNewItem({ title: "", description: "", image: "", price: { small: "", medium: "", full: "" }, genre: "veg", rating: 0 });
                  }}
                  className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white">
                  {editingItem ? "Save Changes" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
