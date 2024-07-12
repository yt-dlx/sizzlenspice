// app/_others/initialCategories.ts
import { Category } from "../types/cart";

const initialCategories: Category[] = [
  {
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpaperaccess.com%2Ffull%2F1844241.jpg&f=1&nofb=1&ipt=f8ddbfb3e969230142e5b39ac1b560098235d80194e8358e8384cc4f52650116&ipo=images",
    title: "All",
    active: true,
    items: [],
  },
  {
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-photo%2Fmutton-biryani-served-agolden-dish-isolated-dark-background-side-view-indian-food_629685-8550.jpg&f=1&nofb=1&ipt=f24a6e904405c39fb3180b94db014d807a0ce3ed0b41d3c55dada9653f53baad&ipo=images",
    title: "Biryani",
    active: false,
    items: [
      {
        title: "Biryani Special",
        description: "Delicious and spicy biryani with aromatic herbs and flavorful spices.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-photo%2Fmutton-biryani-served-agolden-dish-isolated-dark-background-side-view-indian-food_629685-8550.jpg&f=1&nofb=1&ipt=f24a6e904405c39fb3180b94db014d807a0ce3ed0b41d3c55dada9653f53baad&ipo=images",
        price: { small: "50", medium: "75", full: "100" },
        forTwo: 200,
        genre: "non-veg",
        rating: 4.5,
      },
      {
        title: "Herbal Biryani",
        description: "Aromatic biryani cooked with fresh herbs and tender meat pieces.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthumbs.dreamstime.com%2Fb%2Fvegetarian-paneer-biryani-black-background-traditional-veg-indian-cuisine-dish-cheese-basmati-rice-masala-chili-pepper-153218587.jpg&f=1&nofb=1&ipt=92efe8cfa284cdfaea685f91304668103b0a9fa18ffa0f65aaae66137e3eece0&ipo=images",
        price: { small: "50", medium: "75", full: "100" },
        forTwo: 200,
        genre: "non-veg",
        rating: 4.3,
      },
      {
        title: "Chicken Biryani",
        description: "Flavorful chicken biryani cooked to perfection with rich spices and fragrant rice.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-photo%2Fchicken-biriyani-using-jeera-rice-arranged-earthenware-with-raitha-grey-background_527904-8.jpg%3Fw%3D826&f=1&nofb=1&ipt=5fb3278b71a517f755381196794d73771e264fc90cafd938dce7107dcc1b5fe2&ipo=images",
        price: { small: "50", medium: "75", full: "100" },
        forTwo: 200,
        genre: "non-veg",
        rating: 4.7,
      },
      {
        title: "Vegetable Biryani",
        description: "Vegetarian biryani with assorted vegetables and aromatic basmati rice.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-photo%2Fveg-biryani-with-cottage-cheese-beans-vegetables-black-background_629685-8919.jpg&f=1&nofb=1&ipt=21362d3c0fbde4572fd2cdea45ed7b81efaee28acacc86ee970131fa048503ad&ipo=images",
        price: { small: "50", medium: "75", full: "100" },
        forTwo: 200,
        genre: "veg",
        rating: 4.2,
      },
    ],
  },
  {
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fas1.ftcdn.net%2Fv2%2Fjpg%2F03%2F03%2F05%2F94%2F1000_F_303059431_iPMyX5TBxuKpaKnXFG51OBdW0xOgaU99.jpg&f=1&nofb=1&ipt=5944d49eb2fd2ef3b857ab9c41049790ea11b86933a0229015d79d4aeb92eead&ipo=images",
    title: "Kebab",
    active: false,
    items: [
      {
        title: "Grilled Kebab",
        description: "Juicy and tender grilled kebab marinated in special spices and herbs.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fas1.ftcdn.net%2Fv2%2Fjpg%2F03%2F03%2F05%2F94%2F1000_F_303059431_iPMyX5TBxuKpaKnXFG51OBdW0xOgaU99.jpg&f=1&nofb=1&ipt=5944d49eb2fd2ef3b857ab9c41049790ea11b86933a0229015d79d4aeb92eead&ipo=images",
        price: { small: "50", medium: "75", full: "100" },
        forTwo: 200,
        genre: "non-veg",
        rating: 4.6,
      },
      {
        title: "Spicy Mutton Kebab",
        description: "Spicy mutton kebab with a perfect blend of spices and tender meat.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F3f%2Fda%2F3e%2F3fda3e5cf7b10e00f1a387c2a8c95266.jpg&f=1&nofb=1&ipt=ad0b8e32e35899c8db38e84459e91753aa116d36eca290c3c8e7ee777b664f83&ipo=images",
        price: { small: "50", medium: "75", full: "100" },
        forTwo: 200,
        genre: "non-veg",
        rating: 4.8,
      },
      {
        title: "Chicken Kebab",
        description: "Tender chicken kebab grilled to perfection and marinated in spicy sauce.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.licious.in%2Fblog%2Fwp-content%2Fuploads%2F2020%2F12%2FChicken-Kebab-750x750.jpg&f=1&nofb=1&ipt=3a9fb3fe34de575f3a3b9e9ff8299979c2ccc9dc78cf0be28131a188f21482b2&ipo=images",
        price: { small: "50", medium: "75", full: "100" },
        forTwo: 200,
        genre: "non-veg",
        rating: 4.5,
      },
      {
        title: "Chickpea Kebab",
        description: "Vegetarian kebab made with chickpeas and exotic spices for a delightful taste.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Faplateofhappiness.files.wordpress.com%2F2020%2F06%2Fimg_6722.jpg%3Fw%3D1200&f=1&nofb=1&ipt=c6fedd72c9018895ff0f291a1392e8f8e9da766c2de147b68aa234e62cece57a&ipo=images",
        price: { small: "50", medium: "75", full: "100" },
        forTwo: 200,
        genre: "veg",
        rating: 4.3,
      },
    ],
  },
  {
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-photo%2Fasian-noodles-with-prawns-vegetables-served-pan-dark-background_1220-5662.jpg&f=1&nofb=1&ipt=e91748818649e9a5e01fc6634969fef7e9506699eacea750acd998172008f0cd&ipo=images",
    title: "Noodles",
    active: false,
    items: [
      {
        title: "Veggie Noodles",
        description: "Stir-fried noodles with assorted vegetables and savory soy sauce.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-photo%2Fasian-noodles-with-prawns-vegetables-served-pan-dark-background_1220-5662.jpg&f=1&nofb=1&ipt=e91748818649e9a5e01fc6634969fef7e9506699eacea750acd998172008f0cd&ipo=images",
        price: { small: "50", medium: "75", full: "100" },
        forTwo: 200,
        genre: "veg",
        rating: 4.3,
      },
      {
        title: "Spicy Chicken Noodles",
        description: "Spicy chicken noodles tossed with fresh vegetables and spicy seasoning.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.tamarindnthyme.com%2Fwp-content%2Fuploads%2F2021%2F03%2FUntitled-design-75.jpg&f=1&nofb=1&ipt=669ccdfa190bede0f6c11fbbf1fbc39d57849b3b98dcc620080f6dc251bcdf82&ipo=images",
        price: { small: "50", medium: "75", full: "100" },
        forTwo: 200,
        genre: "non-veg",
        rating: 4.3,
      },
      {
        title: "Soy Sauce Noodles",
        description: "Noodles stir-fried with soy sauce and a hint of garlic for added flavor.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fko6Oq4Z9RXQ%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=32d830db5c79ece2048156987be04c876c3c782cdb51e1bc8f413f6989a82724&ipo=images",
        price: { small: "50", medium: "75", full: "100" },
        forTwo: 200,
        genre: "veg",
        rating: 4.3,
      },
      {
        title: "Garlic Shrimp Noodles",
        description: "Garlic-infused noodles with succulent shrimp and aromatic herbs.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F1099%2F9762%2Farticles%2FCajun_Garlic_Butter_Shrimp_with_Asian_Noodles_1024x1024.jpg%3Fv%3D1592630201&f=1&nofb=1&ipt=30e68edd717d3f32596bdb41afc8aad283082acca5c7f75aba7a17cd4071c291&ipo=images",
        price: { small: "50", medium: "75", full: "100" },
        forTwo: 200,
        genre: "non-veg",
        rating: 4.3,
      },
    ],
  },
  {
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages4.alphacoders.com%2F104%2F1043751.jpg&f=1&nofb=1&ipt=039f074ab90d53d06237c8afa8f399f150d01459056ab5d1023aac233e6601f1&ipo=images",
    title: "Drinks",
    active: false,
    items: [
      {
        title: "Hot Chocolate",
        description: "Creamy hot chocolate topped with whipped cream and chocolate shavings.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages4.alphacoders.com%2F104%2F1043751.jpg&f=1&nofb=1&ipt=039f074ab90d53d06237c8afa8f399f150d01459056ab5d1023aac233e6601f1&ipo=images",
        price: { small: "45", medium: "65", full: "90" },
        forTwo: 200,
        genre: "veg",
        rating: 4.3,
      },
      {
        title: "Iced Tea",
        description: "Refreshing iced tea with lemon slices and mint leaves.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapercave.com%2Fwp%2Fwp3079560.png&f=1&nofb=1&ipt=bd44b18a2d56585e7589ba7b18b750c726e5de3813c28b23aefd82a9550f6e51&ipo=images",
        price: { small: "30", medium: "45", full: "60" },
        forTwo: 200,
        genre: "veg",
        rating: 4.3,
      },
      {
        title: "Cold Coffee",
        description: "Chilled coffee with milk and a hint of vanilla for a delightful taste.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.istockphoto.com%2Fid%2F1072946340%2Fphoto%2Fglass-cold-brew-coffee-with-ice-and-milk-on-black-or-dark-background.jpg%3Fs%3D612x612%26w%3D0%26k%3D20%26c%3DfkZIHaTmBnu23hBfjIS_T4UE_1nsoLjzzx6oNVbmQmg%3D&f=1&nofb=1&ipt=b91f1494db77aaa303401c2e0d62c6dcc9bde1189f5189a647588c8b0f1bc326&ipo=images",
        price: { small: "40", medium: "60", full: "80" },
        forTwo: 200,
        genre: "veg",
        rating: 4.3,
      },
      {
        title: "Fresh Fruit Juice",
        description: "Freshly squeezed fruit juice made from seasonal fruits.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimage.freepik.com%2Ffree-photo%2Fvariety-fruit-juices-black-background_23-2148227518.jpg&f=1&nofb=1&ipt=78ed012cd8fdd12531dda7e43ee855a3e18712fd7fd3418f1daa9af36acec637&ipo=images",
        price: { small: "35", medium: "50", full: "70" },
        forTwo: 200,
        genre: "veg",
        rating: 4.3,
      },
    ],
  },
  {
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-photo%2Ffried-rice-bowl-dark-background_666745-575.jpg&f=1&nofb=1&ipt=1b99eb37e00694ebe81513649a69c80a6aaec0e9db493ccb006b85ed667378ee&ipo=images",
    title: "Rice",
    active: false,
    items: [
      {
        title: "Fried Rice",
        description: "Classic fried rice with vegetables and choice of protein.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-photo%2Ffried-rice-bowl-dark-background_666745-575.jpg&f=1&nofb=1&ipt=1b99eb37e00694ebe81513649a69c80a6aaec0e9db493ccb006b85ed667378ee&ipo=images",
        price: { small: "50", medium: "75", full: "100" },
        forTwo: 200,
        genre: "veg",
        rating: 4.3,
      },
      {
        title: "Chicken Rice",
        description: "Savory chicken rice with rich flavors and tender chicken pieces.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.recipetineats.com%2Fwp-content%2Fuploads%2F2019%2F09%2FChicken-Fried-Rice_9.jpg%3Fresize%3D85&f=1&nofb=1&ipt=7af17c57a286e06ed409726a867a689af27564a372d682e63f781d27587b2dde&ipo=images",
        price: { small: "60", medium: "85", full: "110" },
        forTwo: 200,
        genre: "non-veg",
        rating: 4.5,
      },
      {
        title: "Shrimp Rice",
        description: "Delicious shrimp rice with fresh seafood and flavorful spices.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.aspicyperspective.com%2Fwp-content%2Fuploads%2F2018%2F04%2Fone-pot-shrimp-black-bean-rice-skillet-13.jpg&f=1&nofb=1&ipt=69d8b0eaabd8d2e2e7c1d3606f4c91437fbec61e0e3d7c377f1bebc864ba3cf5&ipo=images",
        price: { small: "55", medium: "80", full: "105" },
        forTwo: 210,
        genre: "non-veg",
        rating: 4.4,
      },
      {
        title: "Paneer Rice",
        description: "Flavorful paneer rice made with Indian cottage cheese and aromatic spices.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fvaya.in%2Frecipes%2Fwp-content%2Fuploads%2F2018%2F03%2FPaneer-fried-rice.jpg&f=1&nofb=1&ipt=1b336a0d193292ae80cf9558492b984dac1f1adc91790d83f83203aca913ec5b&ipo=images",
        price: { small: "55", medium: "80", full: "105" },
        forTwo: 210,
        genre: "veg",
        rating: 4.2,
      },
    ],
  },
  {
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flaneandgreyfare.com%2Fwp-content%2Fuploads%2F2022%2F02%2FChocolate-Ice-Cream-1.jpg&f=1&nofb=1&ipt=e99d4132013b21758f528fbd9fd408f67a1b48e7a649a2d5bbcbe91cc6632c25&ipo=images",
    title: "Ice-Cream",
    active: false,
    items: [
      {
        title: "Chocolate Ice Cream",
        description: "Rich and creamy chocolate ice cream for chocolate lovers.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flaneandgreyfare.com%2Fwp-content%2Fuploads%2F2022%2F02%2FChocolate-Ice-Cream-1.jpg&f=1&nofb=1&ipt=e99d4132013b21758f528fbd9fd408f67a1b48e7a649a2d5bbcbe91cc6632c25&ipo=images",
        price: { small: "35", medium: "50", full: "70" },
        forTwo: 200,
        genre: "veg",
        rating: 4.7,
      },
      {
        title: "Vanilla Ice Cream",
        description: "Creamy vanilla ice cream made with real vanilla beans.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthumbs.dreamstime.com%2Fb%2Fscoop-vanilla-ice-cream-vanilla-beans-high-angle-still-life-single-served-white-background-bean-pods-fresh-leaf-88887157.jpg&f=1&nofb=1&ipt=ce2d4594f4f58821f355ab28a8ae657dba1da3e34a7836dacbda59119ca1b8b5&ipo=images",
        price: { small: "30", medium: "45", full: "60" },
        forTwo: 200,
        genre: "veg",
        rating: 4.6,
      },
      {
        title: "Strawberry Ice Cream",
        description: "Refreshing strawberry ice cream made with fresh strawberries.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fgoodthingsbaking.com%2Fwp-content%2Fuploads%2F2022%2F05%2Fstrawberry-ice-cream-recipe-16.jpg&f=1&nofb=1&ipt=7be1413c96a7bec6b46cce778d5917dbf6910b1ba6afe9c37b8caa8c85276baf&ipo=images",
        price: { small: "40", medium: "55", full: "80" },
        forTwo: 200,
        genre: "veg",
        rating: 4.5,
      },
      {
        title: "Mango Ice Cream",
        description: "Creamy mango ice cream made with ripe mangoes for a tropical taste.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.anncoojournal.com%2Fwp-content%2Fuploads%2F2021%2F04%2Fmango-ice-cream-002.jpg&f=1&nofb=1&ipt=7f9610335d3264be3de3dd1400bdfc27e945afaf0f8f8a5878e74b7272764dce&ipo=images",
        price: { small: "45", medium: "65", full: "90" },
        forTwo: 200,
        genre: "veg",
        rating: 4.4,
      },
    ],
  },
  {
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FtpsQksHbtAI%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=8a327859736c181fc269b5e713fa9fdf7775b852daff5e77866a1622128f0edf&ipo=images",
    title: "Momos",
    active: false,
    items: [
      {
        title: "Fried Chicken Momo",
        description: "Crispy fried momos filled with succulent chicken pieces and spices.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FtpsQksHbtAI%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=8a327859736c181fc269b5e713fa9fdf7775b852daff5e77866a1622128f0edf&ipo=images",
        price: { small: "70", medium: "95", full: "120" },
        forTwo: 240,
        genre: "non-veg",
        rating: 4.6,
      },
      {
        title: "Fried Veggie Momo",
        description: "Crispy fried momos filled with a mix of vegetables and spices.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn-dlopd.nitrocdn.com%2FWvjGxjzkqpCRBAFiAQBxkifGOZsxmrbF%2Fassets%2Fstatic%2Foptimized%2Frev-3cf5128%2Fwp-content%2Fuploads%2F2021%2F09%2FFried-Momos-with-Veg-Cheese-Fillings-scaled.jpg&f=1&nofb=1&ipt=2051e68405aab654c3edbc2e36135e6af713e298783c978220ea74c2bd7e37d6&ipo=images",
        price: { small: "60", medium: "85", full: "110" },
        forTwo: 220,
        genre: "veg",
        rating: 4.5,
      },
      {
        title: "Steamed Chicken Momo",
        description: "Delicate steamed momos filled with tender chicken and authentic spices.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fspicyworld.in%2Frecipeimages%2Fchicken-momo.jpg&f=1&nofb=1&ipt=91c52c3f3ba015ca4761dcc5409788c78c7f4622851be2df6659b08c278f7cf0&ipo=images",
        price: { small: "60", medium: "85", full: "110" },
        forTwo: 220,
        genre: "non-veg",
        rating: 4.7,
      },
      {
        title: "Steamed Veggie Momo",
        description: "Delicate steamed momos filled with a delicious mix of vegetables and authentic spices.",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.thespruceeats.com%2Fthmb%2F4huBB1KXP_3SYzF_a_otWhSEQRM%3D%2F1280x860%2Ffilters%3Afill(auto%2C1)%2F4271692448_68e0f951f6_o-56a510453df78cf772862aff.jpg&f=1&nofb=1&ipt=58ea14ced39daa19dfcdf7007143dcfd3129c66afbbd8bee2fee20e0c0bde160&ipo=images",
        price: { small: "50", medium: "75", full: "100" },
        forTwo: 200,
        genre: "veg",
        rating: 4.6,
      },
    ],
  },
];

export default initialCategories;
