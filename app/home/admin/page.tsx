// app/home/admin/page.tsx
"use client";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type Order from "@/app/_src/types/Order";
import OrderList from "./_components/OrderList";
import OrderDetails from "./_components/OrderDetails";
import DashboardSummary from "./_components/DashboardSummary";

export default function AdminPage() {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [visualizedOrders, setVisualizedOrders] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/websocket");
      const newSocket = io();
      setSocket(newSocket);
      if (session?.user?.email) newSocket.emit("join-room", session.user.email);
      newSocket.on("order-updated", (data: { orderId: string; status: string }) => {
        setOrders((prevOrders) => prevOrders.map((order) => (order._id === data.orderId ? { ...order, status: data.status } : order)));
        if (selectedOrder && selectedOrder._id === data.orderId) setSelectedOrder((prev) => (prev ? { ...prev, status: data.status } : null));
      });
    };
    socketInitializer();
    fetchOrders();
    return () => {
      if (socket) socket.disconnect();
    };
  }, [session]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");
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
      if (!response.ok) throw new Error("Failed to update order status");
      if (socket) socket.emit("update-order", { userId, orderId, status: newStatus });
      setOrders((prevOrders) => prevOrders.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order)));
      if (selectedOrder && selectedOrder._id === orderId) setSelectedOrder({ ...selectedOrder, status: newStatus });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleVisualize = (orderId: string) => setVisualizedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
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
            <OrderList orders={orders} selectedOrderId={selectedOrder?._id} onSelectOrder={setSelectedOrder} visualizedOrders={visualizedOrders} toggleVisualize={toggleVisualize} />
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
