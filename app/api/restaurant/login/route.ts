// app/api/login/route.ts
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { email, password, pincode, phoneNumber } = await request.json();
  if (!email || !password || !pincode || !phoneNumber) return NextResponse.json({ error: "Email, password, pincode, and phone number are required" }, { status: 400 });
  const user = await prisma.restaurant.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password)) || user.pincode !== pincode || user.phoneNumber !== phoneNumber) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  return NextResponse.json({ message: "Login successful", user });
}
