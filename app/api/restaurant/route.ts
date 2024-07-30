// app/api/restaurant/route.ts
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { email, phoneNumber, name } = await request.json();
  const user = await prisma.user.findFirst({ where: { OR: [{ email }, { phoneNumber }] } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const restaurant = await prisma.restaurant.findFirst({ where: { name }, include: { categories: { include: { items: true } } } });
  if (!restaurant) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  return NextResponse.json(restaurant);
}
