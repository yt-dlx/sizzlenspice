// app/_src/others/initialCategories.ts
import { Category } from "../types/cart";

const initialCategories: Category[] = [
  {
    image: "https://i.ibb.co/gz7VP4Y/u-https-wallpaperaccess-com-full-1844241.jpg",
    title: "All",
    active: true,
    items: [],
  },
  {
    image: "https://i.ibb.co/DMwHzYL/u-https-img-freepik-com-premium-photo-mutton-biryani-served-agolden-dish-isolated-dark-background.jpg",
    title: "Biryani",
    active: false,
    items: [
      {
        title: "Biryani Special",
        description: "Delicious and spicy biryani with aromatic herbs and flavorful spices.",
        image: "https://i.ibb.co/DMwHzYL/u-https-img-freepik-com-premium-photo-mutton-biryani-served-agolden-dish-isolated-dark-background.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 200,
        genre: "non-veg",
        rating: 4.5,
      },
      {
        title: "Herbal Biryani",
        description: "Aromatic biryani cooked with fresh herbs and tender meat pieces.",
        image: "https://i.ibb.co/zJ76QfC/u-https-thumbs-dreamstime-com-b-vegetarian-paneer-biryani-black-background-traditional-veg-indian.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 200,
        genre: "non-veg",
        rating: 4.3,
      },
      {
        title: "Chicken Biryani",
        description: "Flavorful chicken biryani cooked to perfection with rich spices and fragrant rice.",
        image: "https://i.ibb.co/phCRKnZ/u-https-img-freepik-com-premium-photo-chicken-biriyani-using-jeera-rice-arranged-earthenware-with.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 200,
        genre: "non-veg",
        rating: 4.7,
      },
      {
        title: "Vegetable Biryani",
        description: "Vegetarian biryani with assorted vegetables and aromatic basmati rice.",
        image: "https://i.ibb.co/MDhyXTf/u-https-img-freepik-com-premium-photo-veg-biryani-with-cottage-cheese-beans-vegetables-black-back.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 200,
        genre: "veg",
        rating: 4.2,
      },
    ],
  },
  {
    image: "https://i.ibb.co/wrr9tRM/u-https-as1-ftcdn-net-v2-jpg-03-03-05-94-1000-F-303059431-i-PMy-X5-TBxu-Kpa-Kn-XFG51-OBd-W0x-Oga-U99.jpg",
    title: "Kebab",
    active: false,
    items: [
      {
        title: "Grilled Kebab",
        description: "Juicy and tender grilled kebab marinated in special spices and herbs.",
        image: "https://i.ibb.co/wrr9tRM/u-https-as1-ftcdn-net-v2-jpg-03-03-05-94-1000-F-303059431-i-PMy-X5-TBxu-Kpa-Kn-XFG51-OBd-W0x-Oga-U99.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 200,
        genre: "non-veg",
        rating: 4.6,
      },
      {
        title: "Spicy Mutton Kebab",
        description: "Spicy mutton kebab with a perfect blend of spices and tender meat.",
        image: "https://i.ibb.co/12zGggH/u-https-i-pinimg-com-originals-3f-da-3e-3fda3e5cf7b10e00f1a387c2a8c95266.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 200,
        genre: "non-veg",
        rating: 4.8,
      },
      {
        title: "Chicken Kebab",
        description: "Tender chicken kebab grilled to perfection and marinated in spicy sauce.",
        image: "https://i.ibb.co/ZmPyhx7/u-https-www-licious-in-blog-wp-content-uploads-2020-12-Chicken-Kebab-750x750.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 200,
        genre: "non-veg",
        rating: 4.5,
      },
      {
        title: "Chickpea Kebab",
        description: "Vegetarian kebab made with chickpeas and exotic spices for a delightful taste.",
        image: "https://i.ibb.co/WBZnHfY/u-https-aplateofhappiness-files-wordpress-com-2020-06-img-6722.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 200,
        genre: "veg",
        rating: 4.3,
      },
    ],
  },
  {
    image: "https://i.ibb.co/JKJfnwm/u-https-img-freepik-com-premium-photo-asian-noodles-with-prawns-vegetables-served-pan-dark-backgr.jpg",
    title: "Noodles",
    active: false,
    items: [
      {
        title: "Veggie Noodles",
        description: "Stir-fried noodles with assorted vegetables and savory soy sauce.",
        image: "https://i.ibb.co/JKJfnwm/u-https-img-freepik-com-premium-photo-asian-noodles-with-prawns-vegetables-served-pan-dark-backgr.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 200,
        genre: "veg",
        rating: 4.3,
      },
      {
        title: "Spicy Chicken Noodles",
        description: "Spicy chicken noodles tossed with fresh vegetables and spicy seasoning.",
        image: "https://i.ibb.co/ZJk98Xv/u-https-www-tamarindnthyme-com-wp-content-uploads-2021-03-Untitled-design-75.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 200,
        genre: "non-veg",
        rating: 4.3,
      },
      {
        title: "Soy Sauce Noodles",
        description: "Noodles stir-fried with soy sauce and a hint of garlic for added flavor.",
        image: "https://i.ibb.co/zPhwZ33/u-https-i-ytimg-com-vi-ko6-Oq4-Z9-RXQ-maxresdefault.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 200,
        genre: "veg",
        rating: 4.3,
      },
      {
        title: "Garlic Shrimp Noodles",
        description: "Garlic-infused noodles with succulent shrimp and aromatic herbs.",
        image: "https://i.ibb.co/sw4Xg1f/u-https-cdn-shopify-com-s-files-1-1099-9762-articles-Cajun-Garlic-Butter-Shrimp-with-Asian-Noodles-1.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 200,
        genre: "non-veg",
        rating: 4.3,
      },
    ],
  },
  {
    image: "https://i.ibb.co/pRwNzXD/u-https-images4-alphacoders-com-104-1043751.jpg",
    title: "Drinks",
    active: false,
    items: [
      {
        title: "Hot Chocolate",
        description: "Creamy hot chocolate topped with whipped cream and chocolate shavings.",
        image: "https://i.ibb.co/pRwNzXD/u-https-images4-alphacoders-com-104-1043751.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 200,
        genre: "veg",
        rating: 4.3,
      },
      {
        title: "Iced Tea",
        description: "Refreshing iced tea with lemon slices and mint leaves.",
        image: "https://i.ibb.co/ZSZc39L/u-https-wallpapercave-com-wp-wp3079560.png",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 200,
        genre: "veg",
        rating: 4.3,
      },
      {
        title: "Cold Coffee",
        description: "Chilled coffee with milk and a hint of vanilla for a delightful taste.",
        image: "https://i.ibb.co/7yXb5T7/u-https-media-istockphoto-com-id-1072946340-photo-glass-cold-brew-coffee-with-ice-and-milk-on-black.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 200,
        genre: "veg",
        rating: 4.3,
      },
      {
        title: "Fresh Fruit Juice",
        description: "Freshly squeezed fruit juice made from seasonal fruits.",
        image: "https://i.ibb.co/RSnDX12/u-https-image-freepik-com-free-photo-variety-fruit-juices-black-background-23-2148227518.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 200,
        genre: "veg",
        rating: 4.3,
      },
    ],
  },
  {
    image: "https://i.ibb.co/ccmR63w/u-https-img-freepik-com-premium-photo-fried-rice-bowl-dark-background-666745-575.jpg",
    title: "Rice",
    active: false,
    items: [
      {
        title: "Fried Rice",
        description: "Classic fried rice with vegetables and choice of protein.",
        image: "https://i.ibb.co/ccmR63w/u-https-img-freepik-com-premium-photo-fried-rice-bowl-dark-background-666745-575.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 200,
        genre: "veg",
        rating: 4.3,
      },
      {
        title: "Chicken Rice",
        description: "Savory chicken rice with rich flavors and tender chicken pieces.",
        image: "https://i.ibb.co/x5rW6MV/u-https-www-recipetineats-com-wp-content-uploads-2019-09-Chicken-Fried-Rice-9.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 200,
        genre: "non-veg",
        rating: 4.5,
      },
      {
        title: "Shrimp Rice",
        description: "Delicious shrimp rice with fresh seafood and flavorful spices.",
        image: "https://i.ibb.co/wg668vK/u-https-www-aspicyperspective-com-wp-content-uploads-2018-04-one-pot-shrimp-black-bean-rice-skill.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 210,
        genre: "non-veg",
        rating: 4.4,
      },
      {
        title: "Paneer Rice",
        description: "Flavorful paneer rice made with Indian cottage cheese and aromatic spices.",
        image: "https://i.ibb.co/C9g288d/u-https-vaya-in-recipes-wp-content-uploads-2018-03-Paneer-fried-rice.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 210,
        genre: "veg",
        rating: 4.2,
      },
    ],
  },
  {
    image: "https://i.ibb.co/QfhDjnQ/u-https-laneandgreyfare-com-wp-content-uploads-2022-02-Chocolate-Ice-Cream-1.jpg",
    title: "Ice-Cream",
    active: false,
    items: [
      {
        title: "Chocolate Ice Cream",
        description: "Rich and creamy chocolate ice cream for chocolate lovers.",
        image: "https://i.ibb.co/QfhDjnQ/u-https-laneandgreyfare-com-wp-content-uploads-2022-02-Chocolate-Ice-Cream-1.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 200,
        genre: "veg",
        rating: 4.7,
      },
      {
        title: "Vanilla Ice Cream",
        description: "Creamy vanilla ice cream made with real vanilla beans.",
        image: "https://i.ibb.co/fNrKvM0/u-https-thumbs-dreamstime-com-b-scoop-vanilla-ice-cream-vanilla-beans-high-angle-still-life-singl.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 200,
        genre: "veg",
        rating: 4.6,
      },
      {
        title: "Strawberry Ice Cream",
        description: "Refreshing strawberry ice cream made with fresh strawberries.",
        image: "https://i.ibb.co/Dz42k30/u-https-goodthingsbaking-com-wp-content-uploads-2022-05-strawberry-ice-cream-recipe-16.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 200,
        genre: "veg",
        rating: 4.5,
      },
      {
        title: "Mango Ice Cream",
        description: "Creamy mango ice cream made with ripe mangoes for a tropical taste.",
        image: "https://i.ibb.co/FhDKW73/u-https-www-anncoojournal-com-wp-content-uploads-2021-04-mango-ice-cream-002.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 200,
        genre: "veg",
        rating: 4.4,
      },
    ],
  },
  {
    image: "https://i.ibb.co/MSyGn7n/u-https-i-ytimg-com-vi-tps-Qks-Hbt-AI-maxresdefault.jpg",
    title: "Momos",
    active: false,
    items: [
      {
        title: "Fried Chicken Momo",
        description: "Crispy fried momos filled with succulent chicken pieces and spices.",
        image: "https://i.ibb.co/MSyGn7n/u-https-i-ytimg-com-vi-tps-Qks-Hbt-AI-maxresdefault.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 240,
        genre: "non-veg",
        rating: 4.6,
      },
      {
        title: "Fried Veggie Momo",
        description: "Crispy fried momos filled with a mix of vegetables and spices.",
        image: "https://i.ibb.co/d72PbbL/u-https-cdn-dlopd-nitrocdn-com-Wvj-Gxjzkqp-CRBAFi-AQBxkif-GOZsxmrb-F-assets-static-optimized-rev-3cf.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 220,
        genre: "veg",
        rating: 4.5,
      },
      {
        title: "Steamed Chicken Momo",
        description: "Delicate steamed momos filled with tender chicken and authentic spices.",
        image: "https://i.ibb.co/qRvCVkr/u-http-spicyworld-in-recipeimages-chicken-momo.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 220,
        genre: "non-veg",
        rating: 4.7,
      },
      {
        title: "Steamed Veggie Momo",
        description: "Delicate steamed momos filled with a delicious mix of vegetables and authentic spices.",
        image: "https://i.ibb.co/vvwwfxw/u-https-www-thespruceeats-com-thmb-4hu-BB1-KXP-3-SYz-F-a-ot-Wh-SEQRM-1280x860-filters-fill-auto-1-42.jpg",
        price: { small: "50", medium: "100", full: "200" },
        forTwo: 200,
        genre: "veg",
        rating: 4.6,
      },
    ],
  },
];

export default initialCategories;
