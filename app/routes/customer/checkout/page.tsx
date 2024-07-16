// app/routes/customer/checkout/page.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import Loading from "./loading";
import { LuBike } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { MdFastfood } from "react-icons/md";
import { pusherClient } from "@/lib/pusher";
import { useSession } from "next-auth/react";
import type Order from "@/app/_src/types/Order";
import { GiDeliveryDrone } from "react-icons/gi";
import { useStore } from "@/app/_src/others/store";
import React, { useEffect, useState } from "react";
import { FaRupeeSign, FaPlus, FaMinus, FaEye, FaEyeSlash } from "react-icons/fa";
import { HiLocationMarker, HiMail, HiPhone, HiGlobe, HiCreditCard } from "react-icons/hi";

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showGif, setShowGif] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pusherChannel, setPusherChannel] = useState<any>(null);
  const [prevOrders, setPreviousOrders] = useState<Order[]>([]);
  const [visualizedOrders, setVisualizedOrders] = useState<{ [key: string]: boolean }>({});
  const { cart, removeFromCart, updateCartItemQuantity, clearCart, getCartTotal } = useStore();
  const [userData, setUserData] = useState({ phoneNumber: "", customerEmail: "", locationData: { latitude: "", longitude: "", address: "", pincode: "" } });
  const ToggleVisualize = (orderId: string) => setVisualizedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));

  async function fetchPreviousOrders(userId: string) {
    const response = await fetch("/api/orders?userId=" + userId);
    if (!response.ok) setError("Failed to fetch order!");
    const data = await response.json();
    return data.orders;
  }

  useEffect(() => {
    try {
      if (session?.user?.email) {
        const channel = pusherClient.subscribe(`user-${session.user.email}`);
        setPusherChannel(channel);
        channel.bind("order-updated", (data: { orderId: string; status: string }) => {
          setPreviousOrders((prevOrders) => prevOrders.map((order) => (order._id === data.orderId ? { ...order, status: data.status } : order)));
        });
        fetchPreviousOrders(session.user.email).then((orders) => setPreviousOrders(orders));
        fetch("/api/user", { method: "GET", headers: { "Content-Type": "application/json" } })
          .then((response) => response.json())
          .then((data) => setUserData((prev) => ({ ...prev, phoneNumber: data.phoneNumber || "", customerEmail: data.customerEmail || "", locationData: data.locationData || "" })))
          .catch((err) => console.error("Failed to fetch user data", err));
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
    return () => {
      if (pusherChannel) {
        pusherChannel.unbind_all();
        pusherChannel.unsubscribe();
      }
    };
  }, [session]);

  useEffect(() => {
    try {
      const storedOrderTime = localStorage.getItem("OrderPlacedTime");
      const storedOrderId = localStorage.getItem("LatestOrderID");
      if (storedOrderId && storedOrderTime) {
        localStorage.removeItem("LatestOrderID");
        localStorage.removeItem("OrderPlacedTime");
      }
      if (showGif) {
        const timer = setTimeout(async () => {
          setShowGif(false);
          const updatedOrders = await fetchPreviousOrders(session?.user?.email as string);
          setPreviousOrders(updatedOrders);
        }, 4000);
        return () => clearTimeout(timer);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [showGif, session]);

  const ConfirmOrder = async () => {
    try {
      setError(null);
      setShowGif(true);
      setIsLoading(true);
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, ...userData, totalAmount: getCartTotal(), userId: session?.user?.email }),
      });
      if (!response.ok) setError("Failed to place order!");
      const { orderId } = await response.json();
      localStorage.setItem("OrderPlacedTime", Date.now().toString());
      localStorage.setItem("LatestOrderID", orderId);
      setOrderPlaced(true);
      clearCart();
      if (session?.user?.email) {
        await fetch("/api/pusher", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ channel: `user-${session.user.email}`, event: "update-order", data: { userId: session.user.email, orderId, status: "Placed" } }),
        });
      }
    } catch {
      setError("Failed to place order!");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) throw new Error(error);

  // =======================================================================================================================================================================
  const Header = () => {};
  const UserData = () => {};
  // =======================================================================================================================================================================

  return (
    <main className="max-w-full mx-auto overflow-hidden bg-primary p-4">
      {showGif && (
        <section className="fixed font-Kurale inset-0 flex flex-col items-center justify-center bg-secondary/60 text-primary backdrop-blur-2xl z-50">
          <img src="/Moto.gif" alt="Moto" className="object-contain h-72 sm:h-80 lg:h-96" />
          <p className="mb-4 text-5xl md:text-9xl font-bold">Order Placed,</p>
          <ul className="text-lg md:xl p-8 list-disc font-Kurale">
            <li>Thank you for ordering!</li>
            <li>Please keep an eye on your order status.</li>
            <li>Closing in 4s.</li>
          </ul>
        </section>
      )}
      {/* ======================================================================================================================================================================= */}
      <section id="header" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col md:justify-center md:items-center sm:text-center text-secondary font-Playfair">
        <h1 className="text-7xl sm:text-9xl font-bold text-secondary">Order Summary</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2 font-Kurale">
          Here's a summary of your order, <span className="underline font-bold font-Playfair">{session?.user?.name}</span>! <br />
          Review it and make changes if required!
        </h2>
        <img src="/checkout.gif" className="mx-auto object-cover h-80 sm:h-96 lg:h-112" />
      </section>
      {/* ======================================================================================================================================================================= */}
      {getCartTotal() > 0 && (
        <section id="order-total" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto">
          <p className="text-2xl font-bold font-Kurale bg-secondary text-primary px-3 py-2 rounded-2xl flex items-center">
            Total: <FaRupeeSign size={20} className="inline-flex ml-2" />
            {getCartTotal().toFixed(2)}
          </p>
        </section>
      )}
      {/* ======================================================================================================================================================================= */}
      <section id="cart-items" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto mt-2 mb-8">
        {cart.map((item: any, index: number) => (
          <div key={index} className="flex items-center justify-between mb-4 bg-secondary/20 p-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <Image width={540} height={540} alt={item.title} src={item.image} className="object-cover w-14 h-14 rounded-full shadow shadow-secondary border-2 border-secondary" />
              <div>
                <h3 className="font-bold text-secondary">{item.title}</h3>
                <p className="text-sm text-secondary/70 font-Kurale">{item.selectedSize} plate</p>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => {
                  updateCartItemQuantity(item.title, item.selectedSize, item.quantity - 1);
                }}
                className="text-secondary px-2"
              >
                <FaMinus />
              </button>
              <span className="mx-2 text-secondary">{item.quantity}</span>
              <button
                onClick={() => {
                  updateCartItemQuantity(item.title, item.selectedSize, item.quantity + 1);
                }}
                className="text-secondary px-2"
              >
                <FaPlus />
              </button>
              <button
                onClick={() => {
                  removeFromCart(item.title, item.selectedSize);
                }}
                className="ml-4 text-red-800 font-bold font-Kurale text-xs"
              >
                remove
              </button>
            </div>
          </div>
        ))}
      </section>
      {/* ======================================================================================================================================================================= */}
      {!orderPlaced ? (
        cart.length > 0 ? (
          <section className="flex items-center justify-center">
            <section className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col m-2 bg-secondary p-2 rounded-2xl text-primary">
              <div className="bg-primary/20 rounded-2xl p-4 font-Kurale">
                <h4 className="font-bold mb-3 text-3xl border-b border-primary pb-2">Delivery Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <HiLocationMarker size={20} className="inline-flex mr-2" />
                    <p>
                      <span className="font-semibold">Address:</span> {userData.locationData.address}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <HiCreditCard size={20} className="inline-flex mr-2" />
                    <p>
                      <span className="font-semibold">Pincode:</span> {userData.locationData.pincode}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <HiGlobe size={20} className="inline-flex mr-2" />
                    <p>
                      <span className="font-semibold">Coordinates:</span> {userData.locationData.latitude}, {userData.locationData.longitude}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <HiPhone size={20} className="inline-flex mr-2" />
                    <p>
                      <span className="font-semibold">Phone:</span> {userData.phoneNumber}
                    </p>
                  </div>
                  <div className="flex items-center md:col-span-2">
                    <HiMail size={20} className="inline-flex mr-2" />
                    <p>
                      <span className="font-semibold">Email:</span> {userData.customerEmail}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-2 space-y-2">
                <button
                  disabled={isLoading}
                  onClick={ConfirmOrder}
                  className="w-full px-4 py-2 transition duration-700 ease-in-out transform rounded-2xl bg-primary hover:bg-tertiary text-secondary flex items-center justify-center gap-2 font-Kurale font-bold"
                >
                  <LuBike size={25} /> {isLoading ? "Processing..." : "Confirm Data and Place Order"}
                </button>
                <Link
                  href={"/routes/customer/menu"}
                  className="w-full px-4 py-2 transition duration-700 ease-in-out transform rounded-2xl bg-primary hover:bg-tertiary text-secondary flex items-center justify-center gap-2 font-Kurale font-bold"
                >
                  <MdFastfood size={20} /> I want to add more!
                </Link>
              </div>
              {error && <p className="mt-2 text-red-500">{error}</p>}
            </section>
          </section>
        ) : (
          <section className="flex items-center justify-center">
            <section className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col m-2 bg-secondary p-4 rounded-2xl text-primary">
              <span className="flex items-center justify-center gap-2 font-bold font-Kurale text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                <GiDeliveryDrone size={80} className="animate-pulse text-primary" />
                Your Cart is Empty! Let's Fill it up.
              </span>
              <div className="mt-2 space-y-2">
                <Link
                  href={"/routes/customer/menu"}
                  className="w-full px-4 py-2 transition duration-700 ease-in-out transform rounded-2xl bg-primary hover:bg-tertiary text-secondary flex items-center justify-center gap-2 font-Kurale font-bold"
                >
                  <MdFastfood size={20} /> Add Food Items
                </Link>
              </div>
              {error && <p className="mt-2 text-red-500">{error}</p>}
            </section>
          </section>
        )
      ) : null}
      {/* ======================================================================================================================================================================= */}
      {prevOrders && prevOrders.length > 0 && (
        <section id="previous-orders" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto mt-8 text-secondary">
          <h3 className="text-4xl font-bold font-Kurale bg-secondary text-primary px-3 py-2 rounded-2xl flex items-center mb-1">My Orders</h3>
          {prevOrders
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((order: any, index: number) => (
              <div key={index} className="bg-secondary/80 text-primary p-4 rounded-2xl mb-4 font-bold font-Kurale">
                <div className="flex justify-between items-center">
                  <p className="text-lg md:text-xl lg:text-2xl font-bold">
                    Order ID: <span className="text-xs sm:text-sm md:text-lg font-RobotoCondensed">{order._id}</span>{" "}
                  </p>
                  <button
                    onClick={() => ToggleVisualize(order._id)}
                    className="transition duration-700 ease-in-out transform rounded-full bg-primary text-secondary px-3 py-1 flex items-center font-bold text-xs sm:text-sm md:text-lg"
                  >
                    {visualizedOrders[order._id] ? (
                      <>
                        <FaEyeSlash className="mr-2" /> Hide
                      </>
                    ) : (
                      <>
                        <FaEye className="mr-2" /> Show
                      </>
                    )}
                  </button>
                </div>
                <ul className="list-disc ml-8">
                  <li className="md:text-lg lg:text-xl font-bold">
                    Date & Time: <span className="text-xs sm:text-sm md:text-lg font-RobotoCondensed">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</span>
                  </li>
                  <li className="md:text-lg lg:text-xl font-bold">
                    Total: <span className="text-xs sm:text-sm md:text-lg font-RobotoCondensed">{typeof order.total === "number" ? order.total.toFixed(2) : "N/A"}</span>
                  </li>
                  <li className="md:text-lg lg:text-xl font-bold">
                    Items: <span className="text-xs sm:text-sm md:text-lg font-RobotoCondensed">{order.items && order.items.length > 0 ? order.items.length : "No items"}</span>
                  </li>
                  <li className="md:text-lg lg:text-xl font-bold">
                    Status: <span className="text-xs sm:text-sm md:text-lg font-RobotoCondensed animate-pulse">{order.status}</span>
                  </li>
                </ul>
                {visualizedOrders[order._id] && order.items && order.items.length > 0 && (
                  <div className="mt-4">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-secondary/30">
                          <th className="text-left p-2">Item</th>
                          <th className="text-left p-2">Size</th>
                          <th className="text-right p-2">Price</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs">
                        {order.items.map((item: any, itemIndex: number) => {
                          const price = typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;
                          const quantity = typeof item.quantity === "number" ? item.quantity : parseInt(item.quantity, 10) || 0;
                          return (
                            <tr key={itemIndex} className="border-b border-secondary/10">
                              <td className="p-2 font-light">{item.title}</td>
                              <td className="p-2 font-light">
                                {item.selectedSize} x{quantity}
                              </td>
                              <td className="text-right p-2 font-light">{price.toFixed(2)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
        </section>
      )}
    </main>
  );
}
