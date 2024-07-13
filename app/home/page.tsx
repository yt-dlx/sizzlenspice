// app/home/page.tsx
"use client";
import Link from "next/link";
import { MdClose } from "react-icons/md";
import { FoodItem } from "@/app/_src/types/cart";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useStore } from "@/app/_src/others/store";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaRupeeSign, FaSearch, FaMapMarkerAlt, FaMapPin, FaPhone, FaEnvelope } from "react-icons/fa";

export default function HomePage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [isContactInfoComplete, setIsContactInfoComplete] = useState(false);
  const { updateCartItemQuantity, setActiveCategory, setLocationData, removeFromCart, activeCategory, setSearchTerm, locationData, searchTerm, categories, addToCart, cart } = useStore();

  const totalCost = cart.reduce((total: number, item: any) => {
    const itemPrice = Number(item.price[item.selectedSize]);
    return total + (isNaN(itemPrice) ? 0 : itemPrice) * item.quantity;
  }, 0);

  useEffect(() => {
    let allItems: FoodItem[] = [];
    categories.forEach((category: any) => {
      if (category.title !== "All") allItems = [...allItems, ...category.items];
    });
    const categoryItems = activeCategory === "All" ? allItems : categories.find((cat: any) => cat.title === activeCategory)?.items || [];
    const filtered = categoryItems.filter((item: any) => item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredItems(filtered);
  }, [activeCategory, searchTerm, categories]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude.toString();
      const lon = position.coords.longitude.toString();
      setLocationData({ latitude: lat, longitude: lon });
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      if (response.ok) {
        const data = await response.json();
        if (data.address) {
          setLocationData({
            address: data.display_name || "",
            pincode: data.address.postcode || "",
          });
        }
      }
    });
  }, [setLocationData]);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch("/api/user");
      if (response.ok) {
        const data = await response.json();
        setPhoneNumber(data.phoneNumber || "");
        setCustomerEmail(data.customerEmail || "");
        setIsContactInfoComplete(!!data.phoneNumber && !!data.customerEmail);
      }
    };
    fetchUserData();
  }, []);

  const handleContactInfoChange = async (field: string, value: string) => {
    if (field === "phoneNumber") setPhoneNumber(value);
    else if (field === "customerEmail") setCustomerEmail(value);
    const response = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    if (response.ok) setIsContactInfoComplete(!!phoneNumber && !!customerEmail);
  };

  return (
    <main className="max-w-full mx-auto overflow-hidden bg-gradient-to-b from-[#1C3029]/30 from-10% via-[#171717] via-40% to-[#131313] to-50% p-4">
      {isModalOpen && selectedItem && (
        <AnimatePresence>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.1 } } }}
            className="fixed inset-0 bg-[#131313]/80 backdrop-blur-xl text-[#E9F0CD] shadow-2xl shadow-[#131313] flex items-center justify-center z-50"
          >
            <motion.div
              variants={{ hidden: { scale: 0, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { delay: 0.1, duration: 0.1, ease: "easeInOut" } } }}
              className="bg-[#1C3029]/60 backdrop-blur-xl rounded-3xl max-w-sm w-full border-4 border-double border-[#E9F0CD]/20"
            >
              <img src={selectedItem.image} alt={selectedItem.title} className="object-cover w-full h-60 rounded-t-3xl mb-4" />
              <div className="px-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${selectedItem.genre === "veg" ? "bg-lime-400" : "bg-red-600"}`} />
                    <h2 className="font-bold font-Playfair text-3xl">{selectedItem.title}</h2>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-sm">{selectedItem.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-sm mb-8 text-center font-Playfair">{selectedItem.description}</p>
                <p className="mb-2 text-center font-Kurale text-xl font-bold">Select Plate Size:</p>
                <div className="flex justify-center items-center text-center flex-col gap-2 mb-4">
                  {Object.entries(selectedItem.price).map(([size, price]) => {
                    const cartItem = cart.find((item) => item.title === selectedItem.title && item.selectedSize === size);
                    const quantity = cartItem ? cartItem.quantity : 0;
                    return (
                      <button
                        key={size}
                        onClick={() => addToCart({ ...selectedItem, selectedSize: size })}
                        className="flex w-full text-center items-center justify-center font-bold text-xs bg-[#E9F0CD] text-[#172B25] hover:bg-[#8C9A68] font-Kurale px-4 p-2 rounded-3xl transition duration-300 gap-1"
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)} : <FaRupeeSign />
                        {price} {quantity > 0 && `| Added: x${quantity}`}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-[#E9F0CD] text-[#172B25] hover:bg-[#8C9A68] py-2 mb-2 rounded-3xl mt-4 transition duration-300 font-Kurale font-bold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
      <section id="header" className="flex flex-col md:justify-center md:items-center sm:text-center text-[#E9F0CD] font-Playfair">
        <h1 className="text-8xl sm:text-9xl font-bold text-[#E9F0CD]">Sizzle 'n Spice</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2 font-Kurale">Where Every Bite Sizzles With Flavour and Love!</h2>
      </section>
      <section id="search-location" className="max-w-7xl mx-auto space-y-1 flex flex-col text-xs font-Kurale font-bold py-4">
        <div className="flex flex-col gap-1 w-full">
          <div className="relative w-full">
            <FaSearch size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#172B25]" />
            <input
              type="text"
              value={searchTerm}
              placeholder="Search dishes..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 rounded-lg bg-[#E9F0CD] border-2 border-[#131313] shadow-md shadow-[#131313] text-[#172B25] placeholder-[#172B25] focus:outline-none"
            />
          </div>
          <div className="flex flex-row gap-2 w-full">
            <div className="relative flex-grow">
              <FaMapMarkerAlt size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#172B25]" />
              <input
                type="text"
                value={locationData.address}
                onChange={(e) => setLocationData({ ...locationData, address: e.target.value })}
                placeholder="Fetching Address..."
                className="w-full py-2 pl-10 pr-4 truncate rounded-lg bg-[#E9F0CD] border-2 border-[#131313] shadow-md shadow-[#131313] text-[#172B25] placeholder-[#172B25] focus:outline-none"
              />
            </div>
            <div className="relative flex-grow">
              <FaMapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#172B25]" />
              <input
                type="text"
                value={locationData.pincode}
                onChange={(e) => setLocationData({ ...locationData, pincode: e.target.value })}
                placeholder="Fetching Pincode..."
                className="w-full py-2 pl-10 pr-4 rounded-lg bg-[#E9F0CD] border-2 border-[#131313] shadow-md shadow-[#131313] text-[#172B25] placeholder-[#172B25] focus:outline-none"
              />
            </div>
          </div>
          <div className="flex flex-row gap-2 w-full">
            <div className="relative flex-grow">
              <FaPhone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#172B25]" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => handleContactInfoChange("phoneNumber", e.target.value)}
                placeholder="Phone Number"
                className="w-full py-2 pl-10 pr-4 rounded-lg bg-[#E9F0CD] border-2 border-[#131313] shadow-md shadow-[#131313] text-[#172B25] placeholder-[#172B25] focus:outline-none"
              />
            </div>
            <div className="relative flex-grow">
              <FaEnvelope size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#172B25]" />
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => handleContactInfoChange("customerEmail", e.target.value)}
                placeholder="Email"
                className="w-full py-2 pl-10 pr-4 rounded-lg bg-[#E9F0CD] border-2 border-[#131313] shadow-md shadow-[#131313] text-[#172B25] placeholder-[#172B25] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="max-w-7xl flex items-center justify-center mx-auto py-2">
        <div className="flex scrollbar-thin scrollbar-thumb-[#E9F0CD] scrollbar-track-[#1C3029] overflow-x-auto space-x-2 pb-4">
          {categories.map((category: any, index: any) => (
            <button
              key={index}
              onClick={() => setActiveCategory(category.title)}
              className={`flex flex-col items-center shadow shadow-black p-1 rounded-lg w-24 text-[#172B25] ${activeCategory === category.title ? "bg-[#E9F0CD]/80" : "bg-[#E9F0CD]/20 text-[#E9F0CD]"}`}
            >
              <div className="w-20 h-20 rounded-lg shadow shadow-black flex items-center justify-center overflow-hidden">
                <img src={category.image} alt={category.title} className="object-cover w-full h-full rounded" />
              </div>
              <span className="text-sm font-bold font-Kurale mt-4">{category.title}</span>
            </button>
          ))}
        </div>
      </section>
      <section id="items" className="flex flex-col items-center justify-center max-w-2xl sm:max-w-4xl md:max-w-6xl lg:max-w-7xl mx-auto py-4">
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((item, index) => (
            <div key={index} className="flex flex-col rounded-lg shadow border-2 border-[#E9F0CD]/20 overflow-hidden h-full">
              <img src={item.image} alt={item.title} className="object-cover w-full h-48 border-b-2 border-[#1C2924]" />
              <div className="text-[#E9F0CD] flex flex-col justify-between rounded-b m-0.5 py-2 bg-[#2B4B40]/40 flex-grow p-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${item.genre === "veg" ? "bg-lime-400" : "bg-red-600"}`} />
                    <h2 className="font-bold font-Kurale text-lg">{item.title}</h2>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400 animate-spin text-xl">★</span>
                    <span className="ml-1 text-sm">{item.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-sm mt-2 font-Playfair">{item.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold font-Kurale items-center inline-flex">
                    <FaRupeeSign />
                    {item.forTwo} for Two
                  </span>
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setIsModalOpen(true);
                    }}
                    className="bg-[#E9F0CD] text-[#172B25] px-3 py-1 rounded-l-3xl shadow shadow-[#172B25] text-sm font-bold font-Kurale hover:bg-[#A8B67C] transition duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* =========================================================================================== */}
      {cart.length > 0 && !isCartOpen && (
        <section id="cart-button" className="fixed bottom-14 right-2">
          <button onClick={() => setIsCartOpen(!isCartOpen)} className="bg-[#E9F0CD] text-[#172B25] p-2 rounded-lg shadow shadow-[#131313] flex items-center">
            <FaShoppingCart size={20} />
            <span className="ml-2 font-bold inline-flex items-center">
              Total Items - {cart.reduce((total: any, item: any) => total + item.quantity, 0)} | <FaRupeeSign />
              {totalCost.toFixed(2)}
            </span>
          </button>
        </section>
      )}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            exit={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            className="fixed bottom-0 right-0 w-full sm:w-96 bg-[#131313]/60 backdrop-blur-2xl border-2 border-[#E9F0CD]/20 text-[#E9F0CD] rounded-t-2xl shadow-lg flex justify-center max-h-[50vh]"
          >
            <div className="p-4 w-full overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-7xl font-Playfair font-bold">Cart</h2>
                <button onClick={() => setIsCartOpen(false)}>
                  <MdClose size={24} className="text-[#1C3029] bg-[#E9F0CD] rounded-full font-bold animate-spin" />
                </button>
              </div>
              {cart.map((item: any, index: any) => (
                <div key={index} className="flex items-center justify-between mb-4">
                  <div className="flex items-center font-Kurale">
                    <img src={item.image} alt={item.title} className="rounded-full object-cover w-12 h-12 mr-2" />
                    <div>
                      <h3 className="font-bold font-Kurale">{item.title}</h3>
                      <p className="text-sm">{item.selectedSize} plate</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateCartItemQuantity(item.title, item.selectedSize, item.quantity - 1)}
                      className="text-sm bg-[#E9F0CD]/60 hover:bg-[#E9F0CD] text-[#1C3029] font-Kurale p-1 rounded-full transition duration-300"
                    >
                      <FaMinus />
                    </button>
                    <span className="font-Playfair font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateCartItemQuantity(item.title, item.selectedSize, item.quantity + 1)}
                      className="text-sm bg-[#E9F0CD]/60 hover:bg-[#E9F0CD] text-[#1C3029] font-Kurale p-1 rounded-full transition duration-300"
                    >
                      <FaPlus />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.title, item.selectedSize)}
                      className="text-sm bg-red-700 hover:bg-red-500 text-[#1C3029] font-Kurale p-1 rounded-full transition duration-300"
                    >
                      <MdClose size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <div className="border-t">
                <div className="flex gap-2 justify-center items-center font-bold font-Kurale mt-8 p-2">
                  <span>Total Items:</span>
                  <span>{cart.reduce((total: any, item: any) => total + item.quantity, 0)}</span>
                  <span className="font-Brittany"> | </span>
                  <span>Total Cost:</span>
                  <span className="inline-flex items-center">
                    <FaRupeeSign size={16} />
                    {totalCost.toFixed(2)}
                  </span>
                </div>
                <Link
                  href="/home/cart"
                  className="w-full mt-2 px-4 py-2 transition duration-700 ease-in-out transform rounded-3xl bg-[#E9F0CD] hover:bg-[#8C9A68]/60 text-[#172B25] hover:text-[#E9F0CD] flex items-center justify-center gap-2 font-bold font-Kurale"
                >
                  Proceed To Checkout
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
