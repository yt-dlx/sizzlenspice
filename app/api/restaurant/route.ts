// app/api/restaurant/route.ts
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { FoodItem } from "@/app/_assets/types/cart";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email") || "";
  const phoneNumber = searchParams.get("phoneNumber") || "";
  const name = searchParams.get("name") || "";
  const restaurant = await prisma.restaurant.findUnique({ where: { email, phoneNumber, name }, include: { categories: { include: { items: true } } } });
  return NextResponse.json(restaurant);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, phoneNumber, categories } = await request.json();
  const email = session.user?.email ?? "";
  const restaurant = await prisma.restaurant.upsert({
    where: { email },
    update: { name, phoneNumber },
    create: { email, name, phoneNumber },
  });
  if (categories && categories.length > 0) {
    for (const category of categories) {
      await prisma.category.upsert({
        where: { id: category.id || "" }, // Use an empty string if category.id is undefined
        update: {
          title: category.title,
          image: category.image,
          active: category.active,
          items: {
            upsert: category.items.map((item: FoodItem) => ({
              where: { id: item.id || "" }, // Use an empty string if item.id is undefined
              update: {
                title: item.title,
                description: item.description,
                image: item.image,
                price: item.price,
                genre: item.genre,
                rating: item.rating,
              },
              create: {
                title: item.title,
                description: item.description,
                image: item.image,
                price: item.price,
                genre: item.genre,
                rating: item.rating,
                restaurant: { connect: { id: restaurant.id } }, // Connect the item to the restaurant
              },
            })),
          },
          restaurant: { connect: { id: restaurant.id } }, // Connect the category to the restaurant
        },
        create: {
          title: category.title,
          image: category.image,
          active: category.active,
          items: {
            create: category.items.map((item: FoodItem) => ({
              title: item.title,
              description: item.description,
              image: item.image,
              price: item.price,
              genre: item.genre,
              rating: item.rating,
              restaurant: { connect: { id: restaurant.id } }, // Connect the item to the restaurant
            })),
          },
          restaurant: { connect: { id: restaurant.id } }, // Connect the category to the restaurant
        },
      });
    }
  }
  return NextResponse.json({ message: "Restaurant data updated successfully" });
}
