// app/api/orders/route.ts
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userEmail = request.nextUrl.searchParams.get("userId");
  const orders = userEmail ? await prisma.order.findMany({ where: { userId: userEmail } }) : await prisma.order.findMany();
  const formattedOrders = orders.map((order) => ({
    ...order,
    _id: order.id,
    items: order.items,
    total: order.total,
    status: order.status || "Pending",
    locationData: order.locationData,
    createdAt: order.createdAt.toISOString(),
  }));
  return NextResponse.json({ orders: formattedOrders });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { userId, cart, locationData, phoneNumber, customerEmail } = await request.json();
  if (!Array.isArray(cart) || cart.length === 0) return NextResponse.json({ error: "Invalid cart data" }, { status: 400 });
  const groupedItems = cart.reduce((acc, item) => {
    if (!acc[item.restaurantId]) acc[item.restaurantId] = [];
    acc[item.restaurantId].push(item);
    return acc;
  }, {});
  const orders = await Promise.all(
    Object.keys(groupedItems).map(async (restaurantId) => {
      const order = await prisma.order.create({
        data: {
          userId,
          items: groupedItems[restaurantId],
          phoneNumber,
          locationData,
          customerEmail,
          status: "Pending",
          total: groupedItems[restaurantId].reduce((subTotal: number, item: any) => {
            const itemPrice = parseFloat(item.price[item.selectedSize]);
            return subTotal + itemPrice * item.quantity;
          }, 0),
        },
      });
      return order;
    })
  );
  return NextResponse.json({ orders }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { orderId, status, userId } = await request.json();
  if (!orderId || !status) return NextResponse.json({ error: "Order ID and status are required" }, { status: 400 });
  const result = await prisma.order.update({ where: { id: orderId }, data: { status } });
  await pusherServer.trigger(`user-${userId}`, "order-updated", { orderId, status });
  await pusherServer.trigger("partner-channel", "order-updated", { orderId, status });
  return NextResponse.json({ message: "Order status updated successfully", result }, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const orderId = request.nextUrl.searchParams.get("orderId");
  if (!orderId) return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
  const result = await prisma.order.delete({ where: { id: orderId } });
  return result ? NextResponse.json({ message: "Order cancelled successfully", result }, { status: 200 }) : NextResponse.json({ error: "Order not found" }, { status: 404 });
}
