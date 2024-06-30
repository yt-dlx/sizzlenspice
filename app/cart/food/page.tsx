// app/client/page.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import initialCategories from "../data";
import { SiHandlebarsdotjs } from "react-icons/si";
import Navbar from "@/app/_utils/_components/Navbar";
import Footer from "@/app/_utils/_components/Footer";
import type { Item, CartItem, Category } from "../data";
import React, { useEffect, useRef, useState } from "react";
import { useCart } from "../../_utils/_context/CartContext";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { FaPlus, FaMinus, FaRupeeSign, FaShoppingCart, FaTimes } from "react-icons/fa";

export default function Cart() {
  const cartRef = useRef<HTMLDivElement>(null);
  const { cartItems, setCartItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const CategoryClick = (n: number) => setCategories(categories.map((category, i) => ({ ...category, active: i === n })));
  const Active = categories.find((category) => category.active);

  const addToCart = (item: Item, plateSize: "small" | "medium" | "full") => {
    const existingItem = cartItems.find((i) => i.title === item.title && i.plateSize === plateSize);
    if (existingItem) {
      setCartItems(cartItems.map((i) => (i.title === item.title && i.plateSize === plateSize ? { ...i, quantity: i.quantity + 1 } : i)));
    } else setCartItems([...cartItems, { ...item, plateSize, price: item.price[plateSize], quantity: 1 }]);
  };

  const removeFromCart = (item: CartItem) => {
    const existingItem = cartItems.find((i) => i.title === item.title && i.plateSize === item.plateSize);
    if (existingItem) {
      if (existingItem.quantity > 1) {
        setCartItems(cartItems.map((i) => (i.title === item.title && i.plateSize === item.plateSize ? { ...i, quantity: i.quantity - 1 } : i)));
      } else setCartItems(cartItems.filter((i) => !(i.title === item.title && i.plateSize === item.plateSize)));
    }
  };

  const TotalCartPrice = cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0).toFixed(2);
  const y = useMotionValue(0);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) setIsCartOpen(false);
    }
    function handleScrollOutside() {
      setIsCartOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("scroll", handleScrollOutside);
    window.addEventListener("touchmove", handleScrollOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScrollOutside);
      window.removeEventListener("touchmove", handleScrollOutside);
    };
  }, []);

  return (
    <React.Fragment>
      <Navbar />
      <section className="mx-auto overflow-hidden bg-[#FFF4E9] max-w-6xl p-2 m-2">
        <section className="flex flex-col items-center">
          <h1 className="text-7xl sm:text-8xl font-Lora_BoldItalic mb-4 text-[#172B25]">Food Categories</h1>
          <ul className="grid grid-cols-4 sm:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <li
                key={index}
                onClick={() => CategoryClick(index)}
                className={`p-2 items-center justify-center flex flex-col rounded-3xl text-sm shadow-md cursor-pointer font-Lora_SemiBoldItalic bg-[#172B25] text-[#FFF4E9] shadow-[#172B25]  ${category.active ? "scale-115" : "sclae-95"}`}
              >
                <Image
                  width={80}
                  height={80}
                  unoptimized
                  src={category.image}
                  alt={category.title}
                  className={`w-20 h-20 object-cover rounded-full border-2 ${category.active ? "border-[#FFF4E9]" : "border-[#172B25]"}`}
                />
                <p className="flex flex-col justify-center mt-2 text-center">{category.title}</p>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="flex items-center justify-center gap-2 mt-8 mb-4 text-2xl font-Lora_MediumItalic">
            <FaShoppingCart /> Found <span className="text-4xl font-Lora_MediumItalic">{Active ? Active.items.length : 0}</span> results
          </h2>
          {Active && Active.items.length === 0 ? (
            <div className="flex items-center justify-center w-full h-full">
              <Image src="/cooking.png" width={1080} height={720} alt="Cooking" />
            </div>
          ) : (
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 ${Active?.items.length === 0 ? "h-screen" : ""}`}>
              {Active &&
                Active.items.map((item, index) => (
                  <section
                    key={index}
                    className="flex flex-col rounded-3xl shadow-md hover:shadow-[#172B25] border-4 border-[#172B25] overflow-hidden transition-all duration-500 hover:-translate-y-1 relative"
                  >
                    <Image width={1080} height={720} alt={item.title} src={item.image} className="w-full h-48 object-cover border-b-8 border-double border-[#172B25]" />
                    <div className="flex flex-col justify-center p-2 bg-[#172B25] text-[#FFF4E9] flex-grow">
                      <h2 className="flex items-center justify-center gap-2 text-3xl font-Lora_BoldItalic">
                        <SiHandlebarsdotjs className={`${item.genre === "non-veg" ? "text-red-600" : "text-lime-400"} animate-pulse`} /> {item.title}
                      </h2>
                      <p className="m-6 font-Lora_MediumItalic text-center">{item.description}</p>
                      <div className="inline-flex items-center justify-center -mb-1">
                        <span className="inline-flex items-center justify-center h-8 px-5 text-xs text-[#FFF4E9] shadow-md shadow-[Y172B25] transition duration-500 whitespace-nowrap bg-[#468353] hover:bg-[#27493F] focus-visible:outline-none rounded-l-3xl">
                          <button
                            onClick={() => {
                              addToCart(item, "small");
                              setIsCartOpen(true);
                            }}
                            className="flex items-center justify-center"
                          >
                            <FaRupeeSign size={10} /> Small {item.price.small}
                          </button>
                        </span>
                        <span className="inline-flex items-center justify-center h-8 px-5 text-xs font-Grenoble text-[#FFF4E9] shadow-md shadow-[Y172B25] transition duration-500 whitespace-nowrap bg-[#468353] hover:bg-[#27493F] focus-visible:outline-none">
                          <button
                            onClick={() => {
                              addToCart(item, "medium");
                              setIsCartOpen(true);
                            }}
                            className="flex items-center justify-center"
                          >
                            <FaRupeeSign size={10} /> Medium {item.price.medium}
                          </button>
                        </span>
                        <span className="inline-flex items-center justify-center h-8 px-5 text-xs font-Grenoble text-[#FFF4E9] shadow-md shadow-[Y172B25] transition duration-500 whitespace-nowrap bg-[#468353] hover:bg-[#27493F] focus-visible:outline-none rounded-r-3xl">
                          <button
                            onClick={() => {
                              addToCart(item, "full");
                              setIsCartOpen(true);
                            }}
                            className="flex items-center justify-center"
                          >
                            <FaRupeeSign size={10} /> Full {item.price.full}
                          </button>
                        </span>
                      </div>
                    </div>
                  </section>
                ))}
            </div>
          )}
        </section>
        <motion.section
          ref={cartRef}
          className="fixed bottom-0 left-0 right-0 bg-[#172B25]/80 backdrop-blur-lg text-[#FFF4E9] rounded-t-3xl border-[#FFF4E9] border-2 p-4 shadow-md"
          initial="closed"
          animate={isCartOpen ? "open" : "closed"}
          variants={{
            open: { y: 0 },
            closed: { y: "100%" },
          }}
          style={{ y, opacity: useTransform(y, [-100, 0], [0, 1]) }}
        >
          <aside className="overflow-y-auto max-h-[80vh] relative">
            <button
              className="absolute top-2 right-2 bg-[#FFF4E9] text-[#172B25] rounded-full p-2 shadow-lg flex items-center justify-center cursor-pointer hover:scale-110"
              onClick={() => setIsCartOpen(false)}
            >
              <FaTimes size={20} />
            </button>
            <p className="m-2 text-6xl underline font-Lora_BoldItalic">Cart</p>
            <ul>
              {cartItems.map((item: any, index: number) => (
                <li key={index} className="flex justify-between items-center font-Grenoble p-2 border-b border-[#FFF4E9]">
                  <span>
                    {item.title} ({item.plateSize})
                  </span>
                  <div className="flex items-center">
                    <button onClick={() => removeFromCart(item)} className="bg-[#FFF4E9] text-[#172B25] rounded-full p-1 mr-2 hover:bg-[#172B25] hover:text-[#FFF4E9]">
                      <FaMinus size={12} />
                    </button>
                    <span>x{item.quantity}</span>
                    <button onClick={() => addToCart(item, item.plateSize)} className="bg-[#FFF4E9] text-[#172B25] rounded-full p-1 ml-2 hover:bg-[#172B25] hover:text-[#FFF4E9]">
                      <FaPlus size={12} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <p className="m-4 font-Lora_BoldItalic flex items-center justify-center text-center">
              <FaRupeeSign /> Total: {TotalCartPrice}
            </p>
          </aside>
          {cartItems && cartItems.length > 0 && (
            <Link
              href="/cart/checkout"
              className="inline-flex items-center justify-center w-full p-1 text-lg font-Grenoble text-[#172B25] transition duration-500 whitespace-nowrap bg-[#C4BCB4] hover:bg-[#FFF4E9] focus-visible:outline-none rounded-3xl"
            >
              Proceed To Checkout
            </Link>
          )}
        </motion.section>
        {!isCartOpen && (
          <button
            className="fixed bottom-4 right-4 bg-[#FFF4E9] hover:bg-[#172B25] text-[#172B25] hover:text-[#FFF4E9] rounded-full p-4 shadow-lg flex items-center justify-center cursor-pointer border-[#172B25] hover:border-[#FFF4E9] border-4"
            onClick={() => setIsCartOpen(true)}
          >
            <FaShoppingCart size={24} />
          </button>
        )}
      </section>
      <Footer />
    </React.Fragment>
  );
}
