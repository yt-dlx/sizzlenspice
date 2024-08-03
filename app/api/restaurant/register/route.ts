// app/api/restaurant/register/route.ts
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { email, phoneNumber, name, address, pincode, openingHour, closingHour, description, aadhaarNumber, panCardNumber, panCardFirstName, panCardLastName } = await request.json();
  try {
    const existingUser = await prisma.restaurant.findUnique({ where: { email } });
    if (existingUser) return NextResponse.json({ error: "User already exists" }, { status: 409 });
    const restaurant = await prisma.restaurant.create({
      data: { email, name, address, pincode, phoneNumber, openingHour, closingHour, description, aadhaarNumber, panCardNumber, panCardLastName, panCardFirstName },
    });
    return NextResponse.json(restaurant);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
