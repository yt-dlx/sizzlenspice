// app/routes/admin/page.tsx
"use client";
import { pusherClient } from "@/lib/pusher";
import { useSession } from "next-auth/react";
import type Order from "@/app/_src/types/Order";
import React, { useEffect, useState } from "react";
import { FaRupeeSign, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdDashboard, MdShoppingCart, MdLocalShipping, MdDoneAll } from "react-icons/md";

export default function AdminPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [visualizedOrders, setVisualizedOrders] = useState<{ [key: string]: boolean }>({});
  const toggleVisualize = (orderId: string) => setVisualizedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));

  useEffect(() => {
    const channel = pusherClient.subscribe("admin-channel");
    channel.bind("order-updated", (data: { orderId: string; status: string }) => {
      setOrders((prevOrders) => prevOrders.map((order) => (order._id === data.orderId ? { ...order, status: data.status } : order)));
      if (selectedOrder && selectedOrder._id === data.orderId) setSelectedOrder((prev) => (prev ? { ...prev, status: data.status } : null));
    });
    fetchOrders();
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/orders");
      if (!response.ok) setError("Failed to fetch orders");
      const data = await response.json();
      const reversedOrders = data.orders.reverse();
      setOrders(reversedOrders);
      if (reversedOrders.length > 0) setSelectedOrder(reversedOrders[0]);
    } catch (err: any) {
      setError(err.message);
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
        body: JSON.stringify({ channel: "admin-channel", event: "order-updated", data: { orderId, status: newStatus } }),
      });
      setOrders((prevOrders) => prevOrders.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order)));
      if (selectedOrder && selectedOrder._id === orderId) setSelectedOrder({ ...selectedOrder, status: newStatus });
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!session) return <p className="text-[#E9F0CD]">Access denied. Please log in as an admin.</p>;
  if (isLoading) return <p className="text-[#E9F0CD]">Loading...</p>;
  if (error) return <p className="text-[#E9F0CD]">Error: {error}</p>;

  return (
    <main className="max-w-full mx-auto overflow-hidden bg-gradient-to-b from-[#1C3029]/30 from-10% via-[#171717] via-40% to-[#131313] to-50% p-4 text-[#E9F0CD]">
      <section id="header" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col md:justify-center md:items-center sm:text-center text-[#E9F0CD] font-Playfair mb-8">
        <h1 className="text-8xl sm:text-9xl font-bold text-[#E9F0CD]">Admin Dashboard</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2 font-Kurale">Manage orders and update their statuses</h2>
      </section>
      <div className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto">
        <DashboardSummary orders={orders} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-1">
            <OrderList orders={orders} selectedOrderId={selectedOrder?._id} onSelectOrder={setSelectedOrder} />
          </div>
          <div className="lg:col-span-2">
            {selectedOrder ? (
              <OrderDetails
                order={selectedOrder}
                onUpdateStatus={updateOrderStatus}
                isVisualized={visualizedOrders[selectedOrder._id] || false}
                toggleVisualize={() => toggleVisualize(selectedOrder._id)}
              />
            ) : (
              <p className="p-4 rounded-lg bg-[#E9F0CD]/10 font-Kurale text-[#E9F0CD]">Select an order to view details</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

const DashboardSummary: React.FC<{ orders: Order[] }> = ({ orders }) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div className="bg-[#E9F0CD]/10 p-4 rounded-lg shadow shadow-[#131313] border-2 border-[#131313] text-[#E9F0CD]">
        <h3 className="text-xl font-bold font-Kurale">Total Orders</h3>
        <p className="text-4xl font-semibold font-Playfair">{totalOrders}</p>
      </div>
      <div className="bg-[#E9F0CD]/10 p-4 rounded-lg shadow shadow-[#131313] border-2 border-[#131313] text-[#E9F0CD]">
        <h3 className="text-xl font-bold font-Kurale">Total Revenue</h3>
        <p className="text-4xl font-semibold font-Playfair flex items-center">
          <FaRupeeSign size={20} className="mr-1" /> {totalRevenue.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

const OrderDetails: React.FC<{
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: string, userId: string) => void;
  isVisualized: boolean;
  toggleVisualize: () => void;
}> = ({ order, onUpdateStatus, isVisualized, toggleVisualize }) => {
  const statusOptions = ["Accepted", "Preparing", "Delivering", "Completed"];
  const statusIcons = {
    Accepted: <MdDashboard />,
    Preparing: <MdShoppingCart />,
    Delivering: <MdLocalShipping />,
    Completed: <MdDoneAll />,
  };
  return (
    <div className="bg-[#E9F0CD]/10 rounded-lg shadow-md p-4 text-[#E9F0CD]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-4xl font-bold font-Playfair">Order Details</h2>
        <button onClick={toggleVisualize} className="bg-[#E9F0CD] text-[#172B25] px-3 py-1 rounded-full flex items-center font-bold text-xs font-Kurale">
          {isVisualized ? (
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
        <h3 className="font-bold">Task info</h3>
        <div>Address: {order.locationData?.address}</div>
        <div>Phone: {order.phoneNumber}</div>
      </div>
      {isVisualized && (
        <div className="space-y-4 mb-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center bg-[#E9F0CD]/10 p-4 rounded-lg">
              <img alt={item.title} src={item.image} className="object-cover w-14 h-14 rounded-full shadow shadow-[#131313] border-2 border-[#131313] mr-4" />
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
      <div className="text-right text-xl font-bold mt-4 font-Playfair flex items-center justify-end">
        Total: <FaRupeeSign className="mx-1" /> {order.total.toFixed(2)}
      </div>
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex flex-wrap justify-center sm:justify-end space-x-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => onUpdateStatus(order._id, status, order.userId)}
              className={`px-4 py-2 mb-2 transition duration-700 ease-in-out transform rounded-full ${
                order.status === status ? "bg-[#A8B67C] text-[#172B25]" : "bg-[#E9F0CD] hover:bg-[#A8B67C] text-[#172B25]"
              } font-Kurale font-bold flex items-center`}
            >
              {statusIcons[status as keyof typeof statusIcons]}
              <span className="ml-2">{status}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="font-bold font-Kurale m-2 text-2xl underline">
        Current Status: <span className="font-Playfair text-lg">{order.status}</span>
      </p>
    </div>
  );
};

const OrderList: React.FC<{
  orders: Order[];
  selectedOrderId: string | undefined;
  onSelectOrder: (order: Order) => void;
}> = ({ orders, selectedOrderId, onSelectOrder }) => {
  return (
    <div className="bg-[#E9F0CD]/10 rounded-lg shadow-md p-4 text-[#E9F0CD]">
      <h2 className="text-4xl font-bold mb-4 font-Playfair">Orders</h2>
      <input type="text" placeholder="Search orders..." className="w-full p-2 mb-4 rounded-md bg-[#1C2924] text-[#E9F0CD] font-Kurale" />
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className={`p-4 rounded-lg cursor-pointer ${selectedOrderId === order._id ? "bg-[#1C2924]" : "bg-[#E9F0CD]/10"}`}>
            <div className="flex justify-between items-center">
              <div className="font-bold font-Kurale" onClick={() => onSelectOrder(order)}>
                <ul className="list-disc ml-4">
                  <li>
                    Customer Email: <span className="text-semibold italic font-Playfair">{order.customerEmail}</span>
                  </li>
                  <li>
                    Phone Number: <span className="text-semibold italic font-Playfair">{order.phoneNumber}</span>
                  </li>
                  <li>
                    Status: <span className="text-semibold italic font-Playfair animate-pulse">#{order.status}</span>
                  </li>
                  <li>
                    OrderID: <span className="text-semibold italic font-Playfair">#{order._id}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
