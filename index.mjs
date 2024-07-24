// // index.mjs
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();
// const initialCategories = [
// {
// image: "https://i.postimg.cc/Y08Wr36k/u-https-wallpaperaccess-com-full-1844241.jpgs",
// title: "All",
// active: true,
// items: [],
// },
// {
// image: "https://i.postimg.cc/kgYL6PJR/u-https-i-ytimg-com-vi-tps-Qks-Hbt-AI-maxresdefault.jpg",
// title: "Momos",
// active: false,
// items: [
// {
// title: "Fried Chicken Momo",
// description: "Crispy fried momos filled with succulent chicken pieces and spices.",
// image: "https://i.postimg.cc/kgYL6PJR/u-https-i-ytimg-com-vi-tps-Qks-Hbt-AI-maxresdefault.jpg",
// price: { small: "50", medium: "100", full: "200" },

// genre: "non-veg",
// rating: 4.6,
// },
// {
// title: "Fried Veggie Momo",
// description: "Crispy fried momos filled with a mix of vegetables and spices.",
// image: "https://i.postimg.cc/6qVDy7qB/u-https-cdn-dlopd-nitrocdn-com-Wvj-Gxjzkqp-CRBAFi-AQBxkif-GOZsxmrb-F-assets-static-optimized-rev-3cf51.jpg",
// price: { small: "50", medium: "100", full: "200" },

// genre: "veg",
// rating: 4.5,
// },
// {
// title: "Steamed Chicken Momo",
// description: "Delicate steamed momos filled with tender chicken and authentic spices.",
// image: "https://i.postimg.cc/mrJxqfKW/u-http-spicyworld-in-recipeimages-chicken-momo.jpg",
// price: { small: "50", medium: "100", full: "200" },

// genre: "non-veg",
// rating: 4.7,
// },
// {
// title: "Steamed Veggie Momo",
// description: "Delicate steamed momos filled with a delicious mix of vegetables and authentic spices.",
// image:
// "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.thespruceeats.com%2Fthmb%2F4huBB1KXP_3SYzF_a_otWhSEQRM%3D%2F1280x860%2Ffilters%3Afill(auto%2C1)%2F4271692448_68e0f951f6_o-56a510453df78cf772862aff.jpg&f=1&nofb=1&ipt=58ea14ced39daa19dfcdf7007143dcfd3129c66afbbd8bee2fee20e0c0bde160&ipo=images",
// price: { small: "50", medium: "100", full: "200" },

// genre: "veg",
// rating: 4.6,
// },
// ],
// },
// {
// image: "https://i.postimg.cc/pXXj0wvd/u-https-img-freepik-com-premium-photo-mutton-biryani-served-agolden-dish-isolated-dark-background.jpg",
// title: "Biryani",
// active: false,
// items: [
// {
// title: "Biryani Special",
// description: "Delicious and spicy biryani with aromatic herbs and flavorful spices.",
// image: "https://i.postimg.cc/pXXj0wvd/u-https-img-freepik-com-premium-photo-mutton-biryani-served-agolden-dish-isolated-dark-background.jpg",
// price: { small: "50", medium: "100", full: "200" },

// genre: "non-veg",
// rating: 4.5,
// },
// {
// title: "Herbal Biryani",
// description: "Aromatic biryani cooked with fresh herbs and tender meat pieces.",
// image: "https://i.postimg.cc/d1sQsK4k/u-https-thumbs-dreamstime-com-b-vegetarian-paneer-biryani-black-background-traditional-veg-indian.jpg",
// price: { small: "50", medium: "100", full: "200" },

// genre: "non-veg",
// rating: 4.3,
// },
// {
// title: "Chicken Biryani",
// description: "Flavorful chicken biryani cooked to perfection with rich spices and fragrant rice.",
// image: "https://i.postimg.cc/3rbrTVpN/u-https-img-freepik-com-premium-photo-chicken-biriyani-using-jeera-rice-arranged-earthenware-with.jpg",
// price: { small: "50", medium: "100", full: "200" },

