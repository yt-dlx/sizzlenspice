// app/api/admin/orders/route.ts
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // TODO: Add admin role check here
  const client = await clientPromise;
  const db = client.db();
  const orders = await db.collection("orders").find().toArray();
  const formattedOrders = orders.map((order) => ({
    ...order,
    _id: order._id.toString(),
    total: typeof order.total === "number" ? order.total : parseFloat(order.total) || 0,
    items: order.items || [],
    createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : null,
    status: order.status || "Pending",
  }));

  return NextResponse.json({ orders: formattedOrders });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // TODO: Add admin role check here
  const { orderId, status } = await request.json();
  if (!orderId || !status) {
    return NextResponse.json({ error: "Order ID and status are required" }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db();
  try {
    const result = await db
      .collection("orders")
      .updateOne({ _id: new ObjectId(orderId) }, { $set: { status: status } });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Order status updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
