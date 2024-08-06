// app/api/restaurant/register/route.ts
import { z } from "zod";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// export const restaurantRegisterSchema = z.object({
// email: z.string().email("Invalid email address"),
// address: z.string().min(1, "Address is required"),
// name: z.string().min(1, "Restaurant name is required"),
// panCardLastName: z.string().min(1, "Last name is required"),
// panCardFirstName: z.string().min(1, "First name is required"),
// pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
// closingHour: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
// openingHour: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
// phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
// aadhaarNumber: z.string().regex(/^\d{12}$/, "Aadhaar number must be 12 digits"),
// panCardNumber: z.string().regex(/^[A-Z]{5}\d{4}[A-Z]$/, "Invalid PAN card number"),
// });

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  // const result = restaurantRegisterSchema.safeParse(body);
  // if (!result.success) return NextResponse.json({ error: "Validation Error", issues: result.error.errors }, { status: 400 });
  const {
    email,
    name,
    phoneNumber,
    address,
    pincode,
    openingHour,
    closingHour,
    aadhaarNumber,
    panCardNumber,
    panCardFirstName,
    panCardLastName,
  } = body.data;
  try {
    const existingUser = await prisma.restaurant.findUnique({ where: { email } });
    if (existingUser) return NextResponse.json({ error: "User already exists" }, { status: 409 });
    const restaurant = await prisma.restaurant.create({
      data: {
        email,
        name,
        address,
        pincode,
        phoneNumber,
        openingHour,
        closingHour,
        aadhaarNumber,
        panCardNumber,
        panCardFirstName,
        panCardLastName,
      },
    });
    return NextResponse.json(restaurant);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
