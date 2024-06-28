// app/api/admin/route.ts
import { auth } from "@/auth";
export const runtime = "nodejs";
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { email, phone } = await request.json();
  if (!email || !phone) return NextResponse.json({ error: "Email and phone are required" }, { status: 400 });
  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection("admins").findOne({ email, phone });
  return NextResponse.json({ exists: !!user });
}
