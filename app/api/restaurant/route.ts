// app/api/restaurant/route.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { image, title, active, items } = body;
    const restaurant = await prisma.restaurant.findUnique({
      where: { email: session.user.email },
    });
    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }
    const newCategory = await prisma.category.create({
      data: {
        image,
        title,
        active,
        restaurantId: restaurant.id,
        items: {
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
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Error creating category" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const restaurant = await prisma.restaurant.findUnique({
      where: { email: session.user.email },
      include: {
        categories: {
          include: { items: true },
        },
      },
    });
    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }
    return NextResponse.json(restaurant.categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Error fetching categories" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { id, image, title, active, items } = body;
    if (!id) {
      return NextResponse.json({ error: "ID is required for updating category" }, { status: 400 });
    }
    const restaurant = await prisma.restaurant.findUnique({
      where: { email: session.user.email },
    });
    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }
    const existingCategory = await prisma.category.findFirst({
      where: { id, restaurantId: restaurant.id },
    });
    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found or doesn't belong to this restaurant" }, { status: 404 });
    }
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        image,
        title,
        active,
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
