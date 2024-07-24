// app/api/restaurant/route.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const { image, title, active, items } = body;
    const user = await prisma.user.findUnique({ where: { email: session.user?.email }, include: { restaurant: true } });
    if (!user || !user.restaurant) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    const newCategory = await prisma.category.create({
      data: {
        image,
        title,
        active,
        restaurantId: user.restaurant.id,
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

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { email: session.user?.email }, include: { restaurant: true } });
    if (!user || !user.restaurant) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    const categories = await prisma.category.findMany({ where: { restaurantId: user.restaurant.id }, include: { items: true } });
    return NextResponse.json(categories);
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
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const { id, image, title, active, items } = body;
    if (!id) return NextResponse.json({ error: "ID is required for updating category" }, { status: 400 });
    const existingCategory = await prisma.category.findUnique({ where: { id } });
    if (!existingCategory) return NextResponse.json({ error: "Category not found" }, { status: 404 });
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
