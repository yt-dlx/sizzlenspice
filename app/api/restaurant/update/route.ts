// app/api/restaurant/update/route.ts
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { id, ...updateData } = body;
  try {
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(updatedRestaurant);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