// genre: "non-veg",
// rating: 4.7,
// },
// {
// title: "Vegetable Biryani",
// description: "Vegetarian biryani with assorted vegetables and aromatic basmati rice.",
// image: "https://i.postimg.cc/cJmZ5b0s/u-https-img-freepik-com-premium-photo-veg-biryani-with-cottage-cheese-beans-vegetables-black-back.jpg",
// price: { small: "50", medium: "100", full: "200" },

// genre: "veg",
// rating: 4.2,
// },
// ],
// },
// {
// image: "https://i.postimg.cc/c1jWjYy8/u-https-as1-ftcdn-net-v2-jpg-03-03-05-94-1000-F-303059431-i-PMy-X5-TBxu-Kpa-Kn-XFG51-OBd-W0x-Oga-U99.jpg",
// title: "Kebab",
// active: false,
// items: [
// {
// title: "Grilled Kebab",
// description: "Juicy and tender grilled kebab marinated in special spices and herbs.",
// image: "https://i.postimg.cc/c1jWjYy8/u-https-as1-ftcdn-net-v2-jpg-03-03-05-94-1000-F-303059431-i-PMy-X5-TBxu-Kpa-Kn-XFG51-OBd-W0x-Oga-U99.jpg",
// price: { small: "50", medium: "100", full: "200" },

// genre: "non-veg",
// rating: 4.6,
// },
// {
// title: "Spicy Mutton Kebab",
// description: "Spicy mutton kebab with a perfect blend of spices and tender meat.",
// image: "https://i.postimg.cc/MTHk3Z9D/u-https-i-pinimg-com-originals-3f-da-3e-3fda3e5cf7b10e00f1a387c2a8c95266.jpg",
// price: { small: "50", medium: "100", full: "200" },

// genre: "non-veg",
// rating: 4.8,
// },
// {
// title: "Chicken Kebab",
// description: "Tender chicken kebab grilled to perfection and marinated in spicy sauce.",
// image: "https://i.postimg.cc/K4XdYPxq/u-https-www-licious-in-blog-wp-content-uploads-2020-12-Chicken-Kebab-750x750.jpg",
// price: { small: "50", medium: "100", full: "200" },

// genre: "non-veg",
// rating: 4.5,
// },
// {
// title: "Chickpea Kebab",
// description: "Vegetarian kebab made with chickpeas and exotic spices for a delightful taste.",
// image: "https://i.postimg.cc/9f8XQnSL/u-https-aplateofhappiness-files-wordpress-com-2020-06-img-6722.jpg",
// price: { small: "50", medium: "100", full: "200" },

// genre: "veg",
// rating: 4.3,
// },
// ],
// },
// {
// image: "https://i.postimg.cc/Gp2rVj2G/u-https-img-freepik-com-premium-photo-asian-noodles-with-prawns-vegetables-served-pan-dark-backgr.jpg",
// title: "Noodles",
// active: false,
// items: [
// {
// title: "Veggie Noodles",
// description: "Stir-fried noodles with assorted vegetables and savory soy sauce.",
// image:
// "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-photo%2Fasian-noodles-with-prawns-vegetables-served-pan-dark-background_1220-5662.jpg&f=1&nofb=1&ipt=e91748818649e9a5e01fc6634969fef7e9506699eacea750acd998172008f0cd&ipo=images",
// price: { small: "50", medium: "100", full: "200" },

// genre: "veg",
// rating: 4.3,
// },
// {
// title: "Spicy Chicken Noodles",
// description: "Spicy chicken noodles tossed with fresh vegetables and spicy seasoning.",
// image:
// "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.tamarindnthyme.com%2Fwp-content%2Fuploads%2F2021%2F03%2FUntitled-design-75.jpg&f=1&nofb=1&ipt=669ccdfa190bede0f6c11fbbf1fbc39d57849b3b98dcc620080f6dc251bcdf82&ipo=images",
// price: { small: "50", medium: "100", full: "200" },

// genre: "non-veg",
// rating: 4.3,
// },
// {
// title: "Soy Sauce Noodles",
// description: "Noodles stir-fried with soy sauce and a hint of garlic for added flavor.",
// image:
// "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fko6Oq4Z9RXQ%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=32d830db5c79ece2048156987be04c876c3c782cdb51e1bc8f413f6989a82724&ipo=images",
// price: { small: "50", medium: "100", full: "200" },

