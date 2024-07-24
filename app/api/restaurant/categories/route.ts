// app/api/restaurant/categories/route.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get("id");
  if (!restaurantId) return NextResponse.json({ error: "Restaurant ID is required" }, { status: 400 });
  try {
    const categories = await prisma.category.findMany({
      where: { restaurantId },
      include: { items: true },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const { title, image, active, items, restaurantId } = body;
    const newCategory = await prisma.category.create({
      data: {
        title,
        image,
        active,
        restaurantId,
        items: {
          create: items,
        },
      },
      include: { items: true },
    });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
