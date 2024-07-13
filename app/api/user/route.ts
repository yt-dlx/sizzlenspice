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
  return NextResponse.json({
    phoneNumber: user?.phoneNumber || "",
    customerEmail: user?.customerEmail || "",
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { phoneNumber, customerEmail } = await request.json();
  const client = await clientPromise;
  const db = client.db();
  await db.collection("users").updateOne({ email: session.user?.email }, { $set: { phoneNumber, customerEmail } }, { upsert: true });
  return NextResponse.json({ message: "User data updated successfully" });
}
