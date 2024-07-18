// app/_assets/types/cart.ts
export interface Price {
  [key: string]: string;
  small: string;
  medium: string;
  full: string;
}

export interface FoodItem {
  title: string;
  description: string;
  image: string;
  price: Price;
  genre: string;
  rating: number;
  selectedSize?: string;
}

export interface CartItem extends FoodItem {
  quantity: number;
  selectedSize: string;
}

export interface Category {
  id: number;
  image: string;
  title: string;
  active: boolean;
  items: FoodItem[];
}

export interface StoreState {
  cart: CartItem[];
  searchTerm: string;
  clearCart: () => void;
  categories: Category[];
  activeCategory: string;
  getCartTotal: () => number;
  setSearchTerm: (term: string) => void;
  setActiveCategory: (category: string) => void;
  addToCart: (item: FoodItem & { selectedSize: string }) => void;
  removeFromCart: (itemTitle: string, selectedSize: string) => void;
  updateCartItemQuantity: (itemTitle: string, selectedSize: string, quantity: number) => void;
}
