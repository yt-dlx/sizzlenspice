// app/routes/restaurant/profile/page.tsx
"use client";
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
  });
  useEffect(() => {
    if (userData) fetchRestaurant.mutate({ name: "SizzleNSpice", email: userData.customerEmail, phoneNumber: userData.phoneNumber });
  }, [userData]);
  if (isUserLoading || fetchRestaurant.isIdle) return <Loading />;
  if (userError || fetchRestaurant.error) throw userError?.message || fetchRestaurant.error?.message;
  return (
    <div>
      <h1>Profile Page</h1>
      <p>Email: {session?.user?.email}</p>
      <p>Phone Number: {userData?.phoneNumber}</p>
      <p>Customer Email: {userData?.customerEmail}</p>
      <p>Location Data:</p>
      <ul>
        <li>Latitude: {userData?.locationData.latitude}</li>
        <li>Longitude: {userData?.locationData.longitude}</li>
        <li>Address: {userData?.locationData.address}</li>
        <li>Pincode: {userData?.locationData.pincode}</li>
      </ul>
      {fetchRestaurant.data && (
        <div>
          <h2>Restaurant Data</h2>
          <p>Name: {fetchRestaurant.data.name}</p>
          <p>Email: {fetchRestaurant.data.email}</p>
          <p>Phone Number: {fetchRestaurant.data.phoneNumber}</p>
          <h3>Categories</h3>
          <ul>
            {fetchRestaurant.data.categories.map((category: any) => (
              <li key={category.id}>
                <p>Title: {category.title}</p>
                <p>Image: {category.image}</p>
                <h4>Items</h4>
                <ul>
                  {category.items.map((item: any) => (
                    <li key={item.id}>
                      <p>Title: {item.title}</p>
                      <p>Description: {item.description}</p>
                      <p>Image: {item.image}</p>
                      <p>Price: {JSON.stringify(item.price)}</p>
                      <p>Genre: {item.genre}</p>
                      <p>Rating: {item.rating}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
