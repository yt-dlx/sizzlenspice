// app/api/restaurant/auth.ts
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { email } = await request.json();
  try {
    const restaurant = await prisma.restaurant.findUnique({ where: { email } });
    if (restaurant) {
      if (restaurant.verified) return NextResponse.json({ exists: true, verified: true });
      else return NextResponse.json({ exists: true, verified: false });
    }
    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
