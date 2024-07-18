// app/api/restaurant/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image, title, active, items } = body;
    const newCategory = await prisma.category.create({
      data: {
        image,
        title,
        active,
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

export async function GET() {
  try {
    const categories = await prisma.category.findMany({ include: { items: true } });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Error fetching categories" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
