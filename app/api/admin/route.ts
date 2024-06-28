// app/api/admin/route.ts
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await auth();
  console.log(session);
  try {
    const email = request.nextUrl.searchParams.get("email");
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });
    const client = await clientPromise;
    const db = client.db();
    const admin = await db.collection("admins").findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });
    return NextResponse.json({ isAdmin: !!admin });
  } catch (error) {
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
