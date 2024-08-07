// app/_assets/types/cart.ts
export interface Price {
  [key: string]: string;
  small: string;
  medium: string;
  full: string;
}
export interface FoodItem {
  id?: string;
  title: string;
  description: string;
  image: string;
  price: Price;
  genre: string;
  rating: number;
  selectedSize?: string;
  restaurantId: string;
}
export interface CartItem extends FoodItem {
  quantity: number;
  selectedSize: string;
  restaurantId: string;
}
export interface UserData {
  phoneNumber: string;
  customerEmail: string;
  locationData: {
    latitude: string;
    longitude: string;
    address: string;
    pincode: string;
  };
}
export interface Category {
  id: number;
  image: string;
  title: string;
  active: boolean;
  items: FoodItem[];
  restaurantId: string;
}
export interface Restaurant {
  id: string;
  name: string;
  email: string;
  verified: Boolean;
  phoneNumber: string;
  categories?: Category[];
}
export interface StoreState {
  cart: CartItem[];
  clearCart: () => void;
  getCartTotal: () => number;
  addToCart: (item: FoodItem & { selectedSize: string; restaurantId: string }) => void;
  removeFromCart: (itemTitle: string, selectedSize: string, restaurantId: string) => void;
  updateCartItemQuantity: (itemTitle: string, selectedSize: string, restaurantId: string, quantity: number) => void;
}
