// app/api/restaurant/auth/route.ts
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Check if user exists
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { email } = await request.json();
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) return NextResponse.json({ exists: true });
    else return NextResponse.json({ exists: false });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
