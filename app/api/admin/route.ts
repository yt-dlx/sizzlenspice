// app/api/admin/route.ts
import { auth } from "@/auth";
export const runtime = "nodejs";
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { email } = await request.json();
  if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });
  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection("admins").findOne({ email });
  return NextResponse.json({ exists: !!user });
}
