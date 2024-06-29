// app/cart/checkout/page.tsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaRupeeSign } from "react-icons/fa";
import { GiDeliveryDrone } from "react-icons/gi";
import React, { useEffect, useState } from "react";
import Navbar from "@/app/_utils/_components/Navbar";
import Footer from "@/app/_utils/_components/Footer";
import { useCart } from "../../_utils/_context/CartContext";

async function fetchPreviousOrders(userId: string) {
  const response = await fetch(`/api/cart?userId=${userId}`);
  if (!response.ok) throw new Error("Failed to fetch orders");
  const data = await response.json();
  return data.orders;
}

async function cancelOrder(orderId: string) {
  const response = await fetch(`/api/cart?orderId=${orderId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to cancel order");
  return await response.json();
}

export default function Order() {
  const router = useRouter();
  const { data: session } = useSession();
  const { cartItems, clearCart, locationData } = useCart();
  const [showGif, setShowGif] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [prevOrders, setPreviousOrders] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestOrderId, setLatestOrderId] = useState<string | null>(null);
  const [cancelTimeRemaining, setCancelTimeRemaining] = useState<number | null>(null);
  const TotalCartPrice = cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0).toFixed(2);

  useEffect(() => {
    if (session?.user?.email) {
      fetchPreviousOrders(session.user.email)
        .then((orders) => setPreviousOrders(orders))
        .catch((error) => console.error("Error fetching orders:", error));
    }
  }, [session]);

  useEffect(() => {
    if (showGif) {
      const timer = setTimeout(() => {
        setShowGif(false);
        window.location.reload();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showGif]);

  useEffect(() => {
    const storedOrderId = localStorage.getItem("latestOrderId");
    const storedOrderTime = localStorage.getItem("orderPlacedTime");

    if (storedOrderId && storedOrderTime) {
      const orderTime = parseInt(storedOrderTime, 10);
      const currentTime = Date.now();
      const elapsedTime = Math.floor((currentTime - orderTime) / 1000);

      if (elapsedTime < 60) {
        setLatestOrderId(storedOrderId);
        setCancelTimeRemaining(60 - elapsedTime);
      } else {
        localStorage.removeItem("latestOrderId");
        localStorage.removeItem("orderPlacedTime");
      }
    }
  }, []);

  useEffect(() => {
    if (cancelTimeRemaining !== null && cancelTimeRemaining > 0) {
      const timer = setInterval(() => {
        setCancelTimeRemaining((prev) => {
          if (prev !== null && prev > 1) {
            return prev - 1;
          } else {
            clearInterval(timer);
            localStorage.removeItem("latestOrderId");
            localStorage.removeItem("orderPlacedTime");
            return null;
          }
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cancelTimeRemaining]);

  const handlePayment = async () => {
    if (session?.user?.email) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: cartItems,
            userId: session.user.email,
            totalAmount: TotalCartPrice,
            locationData: locationData,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setLatestOrderId(data.orderId);
          setCancelTimeRemaining(60);
          setShowGif(true);
          clearCart();
          const updatedOrders = await fetchPreviousOrders(session.user.email);
          setPreviousOrders(updatedOrders);
          setOrderPlaced(true);
          localStorage.setItem("latestOrderId", data.orderId);
          localStorage.setItem("orderPlacedTime", Date.now().toString());
        } else throw new Error("Failed to place order");
      } catch (error) {
        console.error("Error placing order:", error);
        setError("Failed to place order. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      const updatedOrders = await fetchPreviousOrders(session?.user?.email || "");
      setPreviousOrders(updatedOrders);
      if (orderId === latestOrderId) {
        setLatestOrderId(null);
        setCancelTimeRemaining(null);
        localStorage.removeItem("latestOrderId");
        localStorage.removeItem("orderPlacedTime");
      }
      alert("Order cancelled successfully");
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order. Please try again.");
    }
  };

  return (
    <React.Fragment>
      <Navbar />
      {showGif && (
        <section className="fixed inset-0 flex flex-col items-center justify-center bg-[#FFF4E9]/60 backdrop-blur-2xl z-50">
          <img src="/Moto.gif" alt="Moto" className="object-contain h-72 sm:h-80 lg:h-96" />
          <p className="mb-4 text-4xl md:text-8xl text-[#172B25]">
            Order Placed,
            <br /> <span className="font-semibold">{session?.user?.name}</span>!
          </p>
          <ul className="text-lg md:xl text-[#172B25] p-8 list-disc">
            <li>Thank you for your order!</li>
            <li>Please wait for confirmation from the Restaurant Owner.</li>
            <li>You'll receive notifications for every step until your order arrives.</li>
          </ul>
        </section>
      )}
      <section className="mx-auto overflow-hidden bg-[#FFF4E9] max-w-6xl p-2 m-2">
        <section className="flex flex-col mb-4 m-4 md:justify-center md:items-center">
          <h1 className="text-7xl sm:text-8xl font-LobsterTwo_Bold text-[#172B25]">Order Summary</h1>
          <img src="/checkout.gif" alt="checkout.gif" className="object-contain h-80 sm:h-96 lg:h-112 hue-rotate-90" />
          <p className="text-2xl md:text-6xl text-[#172B25]">
            Here's a summary of your order,
            <br /> <span className="font-semibold">{session?.user?.name}</span>!
          </p>
          <p className="text-lg md:xl text-[#172B25]/70">Review it and make changes if required!</p>
        </section>
        {!orderPlaced && cartItems.length > 0 && (
          <section className="text-[#172B25] p-4">
            <h2 className="text-4xl font-semibold">Order Items:</h2>
            <div className="my-4 overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="text-[#172B25] text-xs uppercase">
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <section className="avatar">
                          <section className="w-16 h-16 rounded-full border-4 border-[#172B25] shadow-md">
                            <img src={item.image} alt={item.title} />
                          </section>
                        </section>
                      </td>
                      <td>
                        {item.title}{" "}
                        <span className="font-semibold">
                          ({item.plateSize}) - x{item.quantity}
                        </span>
                      </td>
                      <td>
                        <FaRupeeSign className="inline" />
                        {(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="mt-4 text-lg font-bold">
              <li>
                Total: <FaRupeeSign className="inline" /> {TotalCartPrice}
              </li>
            </ul>
            <ul>
              <h2 className="text-4xl font-semibold mt-4 mb-2">Delivery Location:</h2>
              <li>
                <span className="font-bold">Address:</span> {locationData.address}
              </li>
              <li>
                <span className="font-bold">Pincode:</span> {locationData.pincode}
              </li>
              <li>
                <span className="font-bold">Latitude:</span> {locationData.latitude}
              </li>
              <li>
                <span className="font-bold">Longitude:</span> {locationData.longitude}
              </li>
            </ul>
          </section>
        )}
        {!orderPlaced && cartItems.length > 0 && (
          <section className="flex items-center justify-center">
            <section className="flex flex-col m-2 max-w-7xl bg-[#172B25] p-8 rounded-3xl text-[#E6DFD4] shadow-md shadow-[#172B25]">
              <span className="flex items-center justify-center gap-2 text-xl font-black xl:text-6xl">
                <GiDeliveryDrone size={80} className="animate-pulse text-[#FFF4E9]" />
                Confirm Your Culinary Journey
              </span>
              <div className="mt-2 space-y-2">
                <button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full px-4 py-2 transition duration-700 ease-in-out transform rounded-full bg-[#FFF4E9] hover:bg-[#468353] text-[#172B25] hover:text-[#FFF4E9] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? "Processing..." : "Confirm Order!"}
                </button>
                <Link
                  href={"/cart/food"}
                  className="w-full px-4 py-2 transition duration-700 ease-in-out transform rounded-full bg-[#FFF4E9] hover:bg-[#468353] text-[#172B25] hover:text-[#FFF4E9] flex items-center justify-center gap-2"
                >
                  No, I want to add more!
                </Link>
              </div>
              {error && <p className="mt-2 text-red-500">{error}</p>}
            </section>
          </section>
        )}
        {!orderPlaced && cartItems.length === 0 && (
          <section className="flex items-center justify-center">
            <section className="flex flex-col m-2 max-w-7xl bg-[#172B25] p-8 rounded-2xl text-[#E6DFD4] shadow-md shadow-[#172B25]">
              <span className="flex items-center justify-center gap-2 text-xl font-black xl:text-6xl">
                <GiDeliveryDrone size={80} className="animate-pulse text-[#FFF4E9]" />
                Your Cart is Empty! Let's Fill it up.
              </span>
              <div className="mt-2 space-y-2">
                <Link
                  href={"/cart"}
                  className="w-full px-4 py-2 transition duration-700 ease-in-out transform rounded-full bg-[#FFF4E9] hover:bg-[#468353] text-[#172B25] hover:text-[#FFF4E9] flex items-center justify-center gap-2"
                >
                  Go To Food Categories
                </Link>
              </div>
              {error && <p className="mt-2 text-red-500">{error}</p>}
            </section>
          </section>
        )}
        {prevOrders.length > 0 && (
          <section className="m-2 mt-8 text-[#172B25]">
            <h2 className="text-4xl font-semibold">Orders:</h2>
            <div className="flex flex-col items-center justify-center overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="text-[#172B25]">
                    <th>Order Date</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {prevOrders.map((order: any, index: number) => (
                    <tr key={index}>
                      <td>{new Date(order.orderDate).toLocaleString()}</td>
                      <td>
                        <FaRupeeSign className="inline" />
                        {order.totalAmount}
                      </td>
                      <td>
                        {order._id === latestOrderId &&
                          (cancelTimeRemaining !== null && cancelTimeRemaining > 0 ? (
                            <button onClick={() => handleCancelOrder(order._id)} className="px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600">
                              Cancel ({cancelTimeRemaining}s)
                            </button>
                          ) : (
                            <span className="px-2 py-1 text-sm text-white bg-gray-500 rounded cursor-not-allowed">Placed</span>
                          ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </section>
      <Footer />
    </React.Fragment>
  );
}
