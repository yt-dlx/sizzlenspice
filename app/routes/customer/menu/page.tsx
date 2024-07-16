// app/routes/customer/menu/page.tsx
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Loading from "./loading";
import { MdClose } from "react-icons/md";
import { FoodItem } from "@/app/_src/types/cart";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useStore } from "@/app/_src/others/store";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaRupeeSign, FaSearch } from "react-icons/fa";

export default function HomePage() {
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [filteredItems, setFilteredItems] = React.useState<FoodItem[]>([]);
  const [selectedItem, setSelectedItem] = React.useState<FoodItem | null>(null);
  const { updateCartItemQuantity, setActiveCategory, removeFromCart, activeCategory, setSearchTerm, searchTerm, categories, addToCart, cart } = useStore();

  const totalCost = cart.reduce((total: any, item: any) => {
    const itemPrice = Number(item.price[item.selectedSize]);
    return total + (isNaN(itemPrice) ? 0 : itemPrice) * item.quantity;
  }, 0);

  React.useEffect(() => {
    try {
      let allItems: FoodItem[] = [];
      categories.forEach((category: any) => {
        if (category.title !== "All") allItems = [...allItems, ...category.items];
      });
      const categoryItems = activeCategory === "All" ? allItems : categories.find((cat: any) => cat.title === activeCategory)?.items || [];
      const filtered = categoryItems.filter((item: any) => item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredItems(filtered);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchTerm, categories]);

  if (loading) return <Loading />;
  if (error) throw new Error(error);

  return (
    <main className="max-w-full mx-auto overflow-hidden bg-gradient-to-b bg-primary p-4">
      <AnimatePresence>
        {isModalOpen && selectedItem && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            exit={{ opacity: 0, y: "100%", transition: { duration: 0.2 } }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
            className="fixed bottom-0 left-0 right-0 w-full max-w-4xl mx-auto bg-secondary/60 backdrop-blur-2xl border-4 border-double border-secondary text-primary rounded-t-2xl flex justify-center max-h-[80vh] z-50"
          >
            <div className="p-4 w-full overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-4xl font-Playfair font-bold">{selectedItem.title}</h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <MdClose size={24} className="text-primary bg-secondary rounded-2xl font-bold animate-spin" />
                </button>
              </div>
              <div className="flex items-center mb-4">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-4 h-4 rounded-2xl ${selectedItem.genre === "veg" ? "bg-lime-400" : "bg-red-600"}`} />
                    <span className="font-bold font-Kurale">{selectedItem.genre === "veg" ? "Vegetarian" : "Non-Vegetarian"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="font-bold">{selectedItem.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm mb-4 font-Playfair">{selectedItem.description}</p>
              <p className="mb-2 font-Kurale text-xl font-bold">Select Plate Size:</p>
              <div className="space-y-2">
                {Object.entries(selectedItem.price).map(([size, price]) => {
                  const cartItem = cart.find((item) => item.title === selectedItem.title && item.selectedSize === size);
                  const quantity = cartItem ? cartItem.quantity : 0;
                  return (
                    <div key={size} className="flex items-center justify-between">
                      <span className="font-Kurale">{size.charAt(0).toUpperCase() + size.slice(1)}</span>
                      <div className="flex items-center">
                        <span className="font-bold mr-2 inline-flex items-center">
                          <FaRupeeSign size={12} />
                          {price}
                        </span>
                        {quantity > 0 ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartItemQuantity(selectedItem.title, size, quantity - 1)}
                              className="text-sm bg-primary hover:bg-tertiary text-secondary font-Kurale p-1 rounded-2xl transition duration-300"
                            >
                              <FaMinus />
                            </button>
                            <span className="inline-flex text-lg">{quantity}</span>
                            <button
                              onClick={() => updateCartItemQuantity(selectedItem.title, size, quantity + 1)}
                              className="text-sm bg-primary hover:bg-tertiary text-secondary font-Kurale p-1 rounded-2xl transition duration-300"
                            >
                              <FaPlus />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart({ ...selectedItem, selectedSize: size })}
                            className="px-3 py-1 rounded-2xl text-sm font-bold font-Kurale bg-primary hover:bg-tertiary text-secondary transition duration-300"
                          >
                            Add To Cart
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ======================================================================================================================================================================= */}
      <section id="header" className="flex flex-col md:justify-center md:items-center sm:text-center text-secondary font-Playfair">
        <h1 className="text-7xl sm:text-9xl font-bold text-secondary">Sizzle 'n Spice</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2 font-Kurale">Where Every Bite Sizzles With Flavour and Love!</h2>
      </section>
      {/* ======================================================================================================================================================================= */}
      <section id="search-location" className="max-w-7xl mx-auto space-y-1 flex flex-col text-xs font-Kurale font-bold py-4">
        <div className="flex flex-col gap-1 w-full">
          <div className="relative w-full">
            <FaSearch size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
            <input
              type="text"
              value={searchTerm}
              placeholder="Search dishes..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 block w-full rounded-2xl border-secondary bg-secondary placeholder:font-RobotoCondensed placeholder:text-sm text-primary focus:border-secondary focus:ring-secondary"
            />
          </div>
        </div>
      </section>
      {/* ======================================================================================================================================================================= */}
      <section id="categories" className="max-w-7xl flex items-center justify-center mx-auto py-2">
        <div className="flex scrollbar-thin scrollbar-thumb-secondary scrollbar-track-primary overflow-x-auto space-x-2 pb-4">
          {categories.map((category: any, index: any) => (
            <button
              key={index}
              onClick={() => setActiveCategory(category.title)}
              className={`flex flex-col items-center p-1 rounded-2xl w-24 text-primary ${activeCategory === category.title ? "bg-secondary/80" : "bg-secondary/20 text-secondary"}`}
            >
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden">
                <Image width={540} height={540} src={category.image} alt={category.title} className="object-cover w-full h-full" />
              </div>
              <span className="text-sm font-bold font-Kurale mt-4">{category.title}</span>
            </button>
          ))}
        </div>
      </section>
      {/* ======================================================================================================================================================================= */}
      <section id="items" className="flex flex-col items-center justify-center max-w-2xl sm:max-w-4xl md:max-w-6xl lg:max-w-7xl mx-auto py-4">
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((item, index) => (
            <div key={index} className="flex flex-col rounded-2xl overflow-hidden h-full">
              <Image width={540} height={540} src={item.image} alt={item.title} className="object-cover w-full h-48" />
              <div className="text-primary flex flex-col justify-between rounded-b-2xl bg-secondary flex-grow p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-2xl ${item.genre === "veg" ? "bg-lime-400" : "bg-red-600"}`} />
                    <h2 className="font-bold font-Kurale text-lg">{item.title}</h2>
                  </div>
                  <div className="inline-flex items-center justify-center">
                    <span className="text-yellow-400 gap-1 text-sm font-bold font-RobotoCondensed flex items-center">
                      <span className="animate-pulse">★</span> {item.rating.toFixed(1)}
                    </span>
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
                    className="px-3 py-1 rounded-2xl text-sm font-bold font-Kurale bg-primary hover:bg-tertiary text-secondary transition duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* ======================================================================================================================================================================= */}
      {cart.length > 0 && !isCartOpen && (
        <section id="cart-button" className="fixed bottom-14 right-2 z-30">
          <button onClick={() => setIsCartOpen(!isCartOpen)} className="bg-secondary text-primary p-2 rounded-2xl flex items-center">
            <FaShoppingCart size={20} />
            <span className="ml-2 font-bold inline-flex items-center">
              Total Items - {cart.reduce((total: any, item: any) => total + item.quantity, 0)} | <FaRupeeSign />
              {totalCost.toFixed(2)}
            </span>
          </button>
        </section>
      )}
      {/* ======================================================================================================================================================================= */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            exit={{ opacity: 0, y: 50, transition: { duration: 0.2 } }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
            className="fixed bottom-0 right-0 w-full sm:w-96 bg-secondary/60 backdrop-blur-2xl border-4 border-double border-secondary text-primary rounded-t-2xl flex justify-center max-h-[50vh] z-40"
          >
            <div className="p-4 w-full overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-7xl font-Playfair font-bold">Cart</h2>
                <button onClick={() => setIsCartOpen(false)}>
                  <MdClose size={24} className="text-primary bg-secondary rounded-2xl font-bold animate-spin" />
                </button>
              </div>
              {cart.map((item: any, index: any) => (
                <div key={index} className="flex items-center justify-between mb-4">
                  <div className="flex items-center font-Kurale">
                    <Image width={540} height={540} src={item.image} alt={item.title} className="rounded-2xl object-cover w-12 h-12 mr-2" />
                    <div>
                      <h3 className="font-bold font-Kurale">{item.title}</h3>
                      <p className="text-sm">{item.selectedSize} plate</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateCartItemQuantity(item.title, item.selectedSize, item.quantity - 1)}
                      className="text-sm bg-primary hover:bg-tertiary text-secondary font-Kurale p-1 rounded-2xl transition duration-300"
                    >
                      <FaMinus />
                    </button>
                    <span className="inline-flex text-lg">{item.quantity}</span>
                    <button
                      onClick={() => updateCartItemQuantity(item.title, item.selectedSize, item.quantity + 1)}
                      className="text-sm bg-primary hover:bg-tertiary text-secondary font-Kurale p-1 rounded-2xl transition duration-300"
                    >
                      <FaPlus />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.title, item.selectedSize)}
                      className="text-sm bg-red-700 hover:bg-red-800 text-primary font-Kurale p-1 rounded-2xl transition duration-300"
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
                  href="/routes/customer/checkout"
                  className="w-full mt-2 px-4 py-2 transition duration-700 ease-in-out transform rounded-2xl bg-primary hover:bg-tertiary text-secondary flex items-center justify-center gap-2 font-bold font-Kurale"
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
