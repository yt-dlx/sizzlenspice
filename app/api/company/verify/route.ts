// app/api/company/verify-restaurant/route.ts
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { restaurantId, verified, verificationMessage } = await request.json();
  if (!restaurantId) return NextResponse.json({ error: "Restaurant ID is required" }, { status: 400 });
  try {
    const updatedRestaurant = await prisma.restaurant.update({ where: { id: restaurantId }, data: { verified, verificationMessage } });
    return NextResponse.json(updatedRestaurant);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
