// app/_assets/others/store.ts
import { create } from "zustand";
import initialCategories from "./initialCategories";
import { StoreState, FoodItem, Price } from "../types/cart";

export const useStore = create<StoreState>((set, get) => ({
  cart: [],
  searchTerm: "",
  activeCategory: "All",
  categories: initialCategories,
  setSearchTerm: (term) => set({ searchTerm: term }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  addToCart: (item: FoodItem & { selectedSize: string }) =>
    set((state) => {
      const existingItemIndex = state.cart.findIndex((cartItem) => cartItem.title === item.title && cartItem.selectedSize === item.selectedSize);

      if (existingItemIndex > -1) {
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex].quantity += 1;
        return { cart: updatedCart };
      } else return { cart: [...state.cart, { ...item, quantity: 1 }] };
    }),
  removeFromCart: (itemTitle: string, selectedSize: string) =>
    set((state) => ({
      cart: state.cart.filter((item) => !(item.title === itemTitle && item.selectedSize === selectedSize)),
    })),
  updateCartItemQuantity: (itemTitle: string, selectedSize: string, quantity: number) =>
    set((state) => {
      const updatedCart = state.cart
        .map((item) => (item.title === itemTitle && item.selectedSize === selectedSize ? { ...item, quantity: Math.max(0, quantity) } : item))
        .filter((item) => item.quantity > 0);
      return { cart: updatedCart };
    }),
  clearCart: () => set({ cart: [] }),
  getCartTotal: () => {
    const state = get();
    return state.cart.reduce((total, item) => {
      const price = parseFloat(item.price[item.selectedSize as keyof Price].replace("₹", ""));
      return total + price * item.quantity;
    }, 0);
  },
}));
