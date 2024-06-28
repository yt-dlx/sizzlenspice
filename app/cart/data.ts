type Item = {
  title: string;
  image: string;
  price: {
    full: string;
    small: string;
    medium: string;
  };
  description: string;
  genre: "veg" | "non-veg";
};

type CartItem = {
  title: string;
  image: string;
  price: string;
  quantity: number;
  description: string;
  genre: "veg" | "non-veg";
  plateSize: "small" | "medium" | "full";
};

type Category = {
  items: Item[];
  title: string;
  image: string;
  active: boolean;
};

const initialCategories: Category[] = [
  {
    image: "/biryani/biryani.jpg",
    title: "Biryani",
    active: true,
    items: [
      {
        title: "Biryani Special",
        description: "Delicious and spicy biryani with aromatic herbs and flavorful spices.",
        image: "/biryani/Biryani_Special.jpg",
        price: { small: "50.00", medium: "75.00", full: "100.00" },
        genre: "non-veg",
      },
      {
        title: "Herbal Biryani",
        description: "Aromatic biryani cooked with fresh herbs and tender meat pieces.",
        image: "/biryani/Herbal_Biryani.jpg",
        price: { small: "50.00", medium: "75.00", full: "100.00" },
        genre: "non-veg",
      },
      {
        title: "Chicken Biryani",
        description: "Flavorful chicken biryani cooked to perfection with rich spices and fragrant rice.",
        image: "/biryani/Chicken_Biryani.jpg",
        price: { small: "50.00", medium: "75.00", full: "100.00" },
        genre: "non-veg",
      },
      {
        title: "Vegetable Biryani",
        description: "Vegetarian biryani with assorted vegetables and aromatic basmati rice.",
        image: "/biryani/Vegetable_Biryani.jpg",
        price: { small: "50.00", medium: "75.00", full: "100.00" },
        genre: "veg",
      },
    ],
  },
  {
    image: "/kebab/kebab.jpg",
    title: "Kebab",
    active: false,
    items: [
      {
        title: "Grilled Kebab",
        description: "Juicy and tender grilled kebab marinated in special spices and herbs.",
        image: "/kebab/Grilled_Kebab.jpg",
        price: { small: "50.00", medium: "75.00", full: "100.00" },
        genre: "non-veg",
      },
      {
        title: "Spicy Mutton Kebab",
        description: "Spicy mutton kebab with a perfect blend of spices and tender meat.",
        image: "/kebab/Spicy_Mutton_Kebab.jpg",
        price: { small: "50.00", medium: "75.00", full: "100.00" },
        genre: "non-veg",
      },
      {
        title: "Chicken Kebab",
        description: "Tender chicken kebab grilled to perfection and marinated in spicy sauce.",
        image: "/kebab/Chicken_Kebab.jpg",
        price: { small: "50.00", medium: "75.00", full: "100.00" },
        genre: "non-veg",
      },
      {
        title: "Chickpea Kebab",
        description: "Vegetarian kebab made with chickpeas and exotic spices for a delightful taste.",
        image: "/kebab/Chickpea_Kebab.jpg",
        price: { small: "50.00", medium: "75.00", full: "100.00" },
        genre: "veg",
      },
    ],
  },
  {
    image: "/noodles/noodles.jpg",
    title: "Noodles",
    active: false,
    items: [
      {
        title: "Veggie Noodles",
        description: "Stir-fried noodles with assorted vegetables and savory soy sauce.",
        image: "/noodles/Veggie_Noodles.jpg",
        price: { small: "50.00", medium: "75.00", full: "100.00" },
        genre: "veg",
      },
      {
        title: "Spicy Chicken Noodles",
        description: "Spicy chicken noodles tossed with fresh vegetables and spicy seasoning.",
        image: "/noodles/Spicy_Chicken_Noodles.jpg",
        price: { small: "50.00", medium: "75.00", full: "100.00" },
        genre: "non-veg",
      },
      {
        title: "Soy Sauce Noodles",
        description: "Noodles stir-fried with soy sauce and a hint of garlic for added flavor.",
        image: "/noodles/Soy_Sauce_Noodles.jpg",
        price: { small: "50.00", medium: "75.00", full: "100.00" },
        genre: "veg",
      },
      {
        title: "Garlic Shrimp Noodles",
        description: "Garlic-infused noodles with succulent shrimp and aromatic herbs.",
        image: "/noodles/Garlic_Shrimp_Noodles.jpg",
        price: { small: "50.00", medium: "75.00", full: "100.00" },
        genre: "non-veg",
      },
    ],
  },
  {
    image: "/rice/rice.jpg",
    title: "Rice",
    active: false,
    items: [
      {
        title: "Steamed Rice",
        description: "Plain and steamed basmati rice served as a perfect accompaniment.",
        image: "/rice/Steamed_Rice.jpg",
        price: { small: "50.00", medium: "75.00", full: "100.00" },
        genre: "veg",
      },
      {
        title: "Vegetable Fried Rice",
        description: "Fried rice with assorted vegetables and aromatic spices for a flavorful experience.",
        image: "/rice/Vegetable_Fried_Rice.jpg",
        price: { small: "50.00", medium: "75.00", full: "100.00" },
        genre: "veg",
      },
      {
        title: "Egg Fried Rice",
        description: "Fried rice cooked with scrambled eggs and a blend of spices.",
        image: "/rice/Egg_Fried_Rice.jpg",
        price: { small: "50.00", medium: "75.00", full: "100.00" },
        genre: "non-veg",
      },
      {
        title: "Chicken Fried Rice",
        description: "Fried rice prepared with tender chicken pieces and savory seasonings.",
        image: "/rice/Chicken_Fried_Rice.jpg",
        price: { small: "50.00", medium: "75.00", full: "100.00" },
        genre: "non-veg",
      },
    ],
  },
  {
    image: "/coming-soon.jpg",
    title: "more foods",
    active: false,
    items: [],
  },
];

export default initialCategories;
export type { Item, CartItem, Category };
