// app/api/orders/route.ts
import { auth } from "@/auth";
export const runtime = "nodejs";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userEmail = request.nextUrl.searchParams.get("userId");
  if (!userEmail) return NextResponse.json({ error: "User email is required" }, { status: 400 });
  const client = await clientPromise;
  const db = client.db();
  const orders = await db.collection("orders").find({ userId: userEmail }).toArray();
  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { userId, items, totalAmount } = await request.json();
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection("orders").insertOne({
    items,
    totalAmount,
    userId: userId,
    orderDate: new Date(),
  });
  return NextResponse.json({ orderId: result.insertedId.toString() }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const orderId = request.nextUrl.searchParams.get("orderId");
  if (!orderId) return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
  const client = await clientPromise;
  const db = client.db();
  try {
    const result = await db.collection("orders").deleteOne({ _id: new ObjectId(orderId) });
    if (result.deletedCount === 1) return NextResponse.json({ message: "Order cancelled successfully" }, { status: 200 });
    else return NextResponse.json({ error: "Order not found" }, { status: 404 });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 });
  }
}
