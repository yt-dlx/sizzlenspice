// app/routes/customer/checkout/page.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import Loading from "./loading";
import { motion } from "framer-motion";
import { LuBike } from "react-icons/lu";
import { MdFastfood } from "react-icons/md";
import { pusherClient } from "@/lib/pusher";
import { useSession } from "next-auth/react";
import { GiDeliveryDrone } from "react-icons/gi";
import type Order from "@/app/_assets/types/Order";
import React, { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { useStore } from "@/app/_assets/others/store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaRupeeSign, FaPlus, FaMinus, FaEye, FaEyeSlash } from "react-icons/fa";
import { HiLocationMarker, HiMail, HiPhone, HiGlobe, HiCreditCard } from "react-icons/hi";

export default function CartPage() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [showGif, setShowGif] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [pusherChannel, setPusherChannel] = useState<any>(null);
  const [visualizedOrders, setVisualizedOrders] = useState<{ [key: string]: boolean }>({});
  const { cart, removeFromCart, updateCartItemQuantity, clearCart, getCartTotal } = useStore();
  const [userData, setUserData] = useState({
    phoneNumber: "",
    customerEmail: "",
    locationData: { latitude: "", longitude: "", address: "", pincode: "" },
  });
  const ToggleVisualize = (orderId: string) =>
    setVisualizedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));

  const {
    data: prevOrders,
    isLoading,
    error,
    refetch,
  } = useQuery<Order[], Error>({
    queryKey: ["orders", session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) return [];
      const response = await fetch("/api/orders?userId=" + session.user.email);
      if (!response.ok) throw new Error("Failed to fetch order!");
      const data = await response.json();
      return data.orders;
    },
    enabled: !!session?.user?.email,
  });

  const { mutate: placeOrder } = useMutation({
    mutationFn: async () => {
      if (!session?.user?.email) throw new Error("User not logged in!");
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          ...userData,
          totalAmount: getCartTotal(),
          userId: session.user.email,
        }),
      });
      if (!response.ok) throw new Error("Failed to place order!");
      const { orderId } = await response.json();
      return orderId;
    },
    onSuccess: async (orderId) => {
      localStorage.setItem("OrderPlacedTime", Date.now().toString());
      localStorage.setItem("LatestOrderID", orderId);
      setOrderPlaced(true);
      clearCart();
      if (session?.user?.email) {
        await fetch("/api/pusher", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            channel: `user-${session.user.email}`,
            event: "update-order",
            data: { userId: session.user.email, orderId, status: "Placed" },
          }),
        });
      }
      queryClient.invalidateQueries({ queryKey: ["orders", session?.user?.email] });
    },
  });

  useEffect(() => {
    try {
      if (session?.user?.email) {
        const channel = pusherClient.subscribe(`user-${session.user.email}`);
        setPusherChannel(channel);
        channel.bind("order-updated", (data: { orderId: string; status: string }) => {
          queryClient.setQueryData<Order[]>(
            ["orders", session?.user?.email],
            (oldData) =>
              oldData?.map((order) =>
                order._id === data.orderId ? { ...order, status: data.status } : order
              ) || []
          );
        });
        fetch("/api/user", { method: "GET", headers: { "Content-Type": "application/json" } })
          .then((response) => response.json())
          .then((data) =>
            setUserData((prev) => ({
              ...prev,
              phoneNumber: data.phoneNumber || "",
              customerEmail: data.customerEmail || "",
              locationData: data.locationData || "",
            }))
          )
          .catch((err) => console.error("Failed to fetch user data", err));
      }
    } catch (error: any) {
      console.error(error.message);
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
        const timer = setTimeout(() => {
          setShowGif(false);
          refetch();
        }, 4000);
        return () => clearTimeout(timer);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }, [showGif, refetch]);

  const ConfirmOrder = async () => {
    try {
      setShowGif(true);
      placeOrder();
    } catch (error: any) {
      console.error(error.message);
    }
  };

  if (isLoading) return <Loading />;
  if (error) throw error;

  return (
    <main className="max-w-full mx-auto overflow-hidden bg-primary p-4">
      {showGif && (
        <section
          id="ShowGif"
          className="fixed inset-0 flex flex-col items-center justify-center bg-secondary/60 text-primary backdrop-blur-2xl z-50"
        >
          <img src="/Moto.gif" alt="Moto" className="object-contain h-72 sm:h-80 lg:h-96" />
          <p className="mb-4 text-5xl md:text-9xl">Order Placed,</p>
          <ul className="text-lg md:xl p-8 list-disc">
            <li>Thank you for ordering!</li>
            <li>Please keep an eye on your order status.</li>
            <li>Closing in 4s.</li>
          </ul>
        </section>
      )}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        id="header"
        className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col md:justify-center md:items-center sm:text-center text-secondary"
      >
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-secondary">
          <TypeAnimation
            sequence={["Order Summary", 2000]}
            repeat={Infinity}
            wrapper="span"
            speed={2}
          />
        </h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2">
          Here's a summary of your order, <span className="underline">{session?.user?.name}</span>!{" "}
          <br />
          Review it and make changes if required!
        </h2>
        <img src="/checkout.gif" className="mx-auto object-cover h-80 sm:h-96 lg:h-112" />
      </motion.section>
      {getCartTotal() > 0 && (
        <section id="order-total" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto">
          <p className="text-2xl bg-secondary text-primary px-3 py-2 rounded-xl flex items-center shadow-md shadow-secondary">
            Total: <FaRupeeSign size={20} className="inline-flex ml-2" />
            {getCartTotal().toFixed(2)}
          </p>
        </section>
      )}
      <section id="cart-items" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto mt-2 mb-8">
        {cart.map((item: any, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between mb-4 bg-secondary/20 p-4 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <Image
                width={540}
                height={540}
                alt={item.title}
                src={item.image}
                className="object-cover w-14 h-14 rounded-full shadow shadow-secondary border-2 border-secondary"
              />
              <div>
                <h3 className="font-bold text-secondary">{item.title}</h3>
                <p className="text-sm text-secondary/70">{item.selectedSize} plate</p>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => {
                  updateCartItemQuantity(
                    item.title,
                    item.selectedSize,
                    item.restaurantId,
                    item.quantity - 1
                  );
                }}
                className="text-secondary px-2"
              >
                <FaMinus />
              </button>
              <span className="mx-2 text-secondary">{item.quantity}</span>
              <button
                onClick={() => {
                  updateCartItemQuantity(
                    item.title,
                    item.selectedSize,
                    item.restaurantId,
                    item.quantity + 1
                  );
                }}
                className="text-secondary px-2"
              >
                <FaPlus />
              </button>
              <button
                onClick={() => {
                  removeFromCart(item.title, item.selectedSize, item.restaurantId);
                }}
                className="ml-4 text-red-800 text-xs"
              >
                remove
              </button>
            </div>
          </div>
        ))}
      </section>
      {!orderPlaced ? (
        cart.length > 0 ? (
          <section id="delivery-info" className="flex items-center justify-center">
            <section className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col m-2 bg-secondary p-2 rounded-xl text-primary shadow-md shadow-secondary">
              <div className="bg-primary/20 rounded-xl p-4">
                <h4 className="font-bold mb-3 text-3xl border-b border-primary pb-2">
                  Delivery Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <HiLocationMarker size={20} className="inline-flex mr-2" />
                    <p>
                      <span className="font-semibold">Address:</span>{" "}
                      {userData.locationData.address}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <HiCreditCard size={20} className="inline-flex mr-2" />
                    <p>
                      <span className="font-semibold">Pincode:</span>{" "}
                      {userData.locationData.pincode}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <HiGlobe size={20} className="inline-flex mr-2" />
                    <p>
                      <span className="font-semibold">Coordinates:</span>{" "}
                      {userData.locationData.latitude}, {userData.locationData.longitude}
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
                  className="w-full p-2 transition duration-700 ease-in-out transform rounded-xl bg-primary hover:bg-tertiary text-secondary flex items-center justify-center gap-2"
                >
                  <LuBike size={25} />{" "}
                  {isLoading ? "Processing..." : "Confirm Data and Place Order"}
                </button>
                <Link
                  href={"/routes/customer/menu"}
                  className="w-full p-2 transition duration-700 ease-in-out transform rounded-xl bg-primary hover:bg-tertiary text-secondary flex items-center justify-center gap-2"
                >
                  <MdFastfood size={20} /> I want to add more!
                </Link>
              </div>
              {error && <p className="mt-2 text-red-500">{error}</p>}
            </section>
          </section>
        ) : (
          <section className="flex items-center justify-center">
            <section className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col m-2 bg-secondary p-4 rounded-xl text-primary shadow-md shadow-secondary">
              <span className="flex items-center justify-center gap-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                <GiDeliveryDrone size={80} className="animate-pulse text-primary" />
                Your Cart is Empty! Let's Fill it up.
              </span>
              <div className="mt-2 space-y-2">
                <Link
                  href={"/routes/customer/menu"}
                  className="w-full p-2 transition duration-700 ease-in-out transform rounded-xl bg-primary hover:bg-tertiary text-secondary flex items-center justify-center gap-2"
                >
                  <MdFastfood size={20} /> Add Food Items
                </Link>
              </div>
              {error && <p className="mt-2 text-red-500">{error}</p>}
            </section>
          </section>
        )
      ) : null}
      {prevOrders && prevOrders.length > 0 && (
        <section
          id="previous-orders"
          className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto mt-8 text-secondary"
        >
          <h3 className="text-4xl bg-secondary text-primary px-3 py-2 rounded-xl flex items-center mb-2 shadow-md shadow-secondary">
            My Orders
          </h3>
          {prevOrders
            .sort(
              (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .map((order: any, index: number) => (
              <div key={index} className="bg-secondary/80 text-primary p-4 rounded-xl mb-4">
                <div className="flex justify-between items-center">
                  <p className="text-lg md:text-xl lg:text-2xl">
                    Order ID: <span className="text-xs sm:text-sm md:text-lg">{order._id}</span>{" "}
                  </p>
                  <button
                    onClick={() => ToggleVisualize(order._id)}
                    className="transition duration-700 ease-in-out transform rounded-full bg-primary text-secondary px-3 py-1 flex items-center text-xs sm:text-sm md:text-lg"
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
                  <li className="md:text-lg lg:text-xl">
                    Date & Time:{" "}
                    <span className="text-xs sm:text-sm md:text-lg">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}
                    </span>
                  </li>
                  <li className="md:text-lg lg:text-xl">
                    Total:{" "}
                    <span className="text-xs sm:text-sm md:text-lg">
                      {typeof order.total === "number" ? order.total.toFixed(2) : "N/A"}
                    </span>
                  </li>
                  <li className="md:text-lg lg:text-xl">
                    Items:{" "}
                    <span className="text-xs sm:text-sm md:text-lg">
                      {order.items && order.items.length > 0 ? order.items.length : "No items"}
                    </span>
                  </li>
                  <li className="md:text-lg lg:text-xl">
                    Status:{" "}
                    <span className="text-xs sm:text-sm md:text-lg animate-pulse">
                      {order.status}
                    </span>
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
                          const price =
                            typeof item.price === "number"
                              ? item.price
                              : parseFloat(item.price) || 0;
                          const quantity =
                            typeof item.quantity === "number"
                              ? item.quantity
                              : parseInt(item.quantity, 10) || 0;
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
