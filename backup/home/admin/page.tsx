// app/gome/admin/page.tsx
"use client";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type Order from "@/app/_src/types/Order";

export default function AdminPage() {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
      setOrders(data.orders);
      if (data.orders.length > 0) setSelectedOrder(data.orders[0]);
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

  if (!session) return <p className="text-[#E9F0CD]">Access denied. Please log in as an admin.</p>;
  if (isLoading) return <p className="text-[#E9F0CD]">Loading...</p>;
  if (error) return <p className="text-[#E9F0CD]">Error: {error}</p>;

  return (
    <div className="flex bg-gradient-to-b from-[#1C3029]/30 from-10% via-[#171717] via-40% to-[#131313] to-50% text-[#E9F0CD] min-h-screen">
      <div className="max-w-7xl mx-auto flex-1 p-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        </header>

        <DashboardSummary orders={orders} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-1">
            <OrderList orders={orders} selectedOrderId={selectedOrder?._id} onSelectOrder={setSelectedOrder} />
          </div>
          <div className="lg:col-span-2">
            {selectedOrder ? <OrderDetails order={selectedOrder} onUpdateStatus={updateOrderStatus} /> : <p className="p-4 rounded-lg bg-[#E9F0CD]/10">Select an order to view details</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

const DashboardSummary: React.FC<{ orders: Order[] }> = ({ orders }) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const ordersByStatus = orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-[#E9F0CD]/10 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Total Orders</h3>
        <p className="text-3xl font-bold">{totalOrders}</p>
      </div>
      <div className="bg-[#E9F0CD]/10 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Total Revenue</h3>
        <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
      </div>
      {Object.entries(ordersByStatus).map(([status, count]) => (
        <div key={status} className="bg-[#E9F0CD]/10 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">{status} Orders</h3>
          <p className="text-3xl font-bold">{count}</p>
        </div>
      ))}
    </div>
  );
};

const OrderList: React.FC<{
  orders: Order[];
  selectedOrderId: string | undefined;
  onSelectOrder: (order: Order) => void;
}> = ({ orders, selectedOrderId, onSelectOrder }) => {
  return (
    <div className="bg-[#E9F0CD]/10 rounded-lg shadow-md p-4">
      <h2 className="text-2xl font-semibold mb-4">Orders</h2>
      <input type="text" placeholder="Search orders..." className="w-full p-2 mb-4 rounded-md bg-[#1C2924] text-[#E9F0CD]" />
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className={`p-4 rounded-lg cursor-pointer ${selectedOrderId === order._id ? "bg-[#1C2924]" : "bg-[#E9F0CD]/10"}`} onClick={() => onSelectOrder(order)}>
            <div className="flex justify-between">
              <span>Task #{order._id}</span>
              <span>{order.total.toFixed(2)}</span>
            </div>
            <div>Status: {order.status}</div>
            <div>Customer: {order.customerName}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderDetails: React.FC<{
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: string, userId: string) => void;
}> = ({ order, onUpdateStatus }) => {
  const statusOptions = ["Accepted", "Preparing", "Delivering", "Completed"];

  return (
    <div className="bg-[#1C2924] rounded-lg shadow-md p-4">
      <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
      <div className="mb-4">
        <h3 className="font-bold">Task info</h3>
        <div>Address: {order.locationData?.address}</div>
        <div>Phone: {order.phoneNumber}</div>
      </div>
      <div className="space-y-4 mb-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center">
            <img alt={item.title} src={item.image} className="w-16 h-16 object-cover rounded-md mr-4" />
            <div className="flex-1">
              <div className="flex justify-between">
                <span>{item.title}</span>
                <span>x{item.quantity}</span>
              </div>
            </div>
            <div>{(item.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div className="text-right text-xl font-bold mt-4">Total: {order.total.toFixed(2)}</div>
      <div className="mt-4 flex justify-between items-center">
        <span>Current Status: {order.status}</span>
        <div className="flex space-x-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => onUpdateStatus(order._id, status, order.userId)}
              className={`px-4 py-2 rounded-md ${order.status === status ? "bg-orange-500 text-[#E9F0CD]" : "bg-[#E9F0CD]/10 text-[#E9F0CD]"}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
