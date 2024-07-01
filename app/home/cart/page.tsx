// app/home/cart/page.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { GiDeliveryDrone } from "react-icons/gi";
import { useStore } from "@/app/_src/others/store";
import React, { useEffect, useState } from "react";
import { FaRupeeSign, FaPlus, FaMinus } from "react-icons/fa";

export default function Home() {
  const { data: session } = useSession();
  const [showGif, setShowGif] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [prevOrders, setPreviousOrders] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestOrderId, setLatestOrderId] = useState<string | null>(null);
  const [cancelTimeRemaining, setCancelTimeRemaining] = useState<number | null>(null);
  const { cart, removeFromCart, updateCartItemQuantity, clearCart, getCartTotal } = useStore();

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

  useEffect(() => {
    if (showGif) {
      const timer = setTimeout(() => {
        setShowGif(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showGif]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchPreviousOrders(session.user.email)
        .then((orders) => setPreviousOrders(orders))
        .catch((error) => console.error("Error fetching orders:", error));
    }
  }, [session]);

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

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, userId: session?.user?.email }),
      });
      if (!response.ok) throw new Error("Failed to place order");
      const { orderId } = await response.json();
      setLatestOrderId(orderId);
      localStorage.setItem("latestOrderId", orderId);
      localStorage.setItem("orderPlacedTime", Date.now().toString());
      setCancelTimeRemaining(60);
      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      setError("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-full mx-auto overflow-hidden bg-gradient-to-b from-[#1C3029]/30 from-10% via-[#171717] via-40% to-[#111111] to-50% p-4">
      {showGif && (
        <section className="fixed inset-0 flex flex-col items-center justify-center bg-[#111111]/60 backdrop-blur-2xl z-50">
          <img src="/Moto.gif" alt="Moto" className="object-contain h-72 sm:h-80 lg:h-96" />
          <p className="mb-4 text-4xl md:text-8xl text-[#E9F0CD]">
            Order Placed,
            <br /> <span className="font-Lora_SemiBoldItalic">{session?.user?.name}</span>!
          </p>
          <ul className="text-lg md:xl text-[#E9F0CD] p-8 list-disc font-Lora_SemiBoldItalic">
            <li>Thank you for your order!</li>
            <li>Auto CLosing in 4s.</li>
          </ul>
        </section>
      )}

      <section
        id="header"
        className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col md:justify-center md:items-center sm:text-center text-[#E9F0CD] font-Playfair"
      >
        <h1 className="text-8xl sm:text-9xl font-bold text-[#E9F0CD]">Order Summary</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2 font-Kurale">
          Here's a summary of your order, {session?.user?.name}! <br />
          Review it and make changes if required!
        </h2>
        <img
          src="/checkout.gif"
          className="mx-auto object-cover h-80 sm:h-96 lg:h-112 hue-rotate-90"
        />
      </section>

      <section id="order-total" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto">
        <h3 className="text-3xl font-Kurale font-bold text-[#E9F0CD]">
          Total: <FaRupeeSign className="inline" />
          {getCartTotal().toFixed(2)}
        </h3>
      </section>

      <section id="cart-items" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto mt-2 mb-8">
        {cart.map((item: any, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between mb-4 bg-[#E9F0CD]/10 p-4 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <Image
                width={50}
                height={50}
                alt={item.title}
                src={item.image}
                className="object-cover w-14 h-14 rounded-full shadow shadow-[#111111] border-2 border-[#111111]"
              />
              <div>
                <h3 className="font-bold text-[#E9F0CD]">{item.title}</h3>
                <p className="text-sm text-[#E9F0CD]/70 font-Kurale">{item.selectedSize} plate</p>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => {
                  updateCartItemQuantity(item.title, item.selectedSize, item.quantity - 1);
                }}
                className="text-[#E9F0CD] px-2"
              >
                <FaMinus />
              </button>
              <span className="mx-2 text-[#E9F0CD]">{item.quantity}</span>
              <button
                onClick={() => {
                  updateCartItemQuantity(item.title, item.selectedSize, item.quantity + 1);
                }}
                className="text-[#E9F0CD] px-2"
              >
                <FaPlus />
              </button>
              <button
                onClick={() => {
                  removeFromCart(item.title, item.selectedSize);
                }}
                className="ml-4 text-red-500 font-bold font-Kurale text-xs"
              >
                remove
              </button>
            </div>
          </div>
        ))}
      </section>

      {!orderPlaced && cart.length > 0 && (
        <section className="flex items-center justify-center">
          <section className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col m-2 bg-[#E9F0CD]/10 p-4 rounded-lg text-[#FFF4E9] shadow-md shadow-[#1C2924]">
            <span className="flex items-center justify-center gap-2 text-xl font-bold font-Kurale xl:text-6xl">
              <GiDeliveryDrone size={80} className="animate-pulse text-[#FFF4E9]" />
              Confirm Your Culinary Journey and Place Your Orders
            </span>
            <div className="mt-2 space-y-2">
              <button
                disabled={isLoading}
                onClick={handlePlaceOrder}
                className="w-full px-4 py-2 transition duration-700 ease-in-out transform rounded-full bg-[#E9F0CD] hover:bg-[#A8B67C] text-[#172B25] flex items-center justify-center gap-2 font-Kurale font-bold"
              >
                {isLoading ? "Processing..." : "Confirm Order!"}
              </button>
              <Link
                href={"/home"}
                className="w-full px-4 py-2 transition duration-700 ease-in-out transform rounded-full bg-[#E9F0CD] hover:bg-[#A8B67C] text-[#172B25] flex items-center justify-center gap-2 font-Kurale font-bold"
              >
                No, I want to add more!
              </Link>
            </div>
            {error && <p className="mt-2 text-red-500">{error}</p>}
          </section>
        </section>
      )}

      {!orderPlaced && cart.length === 0 && (
        <section className="flex items-center justify-center">
          <section className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col m-2 bg-[#E9F0CD]/10 p-4 rounded-lg text-[#FFF4E9] shadow-md shadow-[#1C2924]">
            <span className="flex items-center justify-center gap-2 text-xl font-bold font-Kurale xl:text-6xl">
              <GiDeliveryDrone size={80} className="animate-pulse text-[#FFF4E9]" />
              Your Cart is Empty! Let's Fill it up.
            </span>
            <div className="mt-2 space-y-2">
              <Link
                href={"/home"}
                className="w-full px-4 py-2 transition duration-700 ease-in-out transform rounded-full bg-[#E9F0CD] hover:bg-[#A8B67C] text-[#172B25] flex items-center justify-center gap-2 font-Kurale font-bold"
              >
                Go To Food Items
              </Link>
            </div>
            {error && <p className="mt-2 text-red-500">{error}</p>}
          </section>
        </section>
      )}

      {/* <section id="place-order" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto mt-8">
<button
onClick={handlePlaceOrder}
disabled={isLoading || cart.length === 0}
className="bg-[#E9F0CD] text-[#1C2924] px-6 py-2 rounded-full font-bold disabled:opacity-50"
>
{isLoading ? "Placing Order..." : "Place Order"}
</button>
{error && <p className="text-red-500 mt-2">{error}</p>}
{orderPlaced && <p className="text-green-500 mt-2">Order placed successfully!</p>}
</section> */}

      {cancelTimeRemaining !== null && (
        <section id="cancel-order" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto mt-8">
          <p className="text-[#E9F0CD]">
            You can cancel your order within the next {cancelTimeRemaining} seconds.
          </p>
          <button
            onClick={() => handleCancelOrder(latestOrderId!)}
            className="bg-red-500 text-[#FFF4E9] px-4 py-2 rounded mt-2"
          >
            Cancel Order
          </button>
        </section>
      )}

      {prevOrders && prevOrders.length > 0 && (
        <section id="previous-orders" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto mt-8">
          <h3 className="text-2xl font-bold text-[#E9F0CD] mb-4">Previous Orders</h3>
          {prevOrders.map((order: any, index: number) => (
            <div key={index} className="bg-[#E9F0CD]/10 p-4 rounded-lg mb-4">
              <p className="text-[#E9F0CD]">Order ID: {order.id}</p>
              <p className="text-[#E9F0CD]">
                Total: <FaRupeeSign className="inline" />
                {order.total}
              </p>
              <p className="text-[#E9F0CD]">Date: {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
