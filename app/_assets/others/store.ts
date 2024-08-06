// app/_assets/others/store.ts
import { create } from "zustand";
import { StoreState, FoodItem, Price } from "../types/cart";

export const useStore = create<StoreState>((set, get) => ({
  cart: [],
  addToCart: (item: FoodItem & { selectedSize: string; restaurantId: string }) =>
    set((state) => {
      const existingItemIndex = state.cart.findIndex(
        (cartItem) =>
          cartItem.title === item.title &&
          cartItem.selectedSize === item.selectedSize &&
          cartItem.restaurantId === item.restaurantId
      );
      if (existingItemIndex > -1) {
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex].quantity += 1;
        return { cart: updatedCart };
      } else return { cart: [...state.cart, { ...item, quantity: 1 }] };
    }),
  removeFromCart: (itemTitle: string, selectedSize: string, restaurantId: string) =>
    set((state) => ({
      cart: state.cart.filter(
        (item) =>
          !(
            item.title === itemTitle &&
            item.selectedSize === selectedSize &&
            item.restaurantId === restaurantId
          )
      ),
    })),
  updateCartItemQuantity: (
    itemTitle: string,
    selectedSize: string,
    restaurantId: string,
    quantity: number
  ) =>
    set((state) => {
      const updatedCart = state.cart
        .map((item) =>
          item.title === itemTitle &&
          item.selectedSize === selectedSize &&
          item.restaurantId === restaurantId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        )
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
