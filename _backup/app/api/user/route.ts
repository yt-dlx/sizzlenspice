// app/api/user/route.ts
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const email = session.user?.email ?? "";
  const user = await prisma.user.findUnique({ where: { email } });
  return NextResponse.json({ phoneNumber: user?.phoneNumber || "", customerEmail: user?.customerEmail || "" });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { phoneNumber, customerEmail } = await request.json();
  const email = session.user?.email ?? "";
  await prisma.user.upsert({
    where: { email },
    update: { phoneNumber, customerEmail },
    create: { email, phoneNumber, customerEmail },
  });
  return NextResponse.json({ message: "User data updated successfully" });
}