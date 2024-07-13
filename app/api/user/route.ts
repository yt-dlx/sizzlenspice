// app/api/user/route.ts
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection("users").findOne({ email: session.user?.email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ phoneNumber: user.phoneNumber || "", email: user.email || "" });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { phoneNumber, email } = await request.json();
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection("users").updateOne({ email: session.user?.email }, { $set: { phoneNumber, email } }, { upsert: true });
  if (result.modifiedCount === 0 && result.upsertedCount === 0) return NextResponse.json({ error: "Failed to update user information" }, { status: 500 });
  return NextResponse.json({ message: "User data updated successfully", phoneNumber, email });
}