// genre: "veg",
// rating: 4.3,
// },
// {
// title: "Garlic Shrimp Noodles",
// description: "Garlic-infused noodles with succulent shrimp and aromatic herbs.",
// image:
// "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F1099%2F9762%2Farticles%2FCajun_Garlic_Butter_Shrimp_with_Asian_Noodles_1024x1024.jpg%3Fv%3D1592630201&f=1&nofb=1&ipt=30e68edd717d3f32596bdb41afc8aad283082acca5c7f75aba7a17cd4071c291&ipo=images",
// price: { small: "50", medium: "100", full: "200" },

// genre: "non-veg",
// rating: 4.3,
// },
// ],
// },
// {
// image:
// "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages4.alphacoders.com%2F104%2F1043751.jpg&f=1&nofb=1&ipt=039f074ab90d53d06237c8afa8f399f150d01459056ab5d1023aac233e6601f1&ipo=images",
// title: "Drinks",
// active: false,
// items: [
// {
// title: "Hot Chocolate",
// description: "Creamy hot chocolate topped with whipped cream and chocolate shavings.",
// image:
// "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages4.alphacoders.com%2F104%2F1043751.jpg&f=1&nofb=1&ipt=039f074ab90d53d06237c8afa8f399f150d01459056ab5d1023aac233e6601f1&ipo=images",
// price: { small: "50", medium: "100", full: "200" },

// genre: "veg",
// rating: 4.3,
// },
// {
// title: "Iced Tea",
// description: "Refreshing iced tea with lemon slices and mint leaves.",
// image:
// "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapercave.com%2Fwp%2Fwp3079560.png&f=1&nofb=1&ipt=bd44b18a2d56585e7589ba7b18b750c726e5de3813c28b23aefd82a9550f6e51&ipo=images",
// price: { small: "50", medium: "100", full: "200" },

// genre: "veg",
// rating: 4.3,
// },
// {
// title: "Cold Coffee",
// description: "Chilled coffee with milk and a hint of vanilla for a delightful taste.",
// image:
// "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.istockphoto.com%2Fid%2F1072946340%2Fphoto%2Fglass-cold-brew-coffee-with-ice-and-milk-on-black-or-dark-background.jpg%3Fs%3D612x612%26w%3D0%26k%3D20%26c%3DfkZIHaTmBnu23hBfjIS_T4UE_1nsoLjzzx6oNVbmQmg%3D&f=1&nofb=1&ipt=b91f1494db77aaa303401c2e0d62c6dcc9bde1189f5189a647588c8b0f1bc326&ipo=images",
// price: { small: "50", medium: "100", full: "200" },

// genre: "veg",
// rating: 4.3,
// },
// {
// title: "Fresh Fruit Juice",
// description: "Freshly squeezed fruit juice made from seasonal fruits.",
// image:
// "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimage.freepik.com%2Ffree-photo%2Fvariety-fruit-juices-black-background_23-2148227518.jpg&f=1&nofb=1&ipt=78ed012cd8fdd12531dda7e43ee855a3e18712fd7fd3418f1daa9af36acec637&ipo=images",
// price: { small: "50", medium: "100", full: "200" },

// genre: "veg",
// rating: 4.3,
// },
// ],
// },
// {
// image:
// "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-photo%2Ffried-rice-bowl-dark-background_666745-575.jpg&f=1&nofb=1&ipt=1b99eb37e00694ebe81513649a69c80a6aaec0e9db493ccb006b85ed667378ee&ipo=images",
// title: "Rice",
// active: false,
// items: [
// {
// title: "Fried Rice",
// description: "Classic fried rice with vegetables and choice of protein.",
// image:
// "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-photo%2Ffried-rice-bowl-dark-background_666745-575.jpg&f=1&nofb=1&ipt=1b99eb37e00694ebe81513649a69c80a6aaec0e9db493ccb006b85ed667378ee&ipo=images",
// price: { small: "50", medium: "100", full: "200" },

