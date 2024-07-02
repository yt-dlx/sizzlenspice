// app/gome/admin/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";

interface Order {
  _id: string;
  createdAt: string;
  total: number;
  status: string;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data.orders);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update order status");

      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order))
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!session) return <p>Access denied. Please log in as an admin.</p>;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {orders.map((order: Order) => (
        <div
          key={order._id}
          className="bg-[#E9F0CD]/10 rounded-lg text-[#E9F0CD] shadow-md shadow-[#1C2924] font-Kurale p-4 mb-4"
        >
          <p>Order ID: {order._id}</p>
          <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
          <p>
            Total: <FaRupeeSign className="inline" />
            {order.total.toFixed(2)}
          </p>
          <p>Current Status: {order.status}</p>

          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn m-1">
              Click
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <a onClick={() => updateOrderStatus(order._id, "Accepted")}>Accepted</a>
              </li>
              <li>
                <a onClick={() => updateOrderStatus(order._id, "Delivering")}>Delivering</a>
              </li>
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
