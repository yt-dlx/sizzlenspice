// app/api/restaurant/all/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Category } from "@/app/_assets/types/cart";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({ include: { categories: { include: { items: true } } } });
    let allCategories: Category[] = [];
    restaurants.forEach((restaurant) => {
      const categoriesWithNumberId = restaurant.categories.map((category) => ({
        ...category,
        id: Number(category.id),
        items: category.items.map((item) => ({ ...item, id: Number(item.id) })),
      }));
      allCategories = [...allCategories, ...categoriesWithNumberId];
    });
    return NextResponse.json(allCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Error fetching categories" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
