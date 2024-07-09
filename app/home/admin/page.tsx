// app/gome/admin/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Order {
  _id: string;
  createdAt: string;
  total: number;
  status: string;
  phoneNumber: string;
  customerName: string;
  items: Array<{
    title: string;
    price: number;
    image: string;
    quantity: number;
  }>;
  locationData?: {
    address: string;
    pincode: string;
  };
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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
      if (data.orders.length > 0) setSelectedOrder(data.orders[0]);
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
      setOrders((prevOrders) => prevOrders.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order)));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!session) return <p className="text-[#E9F0CD]">Access denied. Please log in as an admin.</p>;
  if (isLoading) return <p className="text-[#E9F0CD]">Loading...</p>;
  if (error) return <p className="text-[#E9F0CD]">Error: {error}</p>;

  return (
    <div className="flex bg-gradient-to-b from-[#1C3029]/30 from-10% via-[#171717] via-40% to-[#131313] to-50% text-[#E9F0CD] h-screen">
      <div className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex-1 p-4 overflow-auto">
        <h1 className="text-6xl font-bold mb-4">Task list</h1>

        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className={`bg-[#E9F0CD]/10 rounded-lg shadow-md p-4 cursor-pointer ${selectedOrder?._id === order._id ? "border-2 border-[#E9F0CD]" : ""}`}
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex justify-between">
                <span>Task #{order._id}</span>
                <span>{order.total.toFixed(2)}</span>
              </div>
              <div>Status: {order.status}</div>
            </div>
          ))}
        </div>

        {selectedOrder && (
          <div className="bg-[#1C2924] rounded-lg shadow-md p-4">
            <div className="mb-4">
              <h3 className="font-bold">Task info</h3>
              <div>Address: {selectedOrder.locationData?.address}</div>
              <div>Phone: {selectedOrder.phoneNumber}</div>
            </div>

            <div className="space-y-4">
              {selectedOrder.items.map((item, index) => (
                <div key={index} className="flex items-center">
                  <img alt={item.title} src={item.image} className="w-16 h-16 object-cover rounded-md mr-4" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span>x{item.quantity}</span>
                    </div>
                  </div>
                  <div>{(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="text-right text-xl font-bold mt-4">Total: {selectedOrder.total.toFixed(2)}</div>

            <div className="mt-4">
              <select value={selectedOrder.status} onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)} className="bg-[#1C2924] border border-[#E9F0CD] rounded px-2 py-1">
                <option value="Accepted">Accepted</option>
                <option value="Preparing">Preparing</option>
                <option value="Delivering">Delivering</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <button className="w-full bg-orange-500 text-[#E9F0CD] py-2 rounded-lg mt-4" onClick={() => updateOrderStatus(selectedOrder._id, "Accepted")}>
              Accept order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
