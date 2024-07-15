// app/routes/restaurant/orders/page.tsx
"use client";
import Image from "next/image";
import { pusherClient } from "@/src/public/lib/pusher";
import type Order from "@/src/app/_src/types/Order";
import React, { useEffect, useState } from "react";
import { FaRupeeSign, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdShoppingCart, MdLocalShipping, MdDoneAll } from "react-icons/md";

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderTimers, setOrderTimers] = useState<{ [key: string]: number }>({});
  const [visualizedOrders, setVisualizedOrders] = useState<{ [key: string]: boolean }>({});
  const toggleVisualize = (orderId: string) => setVisualizedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));

  useEffect(() => {
    const channel = pusherClient.subscribe("partner-channel");
    channel.bind("order-updated", (data: { orderId: string; status: string }) => {
      setOrders((prevOrders) => prevOrders.map((order) => (order._id === data.orderId ? { ...order, status: data.status } : order)));
      if (selectedOrder && selectedOrder._id === data.orderId) setSelectedOrder((prev) => (prev ? { ...prev, status: data.status } : null));
    });
    fetchOrders();
    const timerInterval = setInterval(() => {
      setOrderTimers((prevTimers) => {
        const newTimers = { ...prevTimers };
        orders.forEach((order) => {
          if (order.status !== "Completed") newTimers[order._id] = (newTimers[order._id] || 0) + 1;
        });
        return newTimers;
      });
    }, 1000);
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      clearInterval(timerInterval);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const statusOptions = ["Preparing", "Delivering", "Completed"];
  const statusIcons = { Preparing: <MdShoppingCart />, Delivering: <MdLocalShipping />, Completed: <MdDoneAll /> };
  const formatCreatedAt = (createdAt: string | number | Date) => {
    const formattedDate = new Date(createdAt).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      second: "numeric",
      minute: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      day: "numeric",
    });
    return formattedDate;
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/orders");
      if (!response.ok) setError("Failed to fetch orders");
      const data = await response.json();
      const reversedOrders = data.orders.reverse();
      setOrders(reversedOrders);
      if (reversedOrders.length > 0) setSelectedOrder(reversedOrders[0]);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string, userId: string) => {
    try {
      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (!response.ok) setError("Failed to update order status");
      await fetch("/api/pusher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel: `user-${userId}`, event: "order-updated", data: { orderId, status: newStatus } }),
      });
      await fetch("/api/pusher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel: "partner-channel", event: "order-updated", data: { orderId, status: newStatus } }),
      });
      setOrderTimers((prevTimers) => ({ ...prevTimers, [orderId]: 0 }));
      setOrders((prevOrders) => prevOrders.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order)));
      if (selectedOrder && selectedOrder._id === orderId) setSelectedOrder({ ...selectedOrder, status: newStatus });
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (isLoading) return <p className="text-secondary">Loading...</p>;
  if (error) throw new Error(error);

  return (
    <main className="max-w-full mx-auto overflow-hidden bg-gradient-to-b from-primary/30 from-10% via-[#171717] via-40% to-[#131313] to-50% p-4 text-secondary">
      <section id="header" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col md:justify-center md:items-center sm:text-center text-secondary font-Playfair mb-8">
        <h1 className="text-7xl sm:text-9xl font-bold text-secondary">Order Management</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2 font-Kurale">Manage and track all incoming orders efficiently in one place, all in real-time!</h2>
      </section>
      {/* ======================================================================================================================================================================= */}
      <div className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto">
        <section id="DashboardSummary">
          <header className="text-4xl font-bold mb-1 font-Kurale bg-secondary text-primary shadow shadow-[#131313] px-3 py-2 rounded-lg flex items-center justify-center">My Work Summary</header>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <li className="bg-secondary/10 p-1 rounded-lg shadow shadow-[#131313] border-2 border-[#131313] text-secondary flex flex-col items-center justify-center text-center">
              <header className="text-xl font-bold font-Kurale text-center">Pending Orders</header>
              <article className="text-3xl md:text-4xl font-semibold font-Playfair text-center">{orders.filter((order) => order.status === "Pending").length}</article>
            </li>
            <li className="bg-secondary/10 p-1 rounded-lg shadow shadow-[#131313] border-2 border-[#131313] text-secondary flex flex-col items-center justify-center text-center">
              <header className="text-xl font-bold font-Kurale">Preparing</header>
              <article className="text-3xl md:text-4xl font-semibold font-Playfair">{orders.filter((order) => order.status === "Preparing").length}</article>
            </li>
            <li className="bg-secondary/10 p-1 rounded-lg shadow shadow-[#131313] border-2 border-[#131313] text-secondary flex flex-col items-center justify-center text-center">
              <header className="text-xl font-bold font-Kurale">Delivering</header>
              <article className="text-3xl md:text-4xl font-semibold font-Playfair">{orders.filter((order) => order.status === "Delivering").length}</article>
            </li>
            <li className="bg-secondary/10 p-1 rounded-lg shadow shadow-[#131313] border-2 border-[#131313] text-secondary flex flex-col items-center justify-center text-center">
              <header className="text-xl font-bold font-Kurale">Completed</header>
              <article className="text-3xl md:text-4xl font-semibold font-Playfair">{orders.filter((order) => order.status === "Completed").length}</article>
            </li>
          </ul>
        </section>
        {/* ======================================================================================================================================================================= */}
        <section id="OrderList" className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-1">
            <div className="bg-secondary/10 rounded-lg shadow-md p-4 text-secondary">
              <h2 className="text-4xl font-bold mb-4 font-Playfair">Orders</h2>
              <input type="text" placeholder="Search orders..." className="w-full p-2 mb-4 rounded-md bg-[#1C2924] text-secondary font-Kurale" />
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className={`p-4 rounded-lg cursor-pointer ${selectedOrder?._id === order._id ? "bg-[#1C2924]" : "bg-secondary/10"}`} onClick={() => setSelectedOrder(order)}>
                    <div className="flex justify-between items-center">
                      <div className="font-bold font-Kurale">
                        <ul className="list-disc ml-4">
                          <li>
                            Status: <span className="text-semibold font-Playfair animate-pulse">#{order.status}</span>
                          </li>
                          <li>
                            OrderID: <span className="text-semibold font-Playfair">#{order._id}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* ======================================================================================================================================================================= */}
          <section id="OrderDetails" className="lg:col-span-2">
            {selectedOrder ? (
              <div className="bg-secondary/10 rounded-lg shadow-md p-4 text-secondary">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-4xl font-bold font-Playfair">Order Details</h2>
                  <button onClick={() => toggleVisualize(selectedOrder._id)} className="bg-secondary text-primary px-3 py-1 rounded-full flex items-center font-bold text-xs font-Kurale">
                    {visualizedOrders[selectedOrder._id] ? (
                      <React.Fragment>
                        <FaEyeSlash className="mr-2" /> Hide
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <FaEye className="mr-2" /> Show
                      </React.Fragment>
                    )}
                  </button>
                </div>
                <div className="mb-4 font-Kurale">
                  <ul className="list-disc m-4">
                    <li className="text-sm font-RobotoCondensed">
                      <span className="font-bold text-lg mr-2 font-Kurale">User:</span> {selectedOrder.userId.split("@")[0]}
                    </li>
                    <li className="text-sm font-RobotoCondensed">
                      <span className="font-bold text-lg mr-2 font-Kurale">Status:</span>
                      <span className="animate-pulse">{selectedOrder.status}</span>
                      <span className="ml-2">({formatTime(orderTimers[selectedOrder._id] || 0)})</span>
                    </li>
                    <li className="text-sm font-RobotoCondensed">
                      <span className="font-bold text-lg mr-2 font-Kurale">Date & Time:</span> {formatCreatedAt(selectedOrder.createdAt)}
                    </li>
                    <li className="text-sm font-RobotoCondensed">
                      <span className="font-bold text-lg mr-2 font-Kurale">Email:</span> {selectedOrder.customerEmail}
                    </li>
                    <li className="text-sm font-RobotoCondensed">
                      <span className="font-bold text-lg mr-2 font-Kurale">Phone:</span> {selectedOrder.phoneNumber}
                    </li>
                    <li className="text-sm font-RobotoCondensed">
                      <span className="font-bold text-lg mr-2 font-Kurale">Address:</span> {selectedOrder.locationData?.address}
                    </li>
                    <li className="text-sm font-RobotoCondensed">
                      <span className="font-bold text-lg mr-2 font-Kurale">Pincode:</span> {selectedOrder.locationData?.pincode}
                    </li>
                    <li className="text-sm font-RobotoCondensed">
                      <span className="font-bold text-lg mr-2 font-Kurale">Total:</span> {selectedOrder.total}
                    </li>
                  </ul>
                </div>
                {visualizedOrders[selectedOrder._id] && (
                  <div className="space-y-4 mb-4">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center bg-secondary/10 p-4 rounded-lg">
                        <Image width={540} height={540} alt={item.title} src={item.image} className="object-cover w-14 h-14 rounded-full shadow shadow-[#131313] border-2 border-[#131313] mr-4" />
                        <div className="flex-1">
                          <div className="flex justify-between font-bold font-Kurale">
                            <span>{item.title}</span>
                            <span>x{item.quantity}</span>
                          </div>
                        </div>
                        <div className="font-bold font-Playfair flex items-center">
                          <FaRupeeSign className="mr-1" />
                          {(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
                  <div className="flex flex-wrap justify-center sm:justify-end space-x-2">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder._id, status, selectedOrder.userId)}
                        className={`px-4 py-2 mb-2 transition duration-700 ease-in-out transform rounded-full ${
                          selectedOrder.status === status ? "bg-[#A8B67C] text-primary" : "bg-secondary hover:bg-[#A8B67C] text-primary"
                        } font-Kurale font-bold flex items-center`}
                      >
                        {statusIcons[status as keyof typeof statusIcons]}
                        <span className="ml-2">{status}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <p className="font-bold font-Kurale m-2 text-2xl underline">
                  Current Status: <span className="font-Playfair text-lg">{selectedOrder.status}</span>
                </p>
              </div>
            ) : (
              <p className="p-4 rounded-lg bg-secondary/10 font-Kurale text-secondary">Select an order to view details</p>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
