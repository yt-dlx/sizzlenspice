// app/api/registration/route.ts
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const restaurants = await prisma.restaurant.findMany();
    return NextResponse.json({ restaurants });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch restaurants" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { email, phoneNumber, address, pincode, password, ownerName, OperatingHoursStart, OperatingHoursEnd } = await request.json();
    if (!email || !phoneNumber || !address || !pincode || !password || !ownerName || !OperatingHoursStart || !OperatingHoursEnd) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingRestaurant = await prisma.restaurant.findFirst({
      where: { OR: [{ email }, { phoneNumber }, { address }, { pincode }] },
    });
    if (existingRestaurant) return NextResponse.json({ error: "Restaurant with given details already exists" }, { status: 400 });
    const newRestaurant = await prisma.restaurant.create({
      data: {
        email,
        phoneNumber,
        address,
        pincode,
        ownerName,
        OperatingHoursStart,
        OperatingHoursEnd,
        password: hashedPassword,
      },
    });
    return NextResponse.json({ restaurant: newRestaurant }, { status: 201 });
  } catch (error) {
    console.error("Failed to create restaurant:", error);
    return NextResponse.json({ error: "Failed to create restaurant" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, email, phoneNumber, address, pincode, password, ownerName, OperatingHoursStart, OperatingHoursEnd } = await request.json();
  try {
    let hashedPassword = password;
    if (password) hashedPassword = await bcrypt.hash(password, 10);
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id },
      data: {
        email,
        phoneNumber,
        address,
        pincode,
        password: hashedPassword,
        ownerName,
        OperatingHoursStart,
        OperatingHoursEnd,
      },
    });
    return NextResponse.json({ restaurant: updatedRestaurant });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update restaurant" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await request.json();
  try {
    const deletedRestaurant = await prisma.restaurant.delete({ where: { id } });
    return NextResponse.json({ restaurant: deletedRestaurant });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete restaurant" }, { status: 500 });
  }
}
