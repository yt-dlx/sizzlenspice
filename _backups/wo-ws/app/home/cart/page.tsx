// app/home/cart/page.tsx
"use client";
import Link from "next/link";
import { LuBike } from "react-icons/lu";
import { MdFastfood } from "react-icons/md";
import { useSession } from "next-auth/react";
import { GiDeliveryDrone } from "react-icons/gi";
import { useStore } from "@/app/_src/others/store";
import React, { useEffect, useState } from "react";
import { FaRupeeSign, FaPlus, FaMinus, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Home() {
  const { data: session } = useSession();
  const [showGif, setShowGif] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [prevOrders, setPreviousOrders] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [LatestOrderID, setLatestOrderId] = useState<string | null>(null);
  const [cancelTimeRemaining, setCancelTimeRemaining] = useState<number | null>(null);
  const [visualizedOrders, setVisualizedOrders] = useState<{ [key: string]: boolean }>({});
  const { cart, removeFromCart, updateCartItemQuantity, clearCart, getCartTotal, locationData } = useStore();

  async function fetchPreviousOrders(userId: string) {
    const response = await fetch("/api/orders?userId=" + userId);
    if (!response.ok) setError("Failed to fetch order!");
    const data = await response.json();
    return data.orders;
  }

  async function cancelOrder(orderId: string) {
    const response = await fetch("/api/orders?orderId=" + orderId, {
      method: "DELETE",
    });
    if (!response.ok) setError("Failed to cancle order!");
    return await response.json();
  }

  const TggleVisualize = (orderId: string) => setVisualizedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));

  useEffect(() => {
    const storedOrderId = localStorage.getItem("LatestOrderID");
    const storedOrderTime = localStorage.getItem("OrderPlacedTime");
    if (storedOrderId && storedOrderTime) {
      const orderTime = parseInt(storedOrderTime, 10);
      const currentTime = Date.now();
      const elapsedTime = Math.floor((currentTime - orderTime) / 1000);
      if (elapsedTime < 60) {
        setLatestOrderId(storedOrderId);
        setCancelTimeRemaining(60 - elapsedTime);
      } else {
        localStorage.removeItem("LatestOrderID");
        localStorage.removeItem("OrderPlacedTime");
      }
    }
    if (session?.user?.email) fetchPreviousOrders(session.user.email).then((orders) => setPreviousOrders(orders));
    if (showGif) {
      const timer = setTimeout(() => {
        setShowGif(false);
        window.location.reload();
      }, 4000);
      return () => clearTimeout(timer);
    }
    if (cancelTimeRemaining !== null && cancelTimeRemaining > 0) {
      const timer = setInterval(() => {
        setCancelTimeRemaining((prev) => {
          if (prev !== null && prev > 1) return prev - 1;
          else {
            clearInterval(timer);
            localStorage.removeItem("LatestOrderID");
            localStorage.removeItem("OrderPlacedTime");
            return null;
          }
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [session, showGif, cancelTimeRemaining]);

  const CancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      const updatedOrders = await fetchPreviousOrders(session?.user?.email || "");
      setPreviousOrders(updatedOrders);
      if (orderId === LatestOrderID) {
        setLatestOrderId(null);
        setCancelTimeRemaining(null);
        localStorage.removeItem("LatestOrderID");
        localStorage.removeItem("OrderPlacedTime");
      }
      alert("Order cancelled successfully");
    } catch {
      alert("Failed to cancel order!");
    }
  };

  const PlaceOrder = async () => {
    try {
      setError(null);
      setShowGif(true);
      setIsLoading(true);
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          locationData,
          totalAmount: getCartTotal(),
          userId: session?.user?.email,
        }),
      });
      if (!response.ok) setError("Failed to place order!");
      const { orderId } = await response.json();
      setLatestOrderId(orderId);
      localStorage.setItem("LatestOrderID", orderId);
      localStorage.setItem("OrderPlacedTime", Date.now().toString());
      setCancelTimeRemaining(60);
      setOrderPlaced(true);
      clearCart();
    } catch {
      setError("Failed to place order!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-full mx-auto overflow-hidden bg-gradient-to-b from-[#1C3029]/30 from-10% via-[#171717] via-40% to-[#131313] to-50% p-4">
      {showGif && (
        <section className="fixed inset-0 flex flex-col items-center justify-center bg-[#131313]/60 backdrop-blur-2xl z-50">
          <img src="/Moto.gif" alt="Moto" className="object-contain h-72 sm:h-80 lg:h-96" />
          <p className="mb-4 text-4xl md:text-8xl text-[#E9F0CD]">
            Order Placed,
            <br /> <span className="font-Lora_SemiBoldItalic">{session?.user?.name}</span>!
          </p>
          <ul className="text-lg md:xl text-[#E9F0CD] p-8 list-disc font-Lora_SemiBoldItalic">
            <li>Thank you for ordering!</li>
            <li>Auto Closing in 4s.</li>
          </ul>
        </section>
      )}

      <section id="header" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col md:justify-center md:items-center sm:text-center text-[#E9F0CD] font-Playfair">
        <h1 className="text-8xl sm:text-9xl font-bold text-[#E9F0CD]">Order Summary</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2 font-Kurale">
          Here's a summary of your order, {session?.user?.name}! <br />
          Review it and make changes if required!
        </h2>
        <img src="/checkout.gif" className="mx-auto object-cover h-80 sm:h-96 lg:h-112 hue-rotate-90" />
      </section>

      {getCartTotal() > 0 && (
        <section id="order-total" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto">
          <h3 className="text-3xl font-Kurale font-bold text-[#E9F0CD]">
            Total: <FaRupeeSign className="inline" />
            {getCartTotal().toFixed(2)}
          </h3>
        </section>
      )}

      <section id="cart-items" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto mt-2 mb-8">
        {cart.map((item: any, index: number) => (
          <div key={index} className="flex items-center justify-between mb-4 bg-[#E9F0CD]/10 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <img alt={item.title} src={item.image} className="object-cover w-14 h-14 rounded-full shadow shadow-[#131313] border-2 border-[#131313]" />
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

      {!orderPlaced ? (
        cart.length > 0 ? (
          <section className="flex items-center justify-center">
            <section className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col m-2 bg-[#E9F0CD]/10 p-4 rounded-lg text-[#E9F0CD] shadow-md shadow-[#1C2924]">
              <span className="flex items-center justify-center gap-2 text-xl font-bold font-Kurale xl:text-6xl">
                <GiDeliveryDrone size={80} className="animate-pulse text-[#E9F0CD]" />
                Confirm Your Culinary Journey and Place Your Orders
              </span>
              <div className="mt-2 space-y-2">
                <button
                  disabled={isLoading}
                  onClick={PlaceOrder}
                  className="w-full px-4 py-2 transition duration-700 ease-in-out transform rounded-full bg-[#E9F0CD] hover:bg-[#A8B67C] text-[#172B25] flex items-center justify-center gap-2 font-Kurale font-bold"
                >
                  <LuBike size={25} /> {isLoading ? "Processing..." : "Confirm Order!"}
                </button>
                <Link
                  href={"/home"}
                  className="w-full px-4 py-2 transition duration-700 ease-in-out transform rounded-full bg-[#E9F0CD] hover:bg-[#A8B67C] text-[#172B25] flex items-center justify-center gap-2 font-Kurale font-bold"
                >
                  <MdFastfood size={20} /> No, I want to add more!
                </Link>
              </div>
              {error && <p className="mt-2 text-red-500">{error}</p>}
            </section>
          </section>
        ) : (
          <section className="flex items-center justify-center">
            <section className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col m-2 bg-[#E9F0CD]/10 p-4 rounded-lg text-[#E9F0CD] shadow-md shadow-[#1C2924]">
              <span className="flex items-center justify-center gap-2 text-xl font-bold font-Kurale xl:text-6xl">
                <GiDeliveryDrone size={80} className="animate-pulse text-[#E9F0CD]" />
                Your Cart is Empty! Let's Fill it up.
              </span>
              <div className="mt-2 space-y-2">
                <Link
                  href={"/home"}
                  className="w-full px-4 py-2 transition duration-700 ease-in-out transform rounded-full bg-[#E9F0CD] hover:bg-[#A8B67C] text-[#172B25] flex items-center justify-center gap-2 font-Kurale font-bold"
                >
                  <MdFastfood size={20} /> Go To Food Items
                </Link>
              </div>
              {error && <p className="mt-2 text-red-500">{error}</p>}
            </section>
          </section>
        )
      ) : null}

      {cancelTimeRemaining !== null && (
        <section id="cancel-order" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto mt-8 text-center items-center justify-center font-Kurale font-bold">
          <p className="text-[#E9F0CD]">You can cancel your order within the next {cancelTimeRemaining} seconds.</p>
          <button onClick={() => CancelOrder(LatestOrderID!)} className="bg-red-500 text-[#E9F0CD] px-4 py-2 rounded mt-2">
            Cancel Order
          </button>
        </section>
      )}

      {prevOrders && prevOrders.length > 0 && (
        <section id="previous-orders" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto mt-8 text-[#E9F0CD]">
          <h3 className="text-4xl font-bold mb-4">Orders</h3>
          {prevOrders
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((order: any, index: number) => (
              <div key={index} className="bg-[#E9F0CD]/10 p-4 rounded-lg mb-4 font-bold font-Kurale">
                <div className="flex justify-between items-center">
                  <p>
                    Order ID: <span className="font-light text-xs">{order._id}</span>{" "}
                  </p>
                  <button onClick={() => TggleVisualize(order._id)} className="bg-[#E9F0CD] text-[#172B25] px-3 py-1 rounded-full flex items-center font-bold text-xs">
                    {visualizedOrders[order._id] ? (
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
                <p>
                  Date: <span className="font-light text-xs">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</span>
                </p>
                <p>
                  Total: <span className="font-light text-xs">{typeof order.total === "number" ? order.total.toFixed(2) : "N/A"}</span>
                </p>
                <p>
                  Items: <span className="font-light text-xs">{order.items && order.items.length > 0 ? order.items.length : "No items"}</span>
                </p>
                <p>
                  Status: <span className="font-light text-xs">{order.status}</span>
                </p>
                {visualizedOrders[order._id] && order.items && order.items.length > 0 && (
                  <div className="mt-4">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#E9F0CD]/30">
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
                            <tr key={itemIndex} className="border-b border-[#E9F0CD]/10">
                              <td className="p-2 font-light">{item.title}</td>
                              <td className="p-2 font-light">
                                {item.selectedSize} x{quantity}
                              </td>
                              <td className="text-right p-2 font-light">{price.toFixed(2)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="font-bold">
                          <td colSpan={2} className="text-right p-2">
                            Total:
                          </td>
                          <td className="text-right p-2 inline-flex items-center">
                            <FaRupeeSign className="inline mr-1" />
                            {typeof order.total === "number" ? order.total.toFixed(2) : (parseFloat(order.total) || 0).toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
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