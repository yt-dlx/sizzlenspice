// pages/store/cartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Item, CartItem } from "../../app/cart/initialCategories";

interface CartStore {
  cartItems: CartItem[];
  addToCart: (item: Item, plateSize: "small" | "medium" | "full") => void;
  removeFromCart: (item: CartItem) => void;
  incrementQuantity: (item: CartItem) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      addToCart: (item: Item, plateSize: "small" | "medium" | "full") => {
        set((state) => {
          const existingItem = state.cartItems.find((i) => i.title === item.title && i.plateSize === plateSize);
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((i) => (i.title === item.title && i.plateSize === plateSize ? { ...i, quantity: i.quantity + 1 } : i)),
            };
          } else {
            return {
              cartItems: [...state.cartItems, { ...item, plateSize, price: item.price[plateSize], quantity: 1 }],
            };
          }
        });
      },
      removeFromCart: (item: CartItem) => {
        console.log("Removing item:", item); // Add this line
        set((state) => {
          const newCartItems = state.cartItems
            .map((i) => {
              if (i.title === item.title && i.plateSize === item.plateSize) {
                return { ...i, quantity: Math.max(0, i.quantity - 1) };
              }
              return i;
            })
            .filter((i) => i.quantity > 0);
          console.log("New cart items:", newCartItems); // Add this line
          return { cartItems: newCartItems };
        });
      },
      incrementQuantity: (item: CartItem) => {
        set((state) => ({
          cartItems: state.cartItems.map((i) => (i.title === item.title && i.plateSize === item.plateSize ? { ...i, quantity: i.quantity + 1 } : i)),
        }));
      },
      clearCart: () => set({ cartItems: [] }),
      getTotalPrice: () => {
        return get().cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
