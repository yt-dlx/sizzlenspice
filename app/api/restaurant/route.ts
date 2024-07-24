// app/api/restaurant/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const phoneNumber = searchParams.get("phoneNumber");
    if (!email || !phoneNumber) return NextResponse.json({ error: "Email and phoneNumber are required" }, { status: 400 });
    const restaurant = await prisma.restaurant.findFirst({ where: { email, phoneNumber }, include: { categories: { include: { items: true } } } });
    if (!restaurant) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    return NextResponse.json(restaurant.categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Error fetching categories" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image, title, active, items, restaurantId } = body;
    const newCategory = await prisma.category.create({
      data: {
        image,
        title,
        active,
        restaurant: { connect: { id: restaurantId } },
        items: { create: items.map((item: any) => ({ title: item.title, description: item.description, image: item.image, price: item.price, genre: item.genre, rating: item.rating })) },
      },
      include: { items: true },
    });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Error creating category" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, image, title, active, items, restaurantId } = body;
    if (!id) return NextResponse.json({ error: "ID is required for updating category" }, { status: 400 });
    const existingCategory = await prisma.category.findUnique({ where: { id } });
    if (!existingCategory) return NextResponse.json({ error: "Category not found" }, { status: 404 });
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        image,
        title,
        active,
        restaurant: { connect: { id: restaurantId } },
        items: {
          deleteMany: {},
          create: items.map((item: any) => ({
            title: item.title,
            description: item.description,
            image: item.image,
            price: item.price,
            genre: item.genre,
            rating: item.rating,
          })),
        },
      },
      include: { items: true },
    });
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Error updating category" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
