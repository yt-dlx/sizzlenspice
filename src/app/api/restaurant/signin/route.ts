// app/api/restaurant/signin/route.ts
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import prisma from "@/public/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const restaurants = await prisma.restaurant.findMany();
  return NextResponse.json({ restaurants });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const email = session.user?.email as string;
  const { phoneNumber, address, pincode, password, ownerName, OperatingHoursStart, OperatingHoursEnd } = await request.json();
  if (!phoneNumber || !address || !pincode || !password || !ownerName || !OperatingHoursStart || !OperatingHoursEnd) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingRestaurant = await prisma.restaurant.findFirst({ where: { OR: [{ email }, { phoneNumber }, { address }, { pincode }] } });
  if (existingRestaurant) return NextResponse.json({ error: "Restaurant with given details already exists" }, { status: 400 });
  const newRestaurant = await prisma.restaurant.create({
    data: {
      email,
      address,
      pincode,
      ownerName,
      phoneNumber,
      verified: false,
      OperatingHoursEnd,
      OperatingHoursStart,
      password: hashedPassword,
    },
  });
  return NextResponse.json({ restaurant: newRestaurant }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const email = session.user?.email as string;
  const { id, phoneNumber, address, pincode, password, ownerName, OperatingHoursStart, OperatingHoursEnd } = await request.json();
  let hashedPassword = password;
  if (password) hashedPassword = await bcrypt.hash(password, 10);
  const updatedRestaurant = await prisma.restaurant.update({
    where: { id },
    data: {
      email,
      address,
      pincode,
      ownerName,
      phoneNumber,
      OperatingHoursEnd,
      OperatingHoursStart,
      password: hashedPassword,
    },
  });
  return NextResponse.json({ restaurant: updatedRestaurant });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await request.json();
  const deletedRestaurant = await prisma.restaurant.delete({ where: { id } });
  return NextResponse.json({ restaurant: deletedRestaurant });
}
