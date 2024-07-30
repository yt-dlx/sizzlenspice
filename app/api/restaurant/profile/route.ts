// app/api/restaurant/profile/route.ts
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { email } = await request.json();
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) return NextResponse.json(user);
    else return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
