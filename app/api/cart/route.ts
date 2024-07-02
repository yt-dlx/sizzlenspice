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
  const formattedOrders = orders.map((order) => ({
    ...order,
    _id: order._id.toString(),
    total: typeof order.total === "number" ? order.total : parseFloat(order.total) || 0,
    items: order.items || [],
    createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : null,
  }));
  return NextResponse.json({ orders: formattedOrders });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { userId, cart, totalAmount } = await request.json();
  if (!Array.isArray(cart) || cart.length === 0) {
    return NextResponse.json({ error: "Invalid cart data" }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db();
  const orderId = new ObjectId();
  const orderDate = new Date();
  const orderDocument = {
    _id: orderId,
    items: cart.map((item) => {
      const selectedPrice = item.price[item.selectedSize];
      return {
        title: item.title,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        price: selectedPrice,
      };
    }),
    total: typeof totalAmount === "number" ? totalAmount : parseFloat(totalAmount),
    userId: userId,
    createdAt: orderDate,
  };
  if (isNaN(orderDocument.total)) {
    return NextResponse.json({ error: "Invalid total amount" }, { status: 400 });
  }
  await db.collection("orders").insertOne(orderDocument);
  return NextResponse.json(
    {
      orderId: orderId.toString(),
      total: orderDocument.total,
      createdAt: orderDate,
    },
    { status: 201 }
  );
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
    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "Order cancelled successfully" }, { status: 200 });
    } else return NextResponse.json({ error: "Order not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 });
  }
}
