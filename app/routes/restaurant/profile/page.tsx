// app/routes/restaurant/profile/page.tsx
"use client";
import { useEffect, useState } from "react";

interface Category {
  title: string;
  items: Item[];
}

interface Item {
  title: string;
  description: string;
  price: { [key: string]: number };
  genre: string;
  rating: number;
  image: string;
}

interface RestaurantData {
  categories: Category[];
}

export default function RestaurantProfilePage() {
  const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [newItem, setNewItem] = useState<Item>({ title: "", description: "", price: {}, genre: "veg", rating: 0, image: "" });

  useEffect(() => {
    const fetchData = async () => {
      const userResponse = await fetch("/api/user");
      const userData = await userResponse.json();
      const restaurantResponse = await fetch(`/api/restaurant?email=${userData.customerEmail}&phoneNumber=${userData.phoneNumber}&name=SizzleNSpice`);
      const restaurantData = await restaurantResponse.json();
      setRestaurantData(restaurantData);
    };
    fetchData();
  }, []);

  const addCategory = async () => {
    if (!newCategory) return;
    const response = await fetch("/api/restaurant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categories: [{ title: newCategory, items: [] }],
      }),
    });
    const data = await response.json();
    setRestaurantData(data);
    setNewCategory("");
  };

  const addItem = async (categoryTitle: string) => {
    if (!newItem.title || !newItem.description || !newItem.price || !newItem.genre || !newItem.rating || !newItem.image) return;
    if (!restaurantData) return;

    const response = await fetch("/api/restaurant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categories: restaurantData.categories.map((category) => (category.title === categoryTitle ? { ...category, items: [...category.items, newItem] } : category)),
      }),
    });
    const data = await response.json();
    setRestaurantData(data);
    setNewItem({ title: "", description: "", price: {}, genre: "veg", rating: 0, image: "" });
  };

  const Header = () => {
    return (
      <section id="header" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col md:justify-center md:items-center sm:text-center text-secondary mb-8">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-secondary">Restaurant Profile</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2">Manage Your Categories and Items efficiently in one place, all in real-time!</h2>
      </section>
    );
  };

  return (
    <main className="max-w-full mx-auto overflow-hidden bg-primary p-4 text-secondary">
      <Header />
      {restaurantData ? (
        <div>
          <h3>Categories</h3>
          <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Add new category" />
          <button onClick={addCategory}>Add Category</button>
          {restaurantData.categories.map((category) => (
            <div key={category.title}>
              <h4>{category.title}</h4>
              <input type="text" value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} placeholder="Item title" />
              <input type="text" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} placeholder="Item description" />
              <input type="text" value={JSON.stringify(newItem.price)} onChange={(e) => setNewItem({ ...newItem, price: JSON.parse(e.target.value) })} placeholder="Item price" />
              <input type="text" value={newItem.genre} onChange={(e) => setNewItem({ ...newItem, genre: e.target.value })} placeholder="Item genre" />
              <input type="text" value={newItem.rating.toString()} onChange={(e) => setNewItem({ ...newItem, rating: Number(e.target.value) })} placeholder="Item rating" />
              <input type="text" value={newItem.image} onChange={(e) => setNewItem({ ...newItem, image: e.target.value })} placeholder="Item image" />
              <button onClick={() => addItem(category.title)}>Add Item</button>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
}
