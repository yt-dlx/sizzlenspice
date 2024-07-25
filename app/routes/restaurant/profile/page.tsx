// app/routes/restaurant/profile/page.tsx
"use client";
import Image from "next/image";
import Loading from "./loading";
import { useState } from "react";
import { FoodItem, Restaurant } from "@/app/_assets/types/cart";
import { FaPlus, FaEdit, FaSave, FaDollarSign } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function RestaurantProfilePage() {
  const queryClient = useQueryClient();
  const [newCategory, setNewCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>("All");
  const [editingItem, setEditingItem] = useState<{ categoryTitle: string; itemIndex: number } | null>(null);
  const [newItem, setNewItem] = useState<FoodItem>({ title: "", description: "", image: "", price: { small: "", medium: "", full: "" }, genre: "veg", rating: 0 });
  const {
    data: restaurantData,
    isLoading,
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
  const addCategoryMutation = useMutation({
    mutationFn: async (newCategory: string) => {
      const response = await fetch("/api/restaurant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: [{ title: newCategory, items: [] }] }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant"] });
      setNewCategory("");
    },
  });
  const addItemMutation = useMutation({
    mutationFn: async ({ categoryTitle, newItem }: { categoryTitle: string; newItem: FoodItem }) => {
      if (!restaurantData?.categories) throw new Error("Restaurant data is not available");
      const response = await fetch("/api/restaurant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: restaurantData.categories.map((category) => (category.title === categoryTitle ? { ...category, items: [...category.items, newItem] } : category)) }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant"] });
      setNewItem({ title: "", description: "", image: "", price: { small: "", medium: "", full: "" }, genre: "veg", rating: 0 });
    },
  });
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ oldTitle, newTitle }: { oldTitle: string; newTitle: string }) => {
      if (!restaurantData?.categories) throw new Error("Restaurant data is not available");
      const response = await fetch("/api/restaurant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: restaurantData.categories.map((category) => (category.title === oldTitle ? { ...category, title: newTitle } : category)) }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant"] });
      setEditingCategory(null);
      setNewCategory("");
    },
  });
  const updateItemMutation = useMutation({
    mutationFn: async ({ categoryTitle, itemIndex, updatedItem }: { categoryTitle: string; itemIndex: number; updatedItem: FoodItem }) => {
      if (!restaurantData?.categories) throw new Error("Restaurant data is not available");
      const response = await fetch("/api/restaurant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categories: restaurantData.categories.map((cat) => (cat.title === categoryTitle ? { ...cat, items: cat.items.map((item, index) => (index === itemIndex ? updatedItem : item)) } : cat)),
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant"] });
      setEditingItem(null);
      setNewItem({ title: "", description: "", image: "", price: { small: "", medium: "", full: "" }, genre: "veg", rating: 0 });
    },
  });
  const handleAddCategory = () => {
    if (!newCategory) return;
    addCategoryMutation.mutate(newCategory);
  };
  const handleAddItem = (categoryTitle: string) => {
    if (!newItem.title || !newItem.description || !newItem.price.small || !newItem.genre || !newItem.rating || !newItem.image) return;
    addItemMutation.mutate({ categoryTitle, newItem });
  };
  const handleUpdateCategory = (oldTitle: string) => {
    if (!newCategory) return;
    updateCategoryMutation.mutate({ oldTitle, newTitle: newCategory });
  };
  const handleUpdateItem = (categoryTitle: string, itemIndex: number) => {
    if (!newItem.title || !newItem.description || !newItem.price.small || !newItem.genre || !newItem.rating || !newItem.image) return;
    updateItemMutation.mutate({ categoryTitle, itemIndex, updatedItem: newItem });
  };
  const Header = () => {
    return (
      <section id="header" className="flex flex-col md:justify-center md:items-center sm:text-center text-secondary">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-secondary">Restaurant Profile</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2">Manage Your Categories and Items efficiently in one place, all in real-time!</h2>
      </section>
    );
  };
  const Categories = () => {
    return (
      <section id="categories" className="max-w-2xl sm:max-w-4xl md:max-w-6xl lg:max-w-7xl flex items-center justify-center mx-auto py-2">
        <div className="flex scrollbar-thin scrollbar-thumb-secondary scrollbar-track-primary overflow-x-auto space-x-2 pb-4">
          <button
            key="all"
            onClick={() => setSelectedCategory("All")}
            className={`flex flex-col items-center shadow-md shadow-secondary/20 p-1 rounded-xl w-24 text-primary ${selectedCategory === "All" ? "bg-secondary/90" : "bg-secondary/20 text-secondary"}`}
          >
            <span className="text-sm mt-4">All</span>
          </button>
          {restaurantData?.categories?.map((category, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedCategory(category.title);
                setEditingCategory(null);
              }}
              className={`flex flex-col items-center shadow-md shadow-secondary/20 p-1 rounded-xl w-24 text-primary ${selectedCategory === category.title ? "bg-secondary/90" : "bg-secondary/20 text-secondary"}`}
            >
              <div className="w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden">
                <Image width={540} height={540} src={category.image} alt={category.title} className="object-cover w-full h-full" />
              </div>
              <span className="text-sm mt-4">{category.title}</span>
              {editingCategory === category.title && (
                <div>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Edit category"
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
    );
  };
  const Items = () => {
    return (
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
                    </div>
                  </div>
                </div>
              ))
            )}
        </div>
      </section>
    );
  };
  if (isLoading) return <Loading />;
  if (error) throw error;

  return (
    <main className="max-w-full mx-auto overflow-hidden bg-primary p-4">
      <Header />
      <Categories />
      <section id="search" className="max-w-2xl sm:max-w-4xl md:max-w-6xl lg:max-w-7xl mx-auto space-y-1 flex flex-col text-xs py-4">
        <div className="flex flex-col gap-1 w-full">
          <div className="relative w-full">
            <input
              type="text"
              value={newCategory}
              placeholder="Add new category"
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full rounded-xl bg-secondary border-2 border-secondary shadow-md shadow-secondary text-primary placeholder-primary focus:border-primary focus:ring-primary"
            />
            <button onClick={handleAddCategory} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary">
              <FaPlus />
            </button>
          </div>
        </div>
      </section>
      <Items />
      {isModalOpen && selectedItem && (
        <section
          id="modal"
          className="fixed bottom-0 left-0 right-0 w-full max-w-4xl mx-auto bg-secondary/60 backdrop-blur-2xl shadow-md shadow-secondary border-4 border-double border-secondary text-primary rounded-t-xl flex justify-center max-h-[80vh] z-50"
        >
          <div className="p-4 w-full scrollbar-thin scrollbar-thumb-primary scrollbar-track-secondary overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-4xl">{selectedItem?.title}</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <FaPlus size={24} className="text-primary bg-secondary rounded-xl animate-spin" />
              </button>
            </div>
            <div className="flex items-center mb-4">
              <div className="flex flex-col">
                <Image
                  width={400}
                  height={300}
                  src={selectedItem?.image || ""}
                  alt={selectedItem?.title || "Item image"}
                  className="rounded-full object-cover w-36 h-36 border-2 border-secondary shadow-md shadow-secondary"
                />
                <div className="flex items-center space-x-2 mt-4 mb-2">
                  <div className={`w-4 h-4 rounded-xl ${selectedItem?.genre === "veg" ? "bg-lime-400" : "bg-red-600"}`} />
                  <span className="font-bold">{selectedItem?.genre === "veg" ? "Vegetarian" : "Non-Vegetarian"}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="font-bold">{selectedItem?.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
            <p className="text-sm mb-4">{selectedItem?.description}</p>
            <p className="mb-2 text-xl">Select Plate Size:</p>
            <div className="space-y-2">
              {Object.entries(selectedItem?.price || {}).map(([size, price]) => (
                <div key={size} className="flex items-center justify-between">
                  <span className="font-Kurale">{size.charAt(0).toUpperCase() + size.slice(1)}</span>
                  <div className="flex items-center">
                    <span className="font-bold mr-2 inline-flex items-center">
                      <FaDollarSign size={12} />
                      {price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateItem(editingItem!.categoryTitle, editingItem!.itemIndex);
              }}
              className="mt-4 grid grid-cols-2 gap-2 bg-primary/20 rounded-xl p-2"
            >
              <div className="mb-2">
                <p>Item title</p>
                <input
                  required
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full rounded-xl bg-secondary border-2 border-primary/20 shadow-md shadow-secondary text-primary placeholder-primary focus:border-primary focus:ring-primary"
                />
              </div>
              <div className="mb-2">
                <p>Item description</p>
                <input
                  required
                  type="text"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full rounded-xl bg-secondary border-2 border-primary/20 shadow-md shadow-secondary text-primary placeholder-primary focus:border-primary focus:ring-primary"
                />
              </div>
              <div className="mb-2">
                <p>Veg or Non-Veg</p>
                <select
                  required
                  value={newItem.genre}
                  onChange={(e) => setNewItem({ ...newItem, genre: e.target.value })}
                  className="w-full rounded-xl bg-secondary border-2 border-primary/20 shadow-md shadow-secondary text-primary focus:border-primary focus:ring-primary"
                >
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                </select>
              </div>
              <div className="mb-2">
                <p>Item price (small)</p>
                <input
                  required
                  type="text"
                  value={newItem.price.small}
                  onChange={(e) => setNewItem({ ...newItem, price: { ...newItem.price, small: e.target.value } })}
                  className="w-full rounded-xl bg-secondary border-2 border-primary/20 shadow-md shadow-secondary text-primary placeholder-primary focus:border-primary focus:ring-primary"
                />
              </div>
              <div className="mb-2">
                <p>Item price (medium)</p>
                <input
                  required
                  type="text"
                  value={newItem.price.medium}
                  onChange={(e) => setNewItem({ ...newItem, price: { ...newItem.price, medium: e.target.value } })}
                  className="w-full rounded-xl bg-secondary border-2 border-primary/20 shadow-md shadow-secondary text-primary placeholder-primary focus:border-primary focus:ring-primary"
                />
              </div>
              <div className="mb-2">
                <p>Item price (full)</p>
                <input
                  required
                  type="text"
                  value={newItem.price.full}
                  onChange={(e) => setNewItem({ ...newItem, price: { ...newItem.price, full: e.target.value } })}
                  className="w-full rounded-xl bg-secondary border-2 border-primary/20 shadow-md shadow-secondary text-primary placeholder-primary focus:border-primary focus:ring-primary"
                />
              </div>
              <div className="mb-2">
                <p>Item image (link)</p>
                <input
                  required
                  type="text"
                  value={newItem.image}
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                  className="w-full rounded-xl bg-secondary border-2 border-secondary/20 shadow-md shadow-secondary text-primary placeholder-primary focus:border-primary focus:ring-primary"
                />
              </div>
              <div className="mb-2">
                <p>Confirm & Update</p>
                <button
                  type="submit"
                  className="w-full p-2 text-lg transition duration-700 ease-in-out transform rounded-xl bg-primary hover:bg-tertiary text-secondary flex items-center justify-center gap-2 border-2 border-secondary"
                >
                  <FaSave className="text-secondary" /> Finalise
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
    </main>
  );
}
