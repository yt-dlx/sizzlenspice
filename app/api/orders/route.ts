// app/api/orders/route.ts
import { auth } from "@/auth";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { pusherServer } from "@/lib/pusher";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const client = await clientPromise;
  const db = client.db();
  const userEmail = request.nextUrl.searchParams.get("userId");
  let orders;
  if (userEmail) orders = await db.collection("orders").find({ userId: userEmail }).toArray();
  else orders = await db.collection("orders").find().toArray();
  const formattedOrders = orders.map((order) => ({
    ...order,
    _id: order._id.toString(),
    items: order.items || [],
    status: order.status || "Pending",
    locationData: order.locationData || {},
    createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : null,
    total: typeof order.total === "number" ? order.total : parseFloat(order.total) || 0,
  }));
  return NextResponse.json({ orders: formattedOrders });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { userId, cart, totalAmount, locationData } = await request.json();
  if (!Array.isArray(cart) || cart.length === 0) return NextResponse.json({ error: "Invalid cart data" }, { status: 400 });
  const client = await clientPromise;
  const db = client.db();
  const orderId = new ObjectId();
  const orderDate = new Date();
  const orderDocument = {
    _id: orderId,
    items: cart.map((item) => ({
      title: item.title,
      image: item.image,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      price: item.price[item.selectedSize],
    })),
    userId: userId,
    status: "Pending",
    createdAt: orderDate,
    locationData: locationData,
    phoneNumber: locationData.phoneNumber,
    customerEmail: locationData.customerEmail,
    total: typeof totalAmount === "number" ? totalAmount : parseFloat(totalAmount),
  };
  if (isNaN(orderDocument.total)) return NextResponse.json({ error: "Invalid total amount" }, { status: 400 });
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

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { orderId, status, userId } = await request.json();
  if (!orderId || !status) return NextResponse.json({ error: "Order ID and status are required" }, { status: 400 });
  const client = await clientPromise;
  const db = client.db();
  try {
    const result = await db.collection("orders").updateOne({ _id: new ObjectId(orderId) }, { $set: { status: status } });
    if (result.matchedCount === 0) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    await pusherServer.trigger(`user-${userId}`, "order-updated", { orderId, status });
    await pusherServer.trigger("admin-channel", "order-updated", { orderId, status });
    return NextResponse.json({ message: "Order status updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
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
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 });
  }
}
