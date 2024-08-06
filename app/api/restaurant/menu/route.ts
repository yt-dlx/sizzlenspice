// app/api/restaurant/menu/route.ts
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const restaurants = await prisma.restaurant.findMany({
    include: { categories: { include: { items: true } } },
  });
  return NextResponse.json(restaurants);
}
