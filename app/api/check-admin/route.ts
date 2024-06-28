// app/api/check-admin/route.ts
import { auth } from "@/auth";
export const runtime = "nodejs";
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ isAdmin: false });
  const client = await clientPromise;
  const db = client.db();
  const adminUser = await db.collection("admins").findOne({ email: session?.user?.email });
  return NextResponse.json({ isAdmin: !!adminUser });
}
