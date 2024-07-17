// app/api/restaurant/menu/route.ts
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const email = session.user?.email as string;
  const restaurant = await prisma.restaurant.findFirst({ where: { email } });
  if (!restaurant) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  const menuItems = await prisma.menuItem.findMany({ where: { restaurantId: restaurant.id } });
  return NextResponse.json({ menuItems });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const email = session.user?.email as string;
  const restaurant = await prisma.restaurant.findFirst({ where: { email } });
  if (!restaurant) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  const { title, image, category, description, genre, price } = await request.json();
  if (!title || !image || !category || !description || !genre || !price) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  const newPrice = await prisma.price.create({
    data: {
      medium: price.medium,
      small: price.small,
      full: price.full,
    },
  });
  const newMenuItem = await prisma.menuItem.create({
    data: {
      title,
      image,
      category,
      description,
      genre,
      price: { connect: { id: newPrice.id } },
      restaurant: { connect: { id: restaurant.id } },
    },
  });
  return NextResponse.json({ menuItem: newMenuItem }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, title, image, category, description, genre, price } = await request.json();
  const updatedPrice = await prisma.price.update({
    where: { id: price.id },
    data: {
      medium: price.medium,
      small: price.small,
      full: price.full,
    },
  });
  const updatedMenuItem = await prisma.menuItem.update({
    where: { id },
    data: {
      title,
      image,
      category,
      description,
      genre,
      price: { connect: { id: updatedPrice.id } },
    },
  });

  return NextResponse.json({ menuItem: updatedMenuItem });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await request.json();
  const deletedMenuItem = await prisma.menuItem.delete({ where: { id } });
  return NextResponse.json({ menuItem: deletedMenuItem });
}
