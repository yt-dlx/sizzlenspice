import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "fs";
const prisma = new PrismaClient();
async function fetchAllData() {
  try {
    const users = await prisma.user.findMany({ include: { locationData: true } });
    const locationData = await prisma.locationData.findMany();
    const orders = await prisma.order.findMany();
    const restaurants = await prisma.restaurant.findMany({
      include: { categories: true, Item: true },
    });
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

// Siliguri, Himachal Colony Railway Bunglow Number 461 A
// 760109785264
// 8250261313
// HFRPD8435P
// 734003
// Shovit
// Dutta
