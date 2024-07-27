// app/api/restaurant/category/route.ts
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Add Category
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, image, active, restaurantId } = await request.json();
  const category = await prisma.category.create({ data: { title, image, active, restaurantId } });
  return NextResponse.json(category);
}

// Edit Category
export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, title, image, active, restaurantId } = await request.json();
  const category = await prisma.category.update({ where: { id }, data: { title, image, active, restaurantId } });
  return NextResponse.json(category);
}

// Delete Category
export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await request.json();
  const category = await prisma.category.delete({ where: { id } });
  return NextResponse.json(category);
}
