// app/api/admin/route.ts
import { z } from "zod";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const QuerySchema = z.object({ email: z.string().email() });

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const query = QuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams));
    const client = await clientPromise;
    const db = client.db();
    const admin = await db.collection("admins").findOne({ email: query.email });
    return NextResponse.json({ isAdmin: !!admin });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors }, { status: 400 });
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
