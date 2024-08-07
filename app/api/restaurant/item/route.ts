// app/api/restaurant/item/route.ts
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, description, image, price, genre, rating, categoryId, restaurantId } = await request.json();
  const item = await prisma.item.create({
    data: {
      title,
      description,
      image,
      price,
      genre,
      rating,
      category: { connect: { id: categoryId } },
      restaurant: { connect: { id: restaurantId } },
    },
  });
  return NextResponse.json(item);
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, title, description, image, price, genre, rating, categoryId, restaurantId } = await request.json();
  const item = await prisma.item.update({
    where: { id },
    data: { title, description, image, price, genre, rating, categoryId, restaurantId },
  });
  return NextResponse.json(item);
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await request.json();
  const item = await prisma.item.delete({ where: { id } });
  return NextResponse.json(item);
}