// genre: "veg",
// rating: 4.3,
// },
// {
// title: "Chicken Rice",
// description: "Savory chicken rice with rich flavors and tender chicken pieces.",
// image: "https://i.postimg.cc/fW37D4Fg/u-https-www-recipetineats-com-wp-content-uploads-2019-09-Chicken-Fried-Rice-9.jpg",
// price: { small: "50", medium: "100", full: "200" },

// genre: "non-veg",
// rating: 4.5,
// },
// {
// title: "Shrimp Rice",
// description: "Delicious shrimp rice with fresh seafood and flavorful spices.",
// image: "https://i.postimg.cc/XJPvQzkr/u-https-www-aspicyperspective-com-wp-content-uploads-2018-04-one-pot-shrimp-black-bean-rice-skill.jpg",
// price: { small: "50", medium: "100", full: "200" },
// genre: "non-veg",
// rating: 4.4,
// },
// {
// title: "Paneer Rice",
// description: "Flavorful paneer rice made with Indian cottage cheese and aromatic spices.",
// image: "https://i.postimg.cc/wjY7Cn8J/u-https-vaya-in-recipes-wp-content-uploads-2018-03-Paneer-fried-rice.jpg",
// price: { small: "50", medium: "100", full: "200" },
// genre: "veg",
// rating: 4.2,
// },
// ],
// },
// {
// image: "https://i.postimg.cc/KjVg3YHs/u-https-laneandgreyfare-com-wp-content-uploads-2022-02-Chocolate-Ice-Cream-1.jpg",
// title: "Ice-Cream",
// active: false,
// items: [
// {
// title: "Chocolate Ice Cream",
// description: "Rich and creamy chocolate ice cream for chocolate lovers.",
// image: "https://i.postimg.cc/KjVg3YHs/u-https-laneandgreyfare-com-wp-content-uploads-2022-02-Chocolate-Ice-Cream-1.jpg",
// price: { small: "50", medium: "100", full: "200" },

// genre: "veg",
// rating: 4.7,
// },
// {
// title: "Vanilla Ice Cream",
// description: "Creamy vanilla ice cream made with real vanilla beans.",
// image: "https://i.postimg.cc/j2ky6cLc/u-https-thumbs-dreamstime-com-b-scoop-vanilla-ice-cream-vanilla-beans-high-angle-still-life-singl.jpg",
// price: { small: "50", medium: "100", full: "200" },

// genre: "veg",
// rating: 4.6,
// },
// {
// title: "Strawberry Ice Cream",
// description: "Refreshing strawberry ice cream made with fresh strawberries.",
// image: "https://i.postimg.cc/bvXHFmLF/u-https-goodthingsbaking-com-wp-content-uploads-2022-05-strawberry-ice-cream-recipe-16.jpg",
// price: { small: "50", medium: "100", full: "200" },

// genre: "veg",
// rating: 4.5,
// },
// {
// title: "Mango Ice Cream",
// description: "Creamy mango ice cream made with ripe mangoes for a tropical taste.",
// image: "https://i.postimg.cc/dVh4fkFD/u-https-www-anncoojournal-com-wp-content-uploads-2021-04-mango-ice-cream-002.jpg",
// price: { small: "50", medium: "100", full: "200" },

// genre: "veg",
// rating: 4.4,
// },
// ],
// },
// ];

// async function main() {
// try {
// for (const category of initialCategories) {
// await prisma.category.create({
// data: {
// image: category.image,
// title: category.title,
// active: category.active,
// items: {
// create: category.items.map((item) => ({
// title: item.title,
// description: item.description,
// image: item.image,
// price: item.price,
// genre: item.genre,
// rating: item.rating,
// })),
// },
// },
// });
// }
// console.log("Data successfully uploaded");
// } catch (error) {
// console.error("Error uploading data:", error);
// } finally {
// await prisma.$disconnect();
// }
// }

// main();

// I want multiple changes. Here are all those:
// - Each Item is related to category. I want each Category to be related to individual restaurant.
// - Each restaurant data for the category can be fetched if provided email and phoneNumber.
// - In profile page all the categories and it's items will be visible which was uploaded by that particular restaurant.
