import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "fs";
const prisma = new PrismaClient();
async function fetchAllData() {
  try {
    const users = await prisma.user.findMany({ include: { locationData: true } });
    const locationData = await prisma.locationData.findMany();
    const orders = await prisma.order.findMany();
    const restaurants = await prisma.restaurant.findMany({ include: { categories: true, Item: true } });
    const categories = await prisma.category.findMany({ include: { items: true } });
    const items = await prisma.item.findMany();
    const data = { users, locationData, orders, restaurants, categories, items };
    writeFileSync("database.json", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fetchAllData();

const Alcohols = [
  {
    Wine: [
      {
        name: "Sula Vineyards",
        description: "The most recognized wine brand in India, offering a variety of wines.",
        image: "https://www.gettyimages.com/detail/photo/sula-vineyards-wine-royalty-free-image/1319993445",
      },
      {
        name: "Grover Zampa",
        description: "Known for its premium wines and extensive range.",
        image: "https://www.gettyimages.com/detail/photo/grover-zampa-wine-royalty-free-image/1399434737",
      },
      {
        name: "Fratelli Wines",
        description: "A popular brand that produces both red and white wines.",
        image: "https://www.gettyimages.com/detail/photo/fratelli-wines-royalty-free-image/1319993448",
      },
      {
        name: "York Winery",
        description: "Gaining popularity for its high-quality wines produced in Nashik.",
        image: "https://www.gettyimages.com/detail/photo/york-winery-wine-royalty-free-image/1159480229",
      },
    ],
    Whiskey: [
      {
        name: "Royal Stag",
        description: "One of the best-selling whiskey brands in India.",
        image: "https://www.gettyimages.com/detail/photo/royal-stag-whiskey-royalty-free-image/1399434758",
      },
      {
        name: "Officer's Choice",
        description: "Known for its affordability and widespread consumption.",
        image: "https://www.gettyimages.com/detail/photo/officers-choice-whiskey-royalty-free-image/1275484397",
      },
      {
        name: "McDowell’s No.1",
        description: "A highly popular brand known for its smooth taste.",
        image: "https://www.gettyimages.com/detail/photo/mcdowells-no1-whiskey-royalty-free-image/1319993418",
      },
      {
        name: "Blenders Pride",
        description: "A premium whiskey brand that is favored by many.",
        image: "https://www.gettyimages.com/detail/photo/blenders-pride-whiskey-royalty-free-image/1319993422",
      },
    ],
    Beer: [
      {
        name: "Kingfisher",
        description: "The most widely consumed beer in India, known for its light and refreshing taste.",
        image: "https://www.gettyimages.com/detail/photo/kingfisher-beer-bottle-royalty-free-image/524300999",
      },
      {
        name: "Haywards 5000",
        description: "A strong beer brand that is popular in many parts of India.",
        image: "https://www.gettyimages.com/detail/photo/haywards-5000-beer-bottle-royalty-free-image/1319993427",
      },
      {
        name: "Bira 91",
        description: "A trendy craft beer that has gained popularity for its distinct taste and branding.",
        image: "https://www.gettyimages.com/detail/photo/bira-91-beer-royalty-free-image/1159480231",
      },
      {
        name: "Simba",
        description: "Another popular craft beer brand that has a growing fan base in urban areas.",
        image: "https://www.gettyimages.com/detail/photo/simba-beer-royalty-free-image/1081072628",
      },
    ],
    Rum: [
      {
        name: "Old Monk",
        description: "An iconic Indian dark rum known for its rich flavor.",
        image: "https://www.gettyimages.com/detail/photo/old-monk-rum-royalty-free-image/1399434743",
      },
      {
        name: "McDowell’s No.1 Celebration",
        description: "A popular rum brand enjoyed across the country.",
        image: "https://www.gettyimages.com/detail/photo/mcdowells-no1-celebration-rum-royalty-free-image/1275484392",
      },
      {
        name: "Hercules",
        description: "Known for its strong taste and popular among defense personnel.",
        image: "https://www.gettyimages.com/detail/photo/hercules-rum-royalty-free-image/1159480204",
      },
      {
        name: "Bacardi",
        description: "While an international brand, it is widely consumed in India, especially for cocktails.",
        image: "https://www.gettyimages.com/detail/photo/bacardi-rum-royalty-free-image/1399434732",
      },
    ],
    Vodka: [
      {
        name: "Magic Moments",
        description: "A leading vodka brand in India known for its variety of flavors.",
        image: "https://www.gettyimages.com/detail/photo/magic-moments-vodka-royalty-free-image/1399434748",
      },
      {
        name: "Romanov",
        description: "A popular choice among vodka drinkers for its affordability.",
        image: "https://www.gettyimages.com/detail/photo/romanov-vodka-royalty-free-image/1319993421",
      },
      {
        name: "White Mischief",
        description: "Known for its smoothness and wide range of flavors.",
        image: "https://www.gettyimages.com/detail/photo/white-mischief-vodka-royalty-free-image/1159480241",
      },
      {
        name: "Smirnoff",
        description: "An international brand that is very popular in India.",
        image: "https://www.gettyimages.com/detail/photo/smirnoff-vodka-royalty-free-image/1399434739",
      },
    ],
    Gin: [
      {
        name: "Greater Than",
        description: "India's first craft gin, known for its classic London Dry style.",
        image: "https://www.gettyimages.com/detail/photo/greater-than-gin-royalty-free-image/1319993437",
      },
      {
        name: "Stranger & Sons",
        description: "A contemporary gin brand that has gained popularity for its unique flavor profile.",
        image: "https://www.gettyimages.com/detail/photo/stranger-sons-gin-royalty-free-image/1399434740",
      },
      {
        name: "Hapusa",
        description: "A premium Himalayan dry gin made with indigenous botanicals.",
        image: "https://www.gettyimages.com/detail/photo/hapusa-gin-royalty-free-image/1319993442",
      },
      {
        name: "Blue Riband",
        description: "A well-known gin brand in India, popular for its affordability.",
        image: "https://www.gettyimages.com/detail/photo/blue-riband-gin-royalty-free-image/1275484401",
      },
    ],
    Brandy: [
      {
        name: "McDowell’s No.1 Brandy",
        description: "One of the best-selling brandies in India.",
        image: "https://www.gettyimages.com/detail/photo/mcdowells-no1-brandy-royalty-free-image/1399434750",
      },
      {
        name: "Mansion House",
        description: "A popular choice among brandy drinkers in India.",
        image: "https://www.gettyimages.com/detail/photo/mansion-house-brandy-royalty-free-image/1319993451",
      },
      {
        name: "Honey Bee",
        description: "Known for its smooth and sweet flavor.",
        image: "https://www.gettyimages.com/detail/photo/honey-bee-brandy-royalty-free-image/1275484406",
      },
      {
        name: "Old Admiral Brandy",
        description: "A well-known brandy brand in the Indian market.",
        image: "https://www.gettyimages.com/detail/photo/old-admiral-brandy-royalty-free-image/1399434752",
      },
    ],
    Cocktails: [
      {
        name: "Masala Mojito",
        description: "A spiced version of the classic mojito, popular in Indian bars.",
        image: "https://www.gettyimages.com/detail/photo/masala-mojito-royalty-free-image/1159480243",
      },
      {
        name: "Mango Lassi Cocktail",
        description: "A fusion of the traditional mango lassi with rum.",
        image: "https://www.gettyimages.com/detail/photo/mango-lassi-cocktail-royalty-free-image/1319993453",
      },
      {
        name: "Indian Summer",
        description: "A refreshing gin-based cocktail with Indian herbs.",
        image: "https://www.gettyimages.com/detail/photo/indian-summer-cocktail-royalty-free-image/1399434746",
      },
      {
        name: "Bollywood Martini",
        description: "A vodka martini with a spicy twist, popular in trendy bars.",
        image: "https://www.gettyimages.com/detail/photo/bollywood-martini-royalty-free-image/1319993456",
      },
    ],
  },
];




// 734003
// Siliguri, Himachal Colony Railway Bunglow Number 461 A
// 8250261313
// 760109785264
// HFRPD8435P
// Dutta
// Shovit