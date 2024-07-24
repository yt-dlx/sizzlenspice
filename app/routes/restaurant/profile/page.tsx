// app/routes/restaurant/profile/page.tsx
"use client";
import { useEffect, useState } from "react";

export default function RestaurantProfilePage() {
  const [restaurantData, setRestaurantData] = useState(null);
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
          <pre>{JSON.stringify(restaurantData, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
}
