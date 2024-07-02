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
  locationData?: {
    latitude: string;
    longitude: string;
    address: string;
    pincode: string;
  };
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
      const response = await fetch("/api/orders");
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
      const response = await fetch("/api/orders", {
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
          <ul className="list-none">
            <li>Order ID: {order._id}</li>
            <li>Date: {new Date(order.createdAt).toLocaleString()}</li>
            <li>
              Total: <FaRupeeSign className="inline" />
              {order.total.toFixed(2)}
            </li>
            <li>Current Status: {order.status}</li>
          </ul>

          {order.locationData && (
            <div className="mt-2">
              <h3 className="font-bold">Delivery Location:</h3>
              <ul className="list-none">
                <li>Address: {order.locationData.address}</li>
                <li>Pincode: {order.locationData.pincode}</li>
                <li>Latitude: {order.locationData.latitude}</li>
                <li>Longitude: {order.locationData.longitude}</li>
              </ul>
            </div>
          )}

          <div className="dropdown mt-2">
            <div tabIndex={0} role="button" className="btn m-1">
              Update Status
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
