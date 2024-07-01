// app/utils/context/CartContext.tsx
"use client";
import { CartItem } from "../../cart/data";
import React, { createContext, useContext, useState } from "react";

interface LocationData {
  address: string;
  pincode: string;
  latitude: string | null;
  longitude: string | null;
}

interface CartContextType {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  clearCart: () => void;
  locationData: LocationData;
  setLocationData: React.Dispatch<React.SetStateAction<LocationData>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [locationData, setLocationData] = useState<LocationData>({
    address: "",
    pincode: "",
    latitude: null,
    longitude: null,
  });
  const clearCart = () => setCartItems([]);

  return <CartContext.Provider value={{ cartItems, setCartItems, clearCart, locationData, setLocationData }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
