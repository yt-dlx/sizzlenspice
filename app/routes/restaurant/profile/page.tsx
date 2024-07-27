// app/routes/restaurant/profile/page.tsx
"use client";
import Image from "next/image";
import Loading from "./loading";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import type { UserData } from "@/app/_assets/types/cart";
import { useQuery, useMutation } from "@tanstack/react-query";

const ProfilePage = () => {
  const { data: session } = useSession();
  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery<UserData>({
    queryKey: ["userData", session?.user?.email],
    queryFn: async () => {
      const response = await fetch("/api/user");
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
  });
  const fetchRestaurant = useMutation({
    mutationFn: async (data: { name: string; email: string; phoneNumber: string }) => {
      const response = await fetch("/api/restaurant", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
  });
  const addCategory = useMutation({
    mutationFn: async (data: { title: string; image: string }) => {
      const response = await fetch("/api/restaurant/category", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
  });
  const editCategory = useMutation({
    mutationFn: async (data: { id: string; title: string; image: string }) => {
      const response = await fetch("/api/restaurant/category", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
  });
  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch("/api/restaurant/category", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
  });
  const addItem = useMutation({
    mutationFn: async (data: { title: string; description: string; image: string; price: any; genre: string; rating: number; categoryId: string }) => {
      const response = await fetch("/api/restaurant/item", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
  });
  const editItem = useMutation({
    mutationFn: async (data: { id: string; title: string; description: string; image: string; price: any; genre: string; rating: number; categoryId: string }) => {
      const response = await fetch("/api/restaurant/item", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
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
  });
  useEffect(() => {
    if (userData) {
      fetchRestaurant.mutate({
        name: "SizzleNSpice",
        email: userData.customerEmail,
        phoneNumber: userData.phoneNumber,
      });
    }
  }, [userData]);
  if (isUserLoading || fetchRestaurant.isIdle) return <Loading />;
  if (userError || fetchRestaurant.error) throw userError?.message || fetchRestaurant.error?.message;
  return (
    <main className="max-w-full mx-auto overflow-hidden bg-primary p-4">
      <section id="header" className="flex flex-col md:justify-center md:items-center sm:text-center text-secondary">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-secondary">Profile Page</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2">Manage Your Restaurant Profile</h2>
      </section>
      {fetchRestaurant.data && (
        <section id="restaurant-data" className="max-w-2xl sm:max-w-4xl md:max-w-6xl lg:max-w-7xl flex items-center justify-center mx-auto py-4">
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {fetchRestaurant.data.categories.map((category: any) => (
              <div key={category.id} className="flex flex-col rounded-xl overflow-hidden h-full shadow-md shadow-secondary border-4 border-double border-secondary">
                <Image width={540} height={540} src={category.image} alt={category.title} className="object-cover w-full h-48" />
                <div className="text-primary flex flex-col justify-between bg-secondary flex-grow p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <h2 className="font-bold text-lg">{category.title}</h2>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => editCategory.mutate({ id: category.id, title: category.title, image: category.image })}
                      className="text-sm bg-primary hover:bg-tertiary text-secondary p-1 rounded-xl transition duration-300"
                    >
                      Edit Category
                    </button>
                    <button onClick={() => deleteCategory.mutate(category.id)} className="text-sm bg-red-700 hover:bg-red-800 text-primary p-1 rounded-xl transition duration-300">
                      Delete Category
                    </button>
                  </div>
                  <h4 className="mt-4">Items</h4>
                  <ul>
                    {category.items.map((item: any) => (
                      <li key={item.id} className="flex flex-col space-y-4">
                        <p>Title: {item.title}</p>
                        <p>Description: {item.description}</p>
                        <p>Image: {item.image}</p>
                        <p>Price: {JSON.stringify(item.price)}</p>
                        <p>Genre: {item.genre}</p>
                        <p>Rating: {item.rating}</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              editItem.mutate({
                                id: item.id,
                                title: item.title,
                                description: item.description,
                                image: item.image,
                                price: item.price,
                                genre: item.genre,
                                rating: item.rating,
                                categoryId: category.id,
                              })
                            }
                            className="text-sm bg-primary hover:bg-tertiary text-secondary p-1 rounded-xl transition duration-300"
                          >
                            Edit Item
                          </button>
                          <button onClick={() => deleteItem.mutate(item.id)} className="text-sm bg-red-700 hover:bg-red-800 text-primary p-1 rounded-xl transition duration-300">
                            Delete Item
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() =>
                      addItem.mutate({
                        title: "New Item",
                        description: "Description",
                        image: "Image URL",
                        price: { small: "10", medium: "15", full: "20" },
                        genre: "Genre",
                        rating: 4.5,
                        categoryId: category.id,
                      })
                    }
                    className="text-sm bg-primary hover:bg-tertiary text-secondary p-1 rounded-xl transition duration-300"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => addCategory.mutate({ title: "New Category", image: "Image URL" })}
            className="text-sm bg-primary hover:bg-tertiary text-secondary p-1 rounded-xl transition duration-300 mt-4"
          >
            Add Category
          </button>
        </section>
      )}
    </main>
  );
};

export default ProfilePage;
