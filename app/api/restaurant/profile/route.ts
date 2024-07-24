// app/api/restaurant/profile/route.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const restaurant = await prisma.restaurant.findUnique({ where: { email: session.user.email } });
    if (!restaurant) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    return NextResponse.json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
