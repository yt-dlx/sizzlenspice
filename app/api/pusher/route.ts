// app/api/pusher/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: NextRequest) {
  const { channel, event, data } = await request.json();
  await pusherServer.trigger(channel, event, data);
  return NextResponse.json({ message: "Event triggered successfully" }, { status: 200 });
}
