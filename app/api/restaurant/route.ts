// app/api/restaurant/route.ts
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
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
  await prisma.restaurant.upsert({
    where: { email },
    update: {
      name,
      phoneNumber,
      categories: {
        upsert: (categories || []).map((category: any) => ({ where: { id: category.id }, update: category, create: category })),
      },
    },
    create: { email, name, phoneNumber, categories: { create: categories || [] } },
  });
  return NextResponse.json({ message: "Restaurant data updated successfully" });
}
